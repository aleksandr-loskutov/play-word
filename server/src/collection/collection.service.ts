import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Collection } from '@prisma/client';
import { CollectionDto } from './dto';

@Injectable()
export class CollectionService {
  constructor(private prisma: PrismaService) {}
  async getUserCollections(userId: string): Promise<Collection[]> {
    //получаем коллекции пользователя
    return await this.prisma.collection.findMany({
      where: {
        users: { some: { id: userId } },
      },
    });
  }
  async createCollection(
    newCollection: CollectionDto,
    userId: string,
  ): Promise<Collection> {
    //создаем и назначаем коллекцию пользователю
    return await this.prisma.collection.create({
      data: {
        createdBy: userId,
        ...newCollection,
        //назначаем коллекцию пользователю через связь многие ко многим
        users: { connect: { id: userId } },
      },
    });
  }
}
