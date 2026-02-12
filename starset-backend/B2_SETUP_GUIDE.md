# Backblaze B2 Integration Setup Guide

This guide will help you set up Backblaze B2 storage for audio and image submissions in the Starset Contributor platform.

## Prerequisites

- A Backblaze account (sign up at https://www.backblaze.com/b2/sign-up.html)
- Node.js and npm installed
- Backend server running

## Step 1: Create a Backblaze B2 Bucket

1. **Log in to Backblaze B2**
   - Go to https://secure.backblaze.com/user_signin.htm
   - Sign in with your credentials

2. **Create a New Bucket**
   - Navigate to "Buckets" in the left sidebar
   - Click "Create a Bucket"
   - **Bucket Name**: Choose a unique name (e.g., `starset-submissions`)
   - **Files in Bucket**: Select "Public" (so files can be accessed via URL)
   - **Encryption**: Choose based on your security requirements
   - Click "Create a Bucket"

3. **Note Your Bucket Information**
   - **Bucket Name**: The name you just created
   - **Bucket ID**: Found in the bucket details page

## Step 2: Create Application Keys

1. **Navigate to App Keys**
   - In the Backblaze dashboard, go to "App Keys" in the left sidebar

2. **Create a New Application Key**
   - Click "Add a New Application Key"
   - **Name of Key**: e.g., "Starset Backend"
   - **Allow access to Bucket(s)**: Select your bucket
   - **Type of Access**: Read and Write
   - **Allow List All Bucket Names**: Yes (recommended)
   - Click "Create New Key"

3. **Save Your Credentials** (IMPORTANT!)
   - **Application Key ID**: Copy this immediately
   - **Application Key**: Copy this immediately (it's only shown once!)
   
   ⚠️ **Warning**: The Application Key is only shown once. Save it securely!

## Step 3: Configure Backend Environment Variables

1. **Open the backend `.env` file**
   ```bash
   cd starset-backend
   nano .env  # or use your preferred editor
   ```

2. **Add your B2 credentials**
   ```bash
   # Backblaze B2 Configuration
   B2_APPLICATION_KEY_ID=your_application_key_id_here
   B2_APPLICATION_KEY=your_application_key_here
   B2_BUCKET_ID=your_bucket_id_here
   B2_BUCKET_NAME=your_bucket_name_here
   ```

3. **Replace the placeholder values** with your actual credentials:
   - `B2_APPLICATION_KEY_ID`: The Key ID from Step 2
   - `B2_APPLICATION_KEY`: The Application Key from Step 2
   - `B2_BUCKET_ID`: The Bucket ID from Step 1
   - `B2_BUCKET_NAME`: The Bucket Name from Step 1

## Step 4: Set Up Database

1. **Run the SQL migration**
   - Open Supabase Dashboard
   - Go to SQL Editor
   - Copy the contents of `starset-backend/migrations/create_submissions_table.sql`
   - Paste and execute the SQL

2. **Verify the table was created**
   ```sql
   SELECT * FROM submissions LIMIT 1;
   ```

## Step 5: Test the Integration

1. **Restart the backend server**
   ```bash
   cd starset-backend
   npm run dev
   ```

2. **Check for B2 authentication**
   - Look for "✅ B2 authenticated successfully" in the logs when a file is uploaded

3. **Test audio submission**
   - Go to the frontend application
   - Select an audio task
   - Record and submit audio
   - Check the console for "✅ Audio submitted successfully"

4. **Verify file in B2**
   - Go to your Backblaze B2 bucket
   - Navigate to the "audio" folder
   - You should see uploaded files organized by user ID

## File Structure in B2

Files are organized in the following structure:

```
your-bucket/
├── audio/
│   └── {userId}/
│       └── {taskId}_{timestamp}_{random}.webm
└── images/
    └── {userId}/
        └── {taskId}_{timestamp}_{random}.png
```

## Accessing Uploaded Files

Files are accessible via public URLs in the format:
```
https://f{bucketId}.backblazeb2.com/file/{bucketName}/{filePath}
```

Example:
```
https://f001234567890abcdef.backblazeb2.com/file/starset-submissions/audio/user123/task456_1234567890_abc123.webm
```

## Security Considerations

1. **Keep credentials secure**: Never commit `.env` files to version control
2. **Use environment-specific keys**: Different keys for development and production
3. **Monitor usage**: Check B2 dashboard regularly for unusual activity
4. **Set bucket policies**: Configure appropriate CORS and lifecycle rules

## Troubleshooting

### Error: "B2 authentication failed"
- Verify your Application Key ID and Application Key are correct
- Ensure the key has read/write permissions for the bucket
- Check if the key is still active in the B2 dashboard

### Error: "Failed to upload file"
- Check your internet connection
- Verify the bucket ID and name are correct
- Ensure the bucket is set to "Public"
- Check B2 service status at https://status.backblaze.com/

### Error: "No audio file provided"
- Ensure the frontend is sending the audio blob correctly
- Check browser console for errors during recording
- Verify microphone permissions are granted

### Files not appearing in B2
- Check the backend logs for upload errors
- Verify the file path structure is correct
- Ensure the bucket name matches your configuration

## Cost Estimation

Backblaze B2 pricing (as of 2024):
- **Storage**: $0.005/GB/month
- **Downloads**: $0.01/GB (first 1GB free per day)
- **API Calls**: Free for most operations

Example monthly cost for 1000 audio submissions (avg 500KB each):
- Storage: 500MB = $0.0025/month
- Very cost-effective for most use cases!

## Additional Resources

- [Backblaze B2 Documentation](https://www.backblaze.com/b2/docs/)
- [B2 Node.js SDK](https://github.com/yakovkhalinsky/backblaze-b2)
- [Backblaze B2 Pricing](https://www.backblaze.com/b2/cloud-storage-pricing.html)

## Support

If you encounter issues:
1. Check the backend logs for detailed error messages
2. Review this setup guide carefully
3. Contact Backblaze support for B2-specific issues
4. Check the project documentation for application-specific help
