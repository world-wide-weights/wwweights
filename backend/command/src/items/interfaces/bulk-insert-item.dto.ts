import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { InsertItemDto } from './insert-item.dto';

export class BulkInsertItemDTO extends InsertItemDto {
  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Userid for the creating user.',
    default: 0,
  })
  userId = 0;
}
