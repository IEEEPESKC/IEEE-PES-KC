import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Upload file to R2
export async function uploadToR2(file, folder, fileName) {
  try {
    const key = `${folder}/${fileName}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });
    
    await r2Client.send(command);
    
    // Return public URL
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
    return {
      success: true,
      url: publicUrl,
      key: key,
    };
  } catch (error) {
    console.error('R2 Upload Error:', error);
    return { success: false, error: error.message };
  }
}

// Delete file from R2
export async function deleteFromR2(key) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });
    
    await r2Client.send(command);
    return { success: true };
  } catch (error) {
    console.error('R2 Delete Error:', error);
    return { success: false, error: error.message };
  }
}

// Get file URL
export function getFileUrl(key) {
  return `${process.env.R2_PUBLIC_URL}/${key}`;
}

// Helper to determine folder based on content type
export function getFolderForType(type, subType) {
  const folderMap = {
    events: 'images/events',
    gallery: 'images/gallery',
    execom: 'images/execom',
    awards: 'images/awards',
    recognitions: 'images/recognitions',
    newsletters: {
      image: 'images/newsletters',
      pdf: 'documents/newsletters',
    },
    magazines: {
      image: 'images/magazines',
      pdf: 'documents/magazines',
    },
  };
  
  if (typeof folderMap[type] === 'string') {
    return folderMap[type];
  }
  
  if (folderMap[type] && folderMap[type][subType]) {
    return folderMap[type][subType];
  }
  
  return `uploads/${type}`;
}