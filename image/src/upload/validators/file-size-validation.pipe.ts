import {
  FileValidator,
  Injectable,
  MaxFileSizeValidator,
} from '@nestjs/common';

@Injectable()
export class FileSizeValidator extends FileValidator<{
  maxFileSizeInMb: number;
}> {
  private maxFileSize: number;

  constructor(validationOptions: { maxFileSizeInMb: number }) {
    super(validationOptions);
    this.maxFileSize = validationOptions.maxFileSizeInMb * 1000 * 1000;
  }
  isValid(file: any): boolean {
    return file.size <= this.maxFileSize;
    MaxFileSizeValidator;
  }

  buildErrorMessage(file: any): string {
    return `File too big. Please use a file smaller than ${(
      this.maxFileSize /
      1000 /
      1000
    ).toFixed(2)} MB`;
  }
}
