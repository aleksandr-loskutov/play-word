import { Controller, Get, Param, Post, Body, UsePipes, ValidationPipe } from "@nestjs/common";
import { WordService } from './word.service';
import { WordDto } from "./dto";

@Controller('word')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Get(':collectionId')
  async getWordsByCollection(@Param('collectionId') collectionId: string) {
    const result = await this.wordService.getWordsByCollection(parseInt(collectionId));
    return result;
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async addWords(@Body() words: WordDto[]) {
    const result = await this.wordService.addWords(words);
    return result;
  }

  @Post(':collectionId')
  @UsePipes(new ValidationPipe())
  async addWordsToCollection(@Body() words: WordDto[], @Param('collectionId') collectionId: string) {
    const result = await this.wordService.addWordsToCollection(parseInt(collectionId), words );
    return result;
  }
}
