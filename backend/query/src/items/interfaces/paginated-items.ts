import { Expose, Transform } from 'class-transformer';

export class PaginatedResult<T> {
  @Expose()
  total: number;
  @Expose()
  page: number;
  @Expose()
  limit: number;
  @Expose()
  @Transform(({ obj }) =>
    obj.items.map((item) => new obj.classConstructor(item)),
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
