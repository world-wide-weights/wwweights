import * as fsProm from 'fs/promises';
import * as path from 'path';

export async function emptyDir(dirPath) {
  const contents = await fsProm.readdir(dirPath);
  for (const content of contents) {
    await fsProm.rm(path.join(dirPath, content), { recursive: true });
  }
}
