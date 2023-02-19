import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';
import * as sharp from 'sharp';
import { UploadService } from './upload.service';

describe('UploadService', () => {
  let uploadService: UploadService;
  // Supress warning logs because env is not setup properly
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach(() => {
    uploadService = new UploadService(new ConfigService(), null);
  });
  describe('hashFile', () => {
    describe('Positive Tests', () => {
      it('Should hash file correctly', async () => {
        // ARRANGE
        const imagePath = join(
          process.cwd(),
          'test',
          'helpers',
          'test.png',
        );
        // ACT
        const res = await uploadService.hashFile(imagePath);
        // ASSERT
        const correctHash = createHash('sha256')
          .update(readFileSync(imagePath))
          .digest('hex');
        expect(res).toEqual(correctHash);
      });

      it('Should produce same result for same file', async () => {
        // ARRANGE
        const imagePath = join(
          process.cwd(),
          'test',
          'helpers',
          'test.png',
        );
        // ACT
        const res = await uploadService.hashFile(imagePath);
        // ASSERT
        expect(res).toEqual(await uploadService.hashFile(imagePath));
      });
      it('Should produce different results for different files', async () => {
        // ARRANGE
        const imagePath = join(
          process.cwd(),
          'test',
          'helpers',
          'test.png',
        );
        const imagePath2 = join(
          process.cwd(),
          'test',
          'helpers',
          'test.jpg',
        );
        // ACT
        const res = await uploadService.hashFile(imagePath);
        // ASSERT
        expect(res).not.toEqual(await uploadService.hashFile(imagePath2));
      });
    });
    describe('Negative Tests', () => {
      it('Should fail for non existent file', async () => {
        // ARRANGE
        const imagePath = join(
          process.cwd(),
          'test',
          'helpers',
          'not-existant.png',
        );
        // ACT
        await expect(uploadService.hashFile(imagePath)).rejects.toThrowError(
          'Filepath does not lead to file',
        );
      });
      it('Should fail for when pointed at a directory', async () => {
        // ARRANGE
        const imagePath = join(process.cwd(), 'test', 'helpers');
        // ACT
        await expect(uploadService.hashFile(imagePath)).rejects.toThrowError(
          'Filepath does not lead to file',
        );
      });
    });
  });

  describe('cropImage', () => {
    beforeEach(() => {
      if (!existsSync(join(process.cwd(), 'cropTest'))) {
        mkdirSync(join(process.cwd(), 'cropTest'));
      }
    });
    afterEach(() => {
      rmSync(join(process.cwd(), 'cropTest'), { recursive: true });
    });
    describe('Positive Tests', () => {
      it('Should not crop small images (png)', async () => {
        // ARRANGE
        const testFilePath = join(process.cwd(), 'cropTest', 'test.png');
        copyFileSync(
          join(process.cwd(), 'test', 'helpers', 'test.png'),
          testFilePath,
        );
        const initialMetadata = await sharp(testFilePath).metadata();
        // ACT
        await uploadService['cropImage'](testFilePath, 512, 512);
        // ASSERT
        // Disable cache to actually fetch new metadata and not reuse cached
        sharp.cache(false);
        expect(await sharp(testFilePath).metadata()).toEqual(initialMetadata);
      });
      it('Should not crop small images (jpg)', async () => {
        // ARRANGE
        const testFilePath = join(process.cwd(), 'cropTest', 'test.jpg');
        copyFileSync(
          join(process.cwd(), 'test', 'helpers', 'test.jpg'),
          testFilePath,
        );
        const initialMetadata = await sharp(testFilePath).metadata();
        // ACT
        await uploadService['cropImage'](testFilePath, 512, 512);
        // ASSERT
        // Disable cache to actually fetch new metadata and not reuse cached
        sharp.cache(false);
        expect(await sharp(testFilePath).metadata()).toEqual(initialMetadata);
      });
      it('Should crop images > provided dimensions', async () => {
        // ARRANGE
        const testFilePath = join(
          process.cwd(),
          'cropTest',
          'test-oversized.png',
        );
        copyFileSync(
          join(process.cwd(), 'test', 'helpers', 'test-oversized.png'),
          testFilePath,
        );
        // ACT
        await uploadService['cropImage'](testFilePath, 512, 512);
        // ASSERT
        // Disable cache to actually fetch new metadata and not reuse cached
        sharp.cache(false);
        const newMetadata = await sharp(testFilePath).metadata();
        expect(newMetadata.width).toEqual(512);
        expect(newMetadata.height).toEqual(512);
      });
    });
    describe('Negative Tests', () => {
      it('Should fail for path not pointing to anything', async () => {
        // ACT & ASSERT
        await expect(
          uploadService['cropImage'](
            join(process.cwd(), 'cropTest', '404.png'),
            512,
            512,
          ),
        ).rejects.toThrowError('Image cropping failed');
      });
      it('Should fail for path pointing to directory', async () => {
        // ACT & ASSERT
        await expect(
          uploadService['cropImage'](
            join(process.cwd(), 'cropTest'),
            512,
            512,
          ),
        ).rejects.toThrowError('Image cropping failed');
      });
    });
  });
});
