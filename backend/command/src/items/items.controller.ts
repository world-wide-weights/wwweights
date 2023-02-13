import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ENVGuard } from '../shared/guards/env.guard';
import { JwtAuthGuard } from '../shared/guards/jwt.guard';
import { InsertItemCommand } from './commands/insert-item.command';
import { SuggestItemEditCommand } from './commands/suggest-item-edit.command';
import { InsertItemDto } from './interfaces/insert-item.dto';
import { JwtWithUserDto } from './interfaces/request-with-user.dto';
import { SuggestItemEditDTO } from './interfaces/suggest-item-edit.dto';
import { ItemsService } from './services/item.service';

@Controller('items')
@ApiTags('items')
export class ItemsController {
  private readonly logger = new Logger(ItemsController.name);

  constructor(
    private commandBus: CommandBus,
    private itemsService: ItemsService,
  ) {}

  @Post('insert')
  @ApiBody({ type: InsertItemDto })
  @ApiOperation({ summary: 'Insert an item' })
  @ApiOkResponse({
    description: 'Item inserted successfully',
  })
  @ApiConflictResponse({
    description: 'Slug already taken',
  })
  @ApiBadRequestResponse({
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

  @Post('bulk-insert')
  @UseGuards(ENVGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: InsertItemDto, isArray: true })
  @ApiOperation({
    summary: 'Insert multiple items in bulk',
    description: 'Used for bulkinsert of items. Only available in development',
  })
  @ApiOkResponse({ description: 'Items inserted' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  async bulkInsert(@Body() bulkItemInsertDTO: InsertItemDto[]) {
    await this.itemsService.handleBulkInsert(bulkItemInsertDTO);
  }

  @Post(':slug/suggest/edit')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: SuggestItemEditDTO })
  @ApiOperation({
    summary: 'Suggest an item edit ',
    description: 'Used for submitting a suggestion for item value changes',
  })
  @ApiOkResponse({
    description: 'Suggestion was successully submitted',
  })
  @ApiNotFoundResponse({
    description: 'No slug with that item',
  })
  @ApiBadRequestResponse({
    description: 'Invalid request. Data validation failed.',
  })
  @ApiBearerAuth()
  async suggestEdit(
    @Body() editSuggestionDto: SuggestItemEditDTO,
    @Param('slug') itemSlug: string,
    @Req() { user }: JwtWithUserDto,
  ) {
    await this.commandBus.execute(
      new SuggestItemEditCommand(editSuggestionDto, itemSlug, user.id),
    );
  }
}
