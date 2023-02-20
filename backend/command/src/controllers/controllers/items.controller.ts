import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseArrayPipe,
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
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { InsertItemCommand } from '../../commands/item-commands/insert-item.command';
import { SuggestItemDeleteCommand } from '../../commands/item-commands/suggest-item-delete.command';
import { SuggestItemEditCommand } from '../../commands/item-commands/suggest-item-edit.command';
import { ENVGuard } from '../../shared/guards/env.guard';
import { JwtAuthGuard } from '../../shared/guards/jwt.guard';
import { BulkInsertItemDTO } from '../dtos/bulk-insert-item.dto';
import { InsertItemDto } from '../dtos/insert-item.dto';
import { SuggestItemDeleteDTO } from '../dtos/suggest-item-delete.dto';
import { SuggestItemEditDTO } from '../dtos/suggest-item-edit.dto';
import { RequestWithJWTPayload } from '../interfaces/request-with-user.interface';
import { ItemsService } from '../services/item.service';

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
  @ApiOperation({
    summary: 'Insert an item',
    description: 'Initiate item insert',
  })
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
    @Req() { user }: RequestWithJWTPayload,
    @Body() insertItemDto: InsertItemDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new InsertItemCommand(insertItemDto, user.id),
    );
  }

  @Post('bulk-insert')
  @UseGuards(ENVGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: BulkInsertItemDTO, isArray: true })
  @ApiOperation({
    summary: 'Insert multiple items in bulk',
    description: 'Used for bulkinsert of items. Only available in development',
  })
  @ApiOkResponse({ description: 'Items inserted' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  async bulkInsert(
    @Body(new ParseArrayPipe({ items: BulkInsertItemDTO }))
    bulkItemInsertDTOs: BulkInsertItemDTO[],
  ): Promise<void> {
    await this.itemsService.handleBulkInsert(bulkItemInsertDTOs);
  }

  @Post(':slug/suggest/edit')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: SuggestItemEditDTO })
  @ApiParam({
    name: 'slug',
    example: 'apple',
    description: 'Slug for the item in question',
  })
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
    @Req() { user }: RequestWithJWTPayload,
  ): Promise<void> {
    await this.commandBus.execute(
      new SuggestItemEditCommand(editSuggestionDto, itemSlug, user.id),
    );
  }

  @Post(':slug/suggest/delete')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: SuggestItemDeleteDTO })
  @ApiParam({
    name: 'slug',
    example: 'apple',
    description: 'Slug for the item in question',
  })
  @ApiOperation({
    summary: 'Suggest an item delete ',
    description: 'Used for submitting a suggestion for item deletion',
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
  async suggestDelete(
    @Body() deleteSuggestionDto: SuggestItemDeleteDTO,
    @Param('slug') itemSlug: string,
    @Req() { user }: RequestWithJWTPayload,
  ): Promise<void> {
    await this.commandBus.execute(
      new SuggestItemDeleteCommand(deleteSuggestionDto, itemSlug, user.id),
    );
  }
}
