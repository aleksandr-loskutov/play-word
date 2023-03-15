import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AtGuard } from '../common/guards';
import { CollectionService } from './collection.service';
import { GetCurrentUserId } from '../common/decorators';
import { Collection } from '@prisma/client';
import {
  CollectionWithWords,
  RequestCollectionCreate,
  RequestCollectionUpdate,
  UserWordProgressResponse,
} from './dto';
import { Response } from 'common';

@UseGuards(AtGuard)
@Controller('collections')
export class CollectionController {
  constructor(private collectionService: CollectionService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  createCollection(
    @Body() payload: RequestCollectionCreate,
    @GetCurrentUserId() userId: number,
  ): Promise<Response<Collection>> {
    return this.collectionService.createCollection(payload, userId);
  }

  @Put('/:collectionId')
  @HttpCode(HttpStatus.OK)
  updateCollection(
    @Body() payload: RequestCollectionUpdate,
    @Param('collectionId') collectionId: string,
    @GetCurrentUserId() userId: number,
  ): Promise<Response<Collection>> {
    return this.collectionService.updateCollection(
      parseInt(collectionId),
      userId,
      payload,
    );
  }

  @Get('/train')
  @HttpCode(HttpStatus.OK)
  getUserTraining(
    @GetCurrentUserId() userId: number,
  ): Promise<Response<UserWordProgressResponse>> {
    return this.collectionService.getUserTraining(userId);
  }

  @Post('/:collectionId')
  @HttpCode(HttpStatus.OK)
  trainCollectionWords(
    @Param('collectionId') collectionId: string,
    @GetCurrentUserId() userId: number,
  ): Promise<Response<UserWordProgressResponse>> {
    return this.collectionService.addCollectionWordsToUserProgress(
      parseInt(collectionId),
      userId,
    );
  }

  @Patch('/:collectionId')
  @HttpCode(HttpStatus.OK)
  unTrainCollectionWords(
    @Param('collectionId') collectionId: string,
    @GetCurrentUserId() userId: number,
  ): Promise<Response<UserWordProgressResponse>> {
    return this.collectionService.deleteCollectionWordsFromUserProgress(
      parseInt(collectionId),
      userId,
    );
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  getUserCollections(
    @GetCurrentUserId() userId: number,
  ): Promise<Response<CollectionWithWords[]>> {
    return this.collectionService.getUserCollections(userId);
  }

  @Delete('/:collectionId')
  @HttpCode(HttpStatus.OK)
  deleteCollection(
    @Param('collectionId') collectionId: string,
    @GetCurrentUserId() userId: number,
  ): Promise<Response<Collection>> {
    return this.collectionService.deleteCollection(
      parseInt(collectionId),
      userId,
    );
  }

  @Get('/public')
  @HttpCode(HttpStatus.OK)
  getPublicCollections(): Promise<Response<CollectionWithWords[]>> {
    return this.collectionService.getPublicCollections();
  }
}
