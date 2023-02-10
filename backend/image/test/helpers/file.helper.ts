import { copyFile, readdir, rm } from 'fs/promises';
import { join } from 'path';

export async function emptyDir(dirPath) {
  const contents = await readdir(dirPath);
  for (const content of contents) {
    await rm(join(dirPath, content), { recursive: true });
  }
}

export async function copyTestFile(target: string, fileName: string) {
  await copyFile(
    join(process.cwd(), 'test', 'helpers', fileName),
    join(target, fileName),
  );
}
