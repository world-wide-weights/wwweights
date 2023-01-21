import * as path from 'path';
import * as fs from 'fs';
import {
  pathBuilder,
  getOSAbsolutePathIndicator,
  validateOrCreateDirectory,
} from './file-path.helpers';

describe('file-path.helper.ts', () => {
  describe('pathBuilder', () => {
    describe('Positive Tests', () => {
      it('Should return an absolute path unchanged', () => {
        // ARRANGE
        const absolutePath = process.cwd();
        // ACT
        const res = pathBuilder(absolutePath, 'If/I/See/This/It/Failed');
        // ASSERT
        expect(res).toEqual(absolutePath);
      });
      it('Should convert simple relative path to absolute path', () => {
        // ARRANGE
        const relativePath = './testing';
        // ACT
        const res = pathBuilder(relativePath, 'If/I/See/This/It/Failed');
        // ASSERT
        expect(res).toEqual(path.join(process.cwd(), `testing`));
      });
      it('Should convert complex relative path to absolute path', () => {
        // ARRANGE
        const relativePath = './test/helpers/../../src/shared/../../testing';
        // ACT
        const res = pathBuilder(relativePath, 'If/I/See/This/It/Failed');
        // ASSERT
        expect(res).toEqual(path.join(process.cwd(), `testing`));
      });
      it('Should use fallback folder in cwd if no path was passed', () => {
        // ARRANGE
        const fallback = 'fallback';
        // ACT
        const res = pathBuilder(null, fallback);
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
        const res = getOSAbsolutePathIndicator();
        // ASSERT
        expect('/home/testuser/Desktop').toMatch(res);
        expect('C:\\Documents\\Newsletters\\').not.toMatch(res);
      });
      // But people develop with Windows and Mac so this must work at all times
      it('Should return OS X value correctly', async () => {
        // ARRANGE
        Object.defineProperties(process, { platform: { value: 'darwin' } });
        // ACT
        const res = getOSAbsolutePathIndicator();
        // ASSERT
        expect('/home/testuser/Desktop').toMatch(res);
        expect('C:\\Documents\\Newsletters\\').not.toMatch(res);
      });
      it('Should return unix value correctly', async () => {
        // ARRANGE
        Object.defineProperties(process, { platform: { value: 'win32' } });
        // ACT
        const res = getOSAbsolutePathIndicator();
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
        const res = getOSAbsolutePathIndicator();
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
          validateOrCreateDirectory(existingPath),
        ).not.toThrowError();
        expect(fs.existsSync(existingPath)).toEqual(true);
      });
      it('Should create directory if not exists', () => {
        // ARRANGE
        const newPath = path.join(process.cwd(), 'validationTesting');
        // ACT & ASSERT
        expect(() => validateOrCreateDirectory(newPath)).not.toThrowError();
        expect(fs.existsSync(newPath)).toEqual(true);
      });
    });
    describe('Negative Tests', () => {
      it('Should fail for path to file', () => {
        // ARRANGE
        const existingFilePath = path.join(process.cwd(), 'src', 'main.ts');
        // ACT & ASSERT
        expect(() => validateOrCreateDirectory(existingFilePath)).toThrowError(
          `${existingFilePath} does not point to directory and therefore is not allowed in this context`,
        );
      });
    });
  });
});
