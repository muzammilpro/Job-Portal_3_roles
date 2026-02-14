import fs from 'fs/promises';
import path from 'path';

// For Base64 file storage
export async function saveBase64File(base64Data, fileName, folder = 'uploads') {
  try {
    // Remove data URL prefix if present
    const base64String = base64Data.replace(/^data:image\/\w+;base64,/, '');
    
    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', folder);
    await fs.mkdir(uploadDir, { recursive: true });
    
    // Create file path
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName}`;
    const filePath = path.join(uploadDir, uniqueFileName);
    
    // Write file
    await fs.writeFile(filePath, base64String, 'base64');
    
    // Return relative URL
    return `/uploads/${uniqueFileName}`;
  } catch (error) {
    console.error('Error saving base64 file:', error);
    throw error;
  }
}

// For Base64 data URL parsing
export function parseBase64Data(base64Data) {
  const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid base64 data URL');
  }
  
  const mimeType = matches[1];
  const base64String = matches[2];
  const fileExtension = mimeType.split('/')[1];
  
  return {
    mimeType,
    base64String,
    fileExtension
  };
}

// Delete file
export async function deleteFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath);
    await fs.unlink(fullPath);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}