import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AtGuard } from '../common/guards';
import { CollectionService } from './collection.service';
import { GetCurrentUserId } from '../common/decorators';
import { Collection } from '@prisma/client';
import { CollectionDto } from './dto';

@UseGuards(AtGuard)
@Controller('collections')
export class CollectionController {
  constructor(private collectionService: CollectionService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  createCollection(
    @Body() newCollection: CollectionDto,
    @GetCurrentUserId() userId: number,
  ): Promise<Collection> {
    return this.collectionService.createCollection(newCollection, userId);
  }
  @Get('/')
  getUserCollections(@GetCurrentUserId() userId: number) {
    return this.collectionService.getUserCollections(userId);
  }
}
