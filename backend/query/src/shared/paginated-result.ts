import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class PaginatedResult<T> {
  @Expose()
  @ApiResponseProperty()
  total: number;
  @Expose()
  @ApiResponseProperty()
  page: number;
  @Expose()
  @ApiResponseProperty()
  limit: number;
  @Expose()
  @ApiResponseProperty({ type: () => [String] })
  @Transform(({ obj }) =>
    obj.data.map((data) => new obj.classConstructor(data)),
  )
  data: T[];

  classConstructor: new (params: any) => T;

  constructor(
    partial: Partial<PaginatedResult<T>>,
    classConstructor: new (params: any) => T,
  ) {
    Object.assign(this, partial);
    this.classConstructor = classConstructor;
  }
}
