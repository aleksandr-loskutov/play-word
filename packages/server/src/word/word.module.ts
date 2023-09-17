import { Module } from '@nestjs/common';
import WordService from './word.service';
import WordController from './word.controller';

@Module({
  providers: [WordService],
  controllers: [WordController],
})
export default class WordModule {}
