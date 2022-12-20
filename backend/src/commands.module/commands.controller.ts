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
import { CreateItemCommand } from './commands/create-item.command';
import { CreateItemDto } from './interfaces/create-item.dto';

@Controller('commands')
@ApiTags('commands')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class CommandsController {
  private readonly logger = new Logger(CommandsController.name);

  constructor(private commandBus: CommandBus) {}

  @Post('create-item')
  @ApiBody({ type: CreateItemDto })
  @ApiOperation({ summary: 'Create an item' })
  @HttpCode(HttpStatus.OK)
  async createItem(@Body() createItemDto: CreateItemDto) {
    this.commandBus.execute(new CreateItemCommand(createItemDto));
  }
}
