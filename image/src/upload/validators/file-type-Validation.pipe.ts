import {
  ArgumentMetadata,
  Injectable,
  MaxFileSizeValidator,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  private allowedFileTypes: string[];
  constructor(allowedFileTypeList: string[]) {
    this.allowedFileTypes = allowedFileTypeList;
  }

  transform(value: any, metadata: ArgumentMetadata) {
    if (!(value.mimeType in this.allowedFileTypes)) {
      throw new UnprocessableEntityException(
        `Unaccepted filetype. Please provide a file with one of the following types: ${this.allowedFileTypes.join(
          ',',
        )}`,
      );
    }
    return value;
  }
}
