import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Page } from '../../shared/interfaces/page';

/**
 * @description Query DTO to retrieve a list of items related to a given item
 */
export class QueryItemRelatedDto extends Page {
  @IsString()
  @ApiProperty({
    description: 'The slug of the item for which we want to get related items',
    example: 'apple',
  })
  slug: string;
}
