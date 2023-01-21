import { FileValidator, Injectable } from '@nestjs/common';

@Injectable()
export class FileTypeValidator extends FileValidator<{
  supportedFileTypes: string[];
}> {
  private supportedFileTypes: string[];

  constructor(validationOptions: { supportedFileTypes: string[] }) {
    super(validationOptions);
    this.supportedFileTypes = validationOptions.supportedFileTypes;
  }

  isValid(file: Express.Multer.File): boolean {
    return this.supportedFileTypes.includes(file.mimetype)
  }

  buildErrorMessage(file: Express.Multer.File): string {
    return `Unsupported Filetype (${
      file.mimetype
    }). Please convert image to a supported filetype (${this.supportedFileTypes.join(
      '-',
    )})`;
  }
}
