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
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InsertItemCommand } from './commands/insert-item.command';
import { InsertItemDto } from './interfaces/insert-item.dto';

@Controller('command/v1')
@ApiTags('command/v1')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class CommandsController {
  private readonly logger = new Logger(CommandsController.name);

  constructor(private commandBus: CommandBus) {}

  @Post('items/insert')
  @ApiBody({ type: InsertItemDto })
  @ApiOperation({ summary: 'Insert an item' })
  @HttpCode(HttpStatus.OK)
  async insertItem(@Body() insertItemDto: InsertItemDto) {
    await this.commandBus.execute(new InsertItemCommand(insertItemDto));
  }
}
