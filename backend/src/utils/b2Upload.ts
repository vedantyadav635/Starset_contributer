const B2 = require('backblaze-b2');

// ─────────────────────────────────────────────────────────────────────────────
// Bucket configuration
// ─────────────────────────────────────────────────────────────────────────────
interface BucketConfig {
    bucketId: string;
    bucketName: string;
    clusterUrl: string; // e.g. "f003.backblazeb2.com"
}

function getBucket(stage: 'raw' | 'final' | 'processed'): BucketConfig {
    const map: Record<string, { idKey: string; nameKey: string }> = {
        raw: { idKey: 'B2_RAW_BUCKET_ID', nameKey: 'B2_RAW_BUCKET_NAME' },
        final: { idKey: 'B2_FINAL_BUCKET_ID', nameKey: 'B2_FINAL_BUCKET_NAME' },
        processed: { idKey: 'B2_PROCESSED_BUCKET_ID', nameKey: 'B2_PROCESSED_BUCKET_NAME' },
    };
    const { idKey, nameKey } = map[stage];
    const bucketId = process.env[idKey];
    const bucketName = process.env[nameKey];
    if (!bucketId || !bucketName) {
        throw new Error(`Missing env vars for ${stage} bucket: ${idKey} and/or ${nameKey}`);
    }
    return { bucketId, bucketName, clusterUrl: 'f003.backblazeb2.com' };
}

function buildPublicUrl(bucket: BucketConfig, fileName: string): string {
    return `https://${bucket.clusterUrl}/file/${bucket.bucketName}/${fileName}`;
}

/** Create a fresh, authenticated B2 client */
async function createB2Client() {
    const keyId = process.env.B2_APPLICATION_KEY_ID;
    const appKey = process.env.B2_APPLICATION_KEY;
    if (!keyId || !appKey) throw new Error('Missing B2_APPLICATION_KEY_ID or B2_APPLICATION_KEY');
    const b2 = new B2({ applicationKeyId: keyId, applicationKey: appKey });
    await b2.authorize();
    return b2;
}

// ─────────────────────────────────────────────────────────────────────────────
// Upload to a specific bucket
// ─────────────────────────────────────────────────────────────────────────────
export interface UploadResult {
    url: string;
    fileId: string;
    fileName: string;
}

export async function uploadToBucket(
    buffer: Buffer,
    fileName: string,
    contentType: string,
    stage: 'raw' | 'final' | 'processed'
): Promise<UploadResult> {
    const bucket = getBucket(stage);
    console.log(`⬆️  Uploading to ${stage} bucket (${bucket.bucketName}): ${fileName}`);

    const b2 = await createB2Client();

    const uploadUrlResp = await b2.getUploadUrl({ bucketId: bucket.bucketId });
    const uploadUrl = uploadUrlResp.data.uploadUrl;
    const uploadAuthToken = uploadUrlResp.data.authorizationToken;

    const uploadResp = await b2.uploadFile({
        uploadUrl,
        uploadAuthToken,
        fileName,
        data: buffer,
        contentType,
    });

    const fileId = uploadResp.data.fileId;
    const url = buildPublicUrl(bucket, fileName);
    console.log(`✅ Uploaded to ${stage}: fileId=${fileId}`);

    return { url, fileId, fileName };
}

// ─────────────────────────────────────────────────────────────────────────────
// Copy a file from one bucket to another (uses B2 server-side copy — no re-download)
// ─────────────────────────────────────────────────────────────────────────────
export async function copyBetweenBuckets(
    sourceFileId: string,
    destinationFileName: string,
    destinationStage: 'final' | 'processed'
): Promise<UploadResult> {
    const destBucket = getBucket(destinationStage);
    console.log(`📋 Copying file ${sourceFileId} → ${destinationStage} bucket (${destBucket.bucketName})`);

    const b2 = await createB2Client();

    const copyResp = await b2.copyFile({
        sourceFileId,
        destinationBucketId: destBucket.bucketId,
        fileName: destinationFileName,
        metadataDirective: 'COPY',  // Preserve content-type and other metadata
    });

    const newFileId = copyResp.data.fileId;
    const url = buildPublicUrl(destBucket, destinationFileName);
    console.log(`✅ Copied to ${destinationStage}: fileId=${newFileId}`);

    return { url, fileId: newFileId, fileName: destinationFileName };
}

// ─────────────────────────────────────────────────────────────────────────────
// Legacy helper (for image/text submissions that still use one bucket)
// ─────────────────────────────────────────────────────────────────────────────
export async function uploadToB2(
    buffer: Buffer,
    fileName: string,
    contentType: string = 'audio/webm'
): Promise<string> {
    // Falls back to raw bucket for images etc.
    const result = await uploadToBucket(buffer, fileName, contentType, 'raw');
    return result.url;
}

// ─────────────────────────────────────────────────────────────────────────────
// Filename generators
// ─────────────────────────────────────────────────────────────────────────────
export function generateAudioFileName(userId: string, taskId: string): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `audio/${userId}/${taskId}_${timestamp}_${randomSuffix}.webm`;
}
