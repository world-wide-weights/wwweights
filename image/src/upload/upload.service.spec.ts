import { ConfigService } from '@nestjs/config';
import { UploadService } from './upload.service';
import * as path from 'path';
import { createHash } from 'crypto';
import * as fs from 'fs';
import * as sharp from 'sharp';

describe('UploadService', () => {
  let uploadService: UploadService;
  // Supress warning logs because env is not setup properly
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach(() => {
    uploadService = new UploadService(new ConfigService());
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
  describe('pathBuilder', () => {
    describe('Positive Tests', () => {
      it('Should return an absolute path unchanged', () => {
        // ARRANGE
        const absolutePath = process.cwd();
        // ACT
        const res = uploadService['pathBuilder'](
          absolutePath,
          'If/I/See/This/It/Failed',
        );
        // ASSERT
        expect(res).toEqual(absolutePath);
      });
      it('Should convert simple relative path to absolute path', () => {
        // ARRANGE
        const relativePath = './testing';
        // ACT
        const res = uploadService['pathBuilder'](
          relativePath,
          'If/I/See/This/It/Failed',
        );
        // ASSERT
        expect(res).toEqual(path.join(process.cwd(), `testing`));
      });
      it('Should convert complex relative path to absolute path', () => {
        // ARRANGE
        const relativePath = './test/helpers/../../src/shared/../../testing';
        // ACT
        const res = uploadService['pathBuilder'](
          relativePath,
          'If/I/See/This/It/Failed',
        );
        // ASSERT
        expect(res).toEqual(path.join(process.cwd(), `testing`));
      });
      it('Should use fallback folder in cwd if no path was passed', () => {
        // ARRANGE
        const fallback = 'fallback';
        // ACT
        const res = uploadService['pathBuilder'](null, fallback);
        // ASSERT
        expect(res).toEqual(path.join(process.cwd(), fallback));
      });
    });
  });
  describe('getOSAbsolutePathIndicator', () => {
    describe('Positive Tests', () => {
      const initial = process.platform;
      afterAll(() => {
        Object.defineProperties(process, { platform: { value: initial } });
      });
      // Testing with linux as it will most likely be the production env
      // Who uses Windows Servers anyway?
      it('Should return linux value correctly', async () => {
        // ARRANGE
        Object.defineProperties(process, { platform: { value: 'linux' } });
        // ACT
        const res = uploadService['getOSAbsolutePathIndicator']();
        // ASSERT
        expect('/home/testuser/Desktop').toMatch(res);
        expect('C:\\Documents\\Newsletters\\').not.toMatch(res);
      });
      // But people develop with Windows and Mac so this must work at all times
      it('Should return OS X value correctly', async () => {
        // ARRANGE
        Object.defineProperties(process, { platform: { value: 'darwin' } });
        // ACT
        const res = uploadService['getOSAbsolutePathIndicator']();
        // ASSERT
        expect('/home/testuser/Desktop').toMatch(res);
        expect('C:\\Documents\\Newsletters\\').not.toMatch(res);
      });
      it('Should return unix value correctly', async () => {
        // ARRANGE
        Object.defineProperties(process, { platform: { value: 'win32' } });
        // ACT
        const res = uploadService['getOSAbsolutePathIndicator']();
        // ASSERT
        expect('/home/testuser/Desktop').not.toMatch(res);
        expect('C:\\Documents\\Newsletters\\').toMatch(res);
      });
      it('Should default to unix', async () => {
        // ARRANGE
        Object.defineProperties(process, {
          platform: {
            value: 'No. 2 with extra Fries and a Diet Coke please',
          },
        });
        // ACT
        const res = uploadService['getOSAbsolutePathIndicator']();
        // ASSERT
        expect('/home/testuser/Desktop').toMatch(res);
        expect('C:\\Documents\\Newsletters\\').not.toMatch(res);
      });
    });
  });
  describe('validateOrCreateDirectory', () => {
    afterEach(() => {
      if (fs.existsSync(path.join(process.cwd(), 'validationTesting'))) {
        fs.rmdirSync(path.join(process.cwd(), 'validationTesting'));
      }
    });
    describe('Positive Tests', () => {
      it('Should pass without effect for existing directory', () => {
        // ARRANGE
        const existingPath = path.join(process.cwd(), 'src');
        // ACT & ASSERT
        expect(() =>
          uploadService['validateOrCreateDirectory'](existingPath),
        ).not.toThrowError();
        expect(fs.existsSync(existingPath)).toEqual(true);
      });
      it('Should create directory if not exists', () => {
        // ARRANGE
        const newPath = path.join(process.cwd(), 'validationTesting');
        // ACT & ASSERT
        expect(() =>
          uploadService['validateOrCreateDirectory'](newPath),
        ).not.toThrowError();
        expect(fs.existsSync(newPath)).toEqual(true);
      });
    });
    describe('Negative Tests', () => {
      it('Should fail for path to file', () => {
        // ARRANGE
        const existingFilePath = path.join(process.cwd(), 'src', 'main.ts');
        // ACT & ASSERT
        expect(() =>
          uploadService['validateOrCreateDirectory'](existingFilePath),
        ).toThrowError(
          `${existingFilePath} does not point to directory and therefore is not allowed in this context`,
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
