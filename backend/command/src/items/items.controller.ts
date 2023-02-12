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
import { ItemsService } from './services/item.service';
import { SuggestItemEditDTO } from './interfaces/suggest-item-edit.dto';

@Controller('items')
@ApiTags('items')
export class ItemsController {
  private readonly logger = new Logger(ItemsController.name);

  constructor(private commandBus: CommandBus, private itemsService: ItemsService) {}

  @Post('insert')
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
  @ApiBody({ type: InsertItemDto, isArray: true })
  @ApiOperation({ description: 'Used for bulkinsert of items. Only available in development' })
  @ApiOkResponse({ description: 'Items inserted' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  async bulkInsert(@Body() bulkItemInsertDTO: InsertItemDto[]) {
    await this.itemsService.handleBulkInsert(bulkItemInsertDTO)
  }

  @Post(':slug/suggest/edit')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBody({type: SuggestItemEditDTO})
  @ApiOperation({description: 'Suggest an item edit'})
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Suggestion was successully submitted',
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No slug with that item',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
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
