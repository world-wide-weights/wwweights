import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Page } from '../../shared/interfaces/page';

export class QueryItemRelatedDto extends Page {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'The slug of the item for which we want to get related items',
    example: 'test',
  })
  slug: string;
}
