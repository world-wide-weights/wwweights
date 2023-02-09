import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { InsertItemCommand } from './commands/insert-item.command';
import { InsertItemDto } from './interfaces/insert-item.dto';

@Controller()
@ApiTags()
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class ItemsController {
  private readonly logger = new Logger(ItemsController.name);

  constructor(private commandBus: CommandBus) {}

  @Post('items/insert')
  @ApiBody({ type: InsertItemDto })
  @ApiOperation({ summary: 'Insert an item' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Item inserted successfully',
  })
  @ApiConflictResponse({
    status: HttpStatus.CONFLICT,
    description: 'Slug already taken',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request. Data validation failed.',
  })
  @HttpCode(HttpStatus.OK)
  async insertItem(@Body() insertItemDto: InsertItemDto) {
    await this.commandBus.execute(new InsertItemCommand(insertItemDto));
  }
}
