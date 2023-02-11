import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
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
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ENVGuard } from '../shared/guards/env.guard';
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
    await this.commandBus.execute(
      new InsertItemCommand(insertItemDto, user.id),
    );
  }

  @Post('items/bulk-insert')
  @UseGuards(ENVGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: InsertItemCommand, isArray: true })
  @ApiOperation({ description: 'Used for bulkinsert of items. Only available in development' })
  @ApiOkResponse({ description: 'Items inserted' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  async bulkInsert(@Body() bulkItemInsertDTO: InsertItemDto[]) {
    let count = 0;
    try {
      for (const itemInsertDTO of bulkItemInsertDTO) {
        // Use userid 0 for admin inserts
        await this.commandBus.execute(new InsertItemCommand(itemInsertDTO, 0));
        count++;
      }
    } catch (error) {
      this.logger.error(
        `Failed bulk insert at ${count}/${bulkItemInsertDTO.length} items due to an error: ${error}`,
      );
      // Pass unsanitized as this is only available in dev environments
      throw new InternalServerErrorException(error);
    }
    this.logger.log(`Bulk insert was success for ${count} items`);
  }
}
