import * as fsProm from 'fs/promises';
import * as path from 'path';

export async function emptyDir(dirPath) {
  const contents = await fsProm.readdir(dirPath);
  for (const content of contents) {
    await fsProm.rm(path.join(dirPath, content), { recursive: true });
  }
}

export async function copyTestFile(target: string, fileName: string) {
  await fsProm.copyFile(
    path.join(process.cwd(), 'test', 'helpers', fileName),
    path.join(target, fileName),
  );
}
