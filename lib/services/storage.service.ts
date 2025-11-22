import { storage } from '../firebase/admin';
import 'server-only';

export class StorageService {
  private get bucket() {
    return storage.bucket();
  }

  /**
   * Upload a file buffer
   */
  async uploadFile(
    fileBuffer: Buffer, 
    destinationPath: string, 
    mimeType: string
  ): Promise<string> {
    const file = this.bucket.file(destinationPath);
    
    await file.save(fileBuffer, {
      metadata: {
        contentType: mimeType,
      },
    });

    // Make the file public or generate a signed URL depending on requirements.
    // For this example, we'll return a signed URL valid for 1 hour, 
    // OR if the bucket is public, return the public URL.
    // Let's assume we want a long-lived signed URL or just the public URL if configured.
    
    // Ideally for a web app, you might want to make it public:
    // await file.makePublic();
    // return file.publicUrl();

    // Safer default: Signed URL
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60 * 24 * 365, // 1 year
    });

    return url;
  }

  /**
   * Delete a file
   */
  async deleteFile(path: string) {
    await this.bucket.file(path).delete();
  }

  /**
   * Get a read-only signed URL
   */
  async getDownloadUrl(path: string) {
    const [url] = await this.bucket.file(path).getSignedUrl({
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60, // 1 hour
    });
    return url;
  }
}

export const storageService = new StorageService();
