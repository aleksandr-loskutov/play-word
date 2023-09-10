import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { WordService } from './word.service';
import { WordDto } from './dto';
import { AtGuard } from '../common/guards';
import { GetCurrentUserId } from '../common/decorators';
import { validateArrayForEmptyStringAndLength } from '../common/utils/';
import { Response } from 'common';
import { CollectionWithWords } from '../collection/dto';

@UseGuards(AtGuard)
@Controller('word')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Get(':collectionId')
  async getWordsByCollection(
    @Param('collectionId') collectionId: string,
  ): Promise<WordDto[]> {
    const result = await this.wordService.getWordsByCollection(
      parseInt(collectionId),
    );
    return result;
  }

  @Post(':collectionId')
  async addWordsToCollection(
    @Body() words: WordDto[],
    @Param('collectionId') collectionId: string,
    @GetCurrentUserId() userId: number,
  ): Promise<Response<CollectionWithWords>> {
    validateArrayForEmptyStringAndLength(words, ['word', 'translation']);
    const result = await this.wordService.updateCollectionWords(
      parseInt(collectionId),
      words,
      userId,
    );
    return result;
  }
}
