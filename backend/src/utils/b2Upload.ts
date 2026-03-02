const B2 = require('backblaze-b2');

/**
 * Upload file to Backblaze B2
 * Creates a fresh B2 client each time to avoid stale auth tokens
 * and env var issues on Render cold starts.
 */
export async function uploadToB2(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string = 'audio/webm'
): Promise<string> {
    const keyId = process.env.B2_APPLICATION_KEY_ID;
    const appKey = process.env.B2_APPLICATION_KEY;
    const bucketId = process.env.B2_BUCKET_ID;
    const bucketName = process.env.B2_BUCKET_NAME;

    // Validate all required env vars are present
    if (!keyId || !appKey || !bucketId || !bucketName) {
        const missing = [
            !keyId && 'B2_APPLICATION_KEY_ID',
            !appKey && 'B2_APPLICATION_KEY',
            !bucketId && 'B2_BUCKET_ID',
            !bucketName && 'B2_BUCKET_NAME',
        ].filter(Boolean).join(', ');
        throw new Error(`Missing B2 environment variables: ${missing}`);
    }

    console.log(`📦 B2 Upload: keyId=${keyId.slice(0, 8)}..., bucket=${bucketName}, file=${fileName}`);

    // Create a fresh B2 client (avoids module-load-time env var issues)
    const b2 = new B2({ applicationKeyId: keyId, applicationKey: appKey });

    // Step 1: Authorize
    console.log('🔐 Authorizing with B2...');
    await b2.authorize();
    console.log('✅ B2 authorized');

    // Step 2: Get upload URL
    console.log('🔗 Getting B2 upload URL...');
    const uploadUrlResponse = await b2.getUploadUrl({ bucketId });
    const uploadUrl = uploadUrlResponse.data.uploadUrl;
    const uploadAuthToken = uploadUrlResponse.data.authorizationToken;
    console.log('✅ Got B2 upload URL');

    // Step 3: Upload
    console.log(`⬆️  Uploading ${(fileBuffer.length / 1024).toFixed(1)} KB to B2...`);
    await b2.uploadFile({
        uploadUrl,
        uploadAuthToken,
        fileName,
        data: fileBuffer,
        contentType,
    });
    console.log('✅ B2 upload complete:', fileName);

    // Construct the download URL
    // Native B2 format: https://f{cluster}.backblazeb2.com/file/{bucketName}/{fileName}
    // The cluster for eu-central-003 is 003
    const fileUrl = `https://f003.backblazeb2.com/file/${bucketName}/${fileName}`;

    return fileUrl;
}

/**
 * Generate a unique filename for audio uploads
 */
export function generateAudioFileName(userId: string, taskId: string): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `audio/${userId}/${taskId}_${timestamp}_${randomSuffix}.webm`;
}
