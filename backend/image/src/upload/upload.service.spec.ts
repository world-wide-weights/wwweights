import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
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
        const imagePath = path.join(
          process.cwd(),
          'test',
          'helpers',
          'test.png',
        );
        // ACT
        const res = await uploadService.hashFile(imagePath);
        // ASSERT
        const correctHash = createHash('sha256')
          .update(fs.readFileSync(imagePath))
          .digest('hex');
        expect(res).toEqual(correctHash);
      });

      it('Should produce same result for same file', async () => {
        // ARRANGE
        const imagePath = path.join(
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
        const imagePath = path.join(
          process.cwd(),
          'test',
          'helpers',
          'test.png',
        );
        const imagePath2 = path.join(
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
        const imagePath = path.join(
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
        const imagePath = path.join(process.cwd(), 'test', 'helpers');
        // ACT
        await expect(uploadService.hashFile(imagePath)).rejects.toThrowError(
          'Filepath does not lead to file',
        );
      });
    });
  });

  describe('cropImage', () => {
    beforeEach(() => {
      if (!fs.existsSync(path.join(process.cwd(), 'cropTest'))) {
        fs.mkdirSync(path.join(process.cwd(), 'cropTest'));
      }
    });
    afterEach(() => {
      fs.rmSync(path.join(process.cwd(), 'cropTest'), { recursive: true });
    });
    describe('Positive Tests', () => {
      it('Should not crop small images (png)', async () => {
        // ARRANGE
        const testFilePath = path.join(process.cwd(), 'cropTest', 'test.png');
        fs.copyFileSync(
          path.join(process.cwd(), 'test', 'helpers', 'test.png'),
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
        const testFilePath = path.join(process.cwd(), 'cropTest', 'test.jpg');
        fs.copyFileSync(
          path.join(process.cwd(), 'test', 'helpers', 'test.jpg'),
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
        const testFilePath = path.join(
          process.cwd(),
          'cropTest',
          'test-oversized.png',
        );
        fs.copyFileSync(
          path.join(process.cwd(), 'test', 'helpers', 'test-oversized.png'),
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
            path.join(process.cwd(), 'cropTest', '404.png'),
            512,
            512,
          ),
        ).rejects.toThrowError('Image could not be found within cache');
      });
      it('Should fail for path pointing to directory', async () => {
        // ACT & ASSERT
        await expect(
          uploadService['cropImage'](
            path.join(process.cwd(), 'cropTest'),
            512,
            512,
          ),
        ).rejects.toThrowError('Cannot crop directory');
      });
    });
  });
});
