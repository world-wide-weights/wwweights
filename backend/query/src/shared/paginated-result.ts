import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { Item } from '../items/models/item.model';
import { Tag } from '../tags/models/tag.model';

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
  @ApiResponseProperty({ type: () => [Item] || [Tag] }) // Unfortunately, this is not working
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
