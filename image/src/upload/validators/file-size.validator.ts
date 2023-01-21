import { FileValidator, Injectable } from '@nestjs/common';

@Injectable()
export class FileSizeValidator extends FileValidator<{
  maxFileSizeInMb: number;
}> {
  private maxFileSize: number;

  constructor(validationOptions: { maxFileSizeInMb: number }) {
    super(validationOptions);
    this.maxFileSize = validationOptions.maxFileSizeInMb * 1024 * 1024;
  }
  isValid(file: Express.Multer.File): boolean {
    return file.size <= this.maxFileSize;
  }

  buildErrorMessage(_: Express.Multer.File): string {
    return `File too big. Please use a file smaller than ${(
      this.maxFileSize /
      1000 /
      1000
    ).toFixed(2)} MB`;
  }
}
