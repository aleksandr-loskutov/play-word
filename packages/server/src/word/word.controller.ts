import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { WordService } from './word.service';
import { WordDto } from './dto';
import { AtGuard } from '../common/guards';
import { GetCurrentUserId } from '../common/decorators';

@UseGuards(AtGuard)
@Controller('word')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Get(':collectionId')
  async getWordsByCollection(@Param('collectionId') collectionId: string) {
    const result = await this.wordService.getWordsByCollection(
      parseInt(collectionId),
    );
    return result;
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async addWords(@Body() words: WordDto[]) {
    //todo ValidationPipe tests
    const result = await this.wordService.addWords(words);
    return result;
  }

  @Post(':collectionId')
  @UsePipes(new ValidationPipe())
  async addWordsToCollection(
    @Body() words: WordDto[],
    @Param('collectionId') collectionId: string,
    @GetCurrentUserId() userId: number,
  ) {
    const result = await this.wordService.updateCollectionWords(
      parseInt(collectionId),
      words,
      userId,
    );
    return result;
  }
}
