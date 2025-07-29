import * as path from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { randomUUID } from 'crypto';

/**
 * Saves a media file buffer to the local 'uploads' directory.
 * @param buffer The file content as a Buffer.
 * @param mimeType The MIME type of the file (e.g., 'image/jpeg').
 * @returns A promise that resolves to the full path of the saved file.
 */
export async function saveMediaToServer(
  buffer: Buffer,
  mimeType: string,
): Promise<string> {
  // Determine a safe file extension from the MIME type
  const extension = mimeType.split('/')[1] || 'tmp';

  // Define the uploads directory in the project root
  const uploadsDir = path.join(process.cwd(), 'uploads');
  await mkdir(uploadsDir, { recursive: true }); // Ensure directory exists

  // Generate a unique filename
  const filename = `${randomUUID()}.${extension}`;
  const localPath = path.join(uploadsDir, filename);

  // Write the file and return its path
  await writeFile(localPath, buffer);
  console.log(`Media file saved to: ${localPath}`);
  return localPath;
}
