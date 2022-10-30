import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
  ) {}

  create(createItemDto: CreateItemDto) {
    const testItem = {
      name: 'test',
      weight: 'test',
      tags: ['test', 'test2'],
      image: 'test',
      user: 'test',
    };
    const item = this.itemsRepository.create(testItem);
    return this.itemsRepository.save(item);
  }

  findAll() {
    return this.itemsRepository.find();
  }

  findOne(id: number) {
    return this.itemsRepository.findOneBy({ id });
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
