import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Collection } from '@prisma/client';
import { CollectionDto } from './dto';

@Injectable()
export class CollectionService {
  constructor(private prisma: PrismaService) {}
  async getUserCollections(userId: number): Promise<Collection[]> {
    //get all collections of user
    return await this.prisma.collection.findMany({
      where: {
        userId,
      },
    });
  }
  async createCollection(
    collection: CollectionDto,
    userId: number,
  ): Promise<Collection> {
    //create new collection
    return await this.prisma.collection.create({
      data: {
        ...collection,
        userId,
      },
    });
  }
}
