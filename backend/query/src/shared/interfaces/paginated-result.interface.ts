import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

/**
 * @description Paginated response for generic data
 */
export class PaginatedResponse<T> {
  @Expose()
  @ApiResponseProperty({ example: 69 })
  total: number;

  @Expose()
  @ApiResponseProperty({ example: 2 })
  page: number;

  @Expose()
  @ApiResponseProperty({ example: 16 })
  limit: number;

  @Expose()
  // Unfortunately, this does not work with generics, but the response examples are correct via the @ApiOkResponsePaginated decorator
  @ApiResponseProperty({ type: [Object] })
  @Transform(({ obj }) =>
    obj.data.map((data) => new obj.classConstructor(data)),
  )
  data: T[];

  classConstructor?: new (params: any) => T;

  constructor(
    partial: Partial<PaginatedResponse<T>>,
    classConstructor: new (params: any) => T,
  ) {
    Object.assign(this, partial);
    this.classConstructor = classConstructor;
  }
}
