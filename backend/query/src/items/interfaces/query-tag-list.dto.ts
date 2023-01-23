import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Page } from './page';

export class QueryTagListDto extends Page {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  sort = 'ASC'; // asc, desc, most-used, relevance // Not an ENUM because ENUMS are inperformant and can lead to spaghetti code
}
