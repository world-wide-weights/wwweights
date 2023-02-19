import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { InsertItemDto } from './insert-item.dto';

/**
 * @description DTO for inserting chunks of items at once
 */
export class BulkInsertItemDTO extends InsertItemDto {
  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'User Id for the creating user.',
    default: 0,
  })
  userId = 0;
}
