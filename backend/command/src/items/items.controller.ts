import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../shared/guards/jwt.guard';
import { InsertItemCommand } from './commands/insert-item.command';
import { InsertItemDto } from './interfaces/insert-item.dto';
import { JwtWithUserDto } from './interfaces/request-with-user.dto';

@Controller()
@ApiTags()
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
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async insertItem(
    @Req() { user }: JwtWithUserDto,
    @Body() insertItemDto: InsertItemDto,
  ) {
    await this.commandBus.execute(new InsertItemCommand(insertItemDto, user));
  }
}
