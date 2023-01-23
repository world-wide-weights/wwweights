import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Page } from './page';

export class QueryItemRelatedDto extends Page {
  @IsString()
  @ApiProperty()
  slug: string;
}
