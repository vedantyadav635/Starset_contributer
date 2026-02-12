const B2 = require('backblaze-b2');

// Initialize B2 client
const b2 = new B2({
    applicationKeyId: process.env.B2_APPLICATION_KEY_ID!,
    applicationKey: process.env.B2_APPLICATION_KEY!,
});

let authToken: string | null = null;
let uploadUrl: string | null = null;
let uploadAuthToken: string | null = null;

/**
 * Authenticate with B2 and get upload URL
 */
async function authenticateB2() {
    try {
        // Authorize account
        await b2.authorize();

        // Get upload URL
        const response = await b2.getUploadUrl({
            bucketId: process.env.B2_BUCKET_ID!,
        });

        uploadUrl = response.data.uploadUrl;
        uploadAuthToken = response.data.authorizationToken;

        console.log('✅ B2 authenticated successfully');
        return true;
    } catch (error) {
        console.error('❌ B2 authentication failed:', error);
        throw error;
    }
}

/**
 * Upload file to Backblaze B2
 * @param fileBuffer - The file buffer to upload
 * @param fileName - The name to save the file as
 * @param contentType - MIME type of the file
 * @returns Public URL of the uploaded file
 */
export async function uploadToB2(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string = 'audio/webm'
): Promise<string> {
    try {
        // Authenticate if not already authenticated
        if (!uploadUrl || !uploadAuthToken) {
            await authenticateB2();
        }

        // Upload the file
        const uploadResponse = await b2.uploadFile({
            uploadUrl: uploadUrl!,
            uploadAuthToken: uploadAuthToken!,
            fileName: fileName,
            data: fileBuffer,
            contentType: contentType,
        });

        console.log('✅ File uploaded to B2:', fileName);

        // Construct the public URL
        // Format: https://f{bucketId}.backblazeb2.com/file/{bucketName}/{fileName}
        const bucketName = process.env.B2_BUCKET_NAME!;
        const fileUrl = `https://f${process.env.B2_BUCKET_ID}.backblazeb2.com/file/${bucketName}/${fileName}`;

        return fileUrl;
    } catch (error: any) {
        console.error('❌ B2 upload failed:', error);

        // If upload URL expired, re-authenticate and retry once
        if (error.response?.status === 401) {
            console.log('🔄 Upload token expired, re-authenticating...');
            uploadUrl = null;
            uploadAuthToken = null;
            await authenticateB2();

            // Retry upload
            const uploadResponse = await b2.uploadFile({
                uploadUrl: uploadUrl!,
                uploadAuthToken: uploadAuthToken!,
                fileName: fileName,
                data: fileBuffer,
                contentType: contentType,
            });

            const bucketName = process.env.B2_BUCKET_NAME!;
            const fileUrl = `https://f${process.env.B2_BUCKET_ID}.backblazeb2.com/file/${bucketName}/${fileName}`;

            return fileUrl;
        }

        throw error;
    }
}

/**
 * Generate a unique filename for audio uploads
 * @param userId - User ID
 * @param taskId - Task ID
 * @returns Unique filename
 */
export function generateAudioFileName(userId: string, taskId: string): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `audio/${userId}/${taskId}_${timestamp}_${randomSuffix}.webm`;
}
