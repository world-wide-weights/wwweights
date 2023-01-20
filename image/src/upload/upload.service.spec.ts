import { ConfigService } from '@nestjs/config';
import { UploadService } from './upload.service';
import * as path from 'path';
import { createHash } from 'crypto';
import * as fs from 'fs';

describe('UploadService', () => {
  let uploadService: UploadService;
  beforeEach(() => {
    uploadService = new UploadService(new ConfigService());
  });
  describe('hashFile', () => {
    describe('Positive Tests', () => {
      it('Should hash file contents', async () => {
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
    });
  });
});
