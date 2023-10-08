import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { IS_DEV } from '../common/consts';

@Injectable()
export default class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    const url = config.get<string>('DATABASE_URL');
    super({
      datasources: {
        db: {
          url,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (IS_DEV) {
      // need them to be executed sequentially because of foreign keys
      await this.userTrainingSettings.deleteMany();
      await this.word.deleteMany();
      await this.collection.deleteMany();
      await this.wordForCollection.deleteMany();
      await this.userWordProgress.deleteMany();
      await this.user.deleteMany();
    }
  }
}
