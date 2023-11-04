import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import type { Collection } from '@prisma/client';
import type { Response } from 'common';
import { AtGuard } from '../common/guards';
import CollectionService from './collection.service';
import { GetCurrentUserId, Public } from '../common/decorators';
import {
  CollectionWithWords,
  RequestCollectionCreateDto,
  RequestCollectionUpdateDto,
  RequestUserTrainingUpdate,
  UserWordProgressExtended,
} from './dto';

@UseGuards(AtGuard)
@Controller('collections')
export default class CollectionController {
  constructor(private collectionService: CollectionService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  createCollection(
    @Body() payload: RequestCollectionCreateDto,
    @GetCurrentUserId() userId: number
  ): Promise<Response<CollectionWithWords>> {
    return this.collectionService.createCollection(payload, userId);
  }

  @Put('/:collectionId')
  @HttpCode(HttpStatus.OK)
  updateCollection(
    @Body() payload: RequestCollectionUpdateDto,
    @Param('collectionId') collectionId: string,
    @GetCurrentUserId() userId: number
  ): Promise<Response<Collection>> {
    return this.collectionService.updateCollection(
      parseInt(collectionId, 10),
      userId,
      payload
    );
  }

  @Get('/train')
  @HttpCode(HttpStatus.OK)
  getUserTraining(
    @GetCurrentUserId() userId: number
  ): Promise<Response<UserWordProgressExtended[]>> {
    return this.collectionService.getUserTraining(userId);
  }

  @Patch('/train')
  @HttpCode(HttpStatus.OK)
  updateUserTraining(
    @Body() payload: RequestUserTrainingUpdate[],
    @GetCurrentUserId() userId: number
  ): Promise<Response<UserWordProgressExtended[]>> {
    return this.collectionService.updateUserTraining(payload, userId);
  }

  @Post('/:collectionId')
  @HttpCode(HttpStatus.OK)
  trainCollectionWords(
    @Param('collectionId') collectionId: string,
    @GetCurrentUserId() userId: number
  ): Promise<Response<UserWordProgressExtended[]>> {
    return this.collectionService.addCollectionWordsToUserProgress(
      parseInt(collectionId, 10),
      userId
    );
  }

  @Patch('/:collectionId')
  @HttpCode(HttpStatus.OK)
  unTrainCollectionWords(
    @Param('collectionId') collectionId: string,
    @GetCurrentUserId() userId: number
  ): Promise<Response<UserWordProgressExtended[]>> {
    return this.collectionService.deleteCollectionWordsFromUserProgress(
      parseInt(collectionId, 10),
      userId
    );
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  getUserCollections(
    @GetCurrentUserId() userId: number
  ): Promise<Response<CollectionWithWords[]>> {
    return this.collectionService.getCollections(userId);
  }

  @Delete('/:collectionId')
  @HttpCode(HttpStatus.OK)
  deleteCollection(
    @Param('collectionId') collectionId: string,
    @GetCurrentUserId() userId: number
  ): Promise<Response<Collection>> {
    return this.collectionService.deleteCollection(
      parseInt(collectionId, 10),
      userId
    );
  }

  @Public()
  @Get('/public')
  @Header('Cache-Control', 'public, max-age=3600')
  @HttpCode(HttpStatus.OK)
  getPublicCollections(): Promise<Response<Collection[]>> {
    return this.collectionService.getPublicCollections();
  }
}
