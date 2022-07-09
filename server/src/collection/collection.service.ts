import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Collection } from '@prisma/client';
import { CollectionDto } from './dto';

@Injectable()
export class CollectionService {
  constructor(private prisma: PrismaService) {}
  async getUserCollections(userId: string): Promise<Collection[]> {
    return await this.prisma.collection.findMany({});
  }
  async createCollection(
    newCollection: CollectionDto,
    userId: string,
  ): Promise<Collection> {
    return await this.prisma.collection.create({
      data: { createdBy: userId, ...newCollection },
    });
  }
}
