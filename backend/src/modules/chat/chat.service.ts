import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { In, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createChatDto: CreateChatDto) {
    const participants = await this.userRepository.find({
      where: { id: In(createChatDto.participantIds) },
    });

    if (participants.length !== createChatDto.participantIds.length) {
      throw new NotFoundException('One or more users not found');
    }

    const chat = this.chatRepository.create({
      participants,
    });

    return this.chatRepository.save(chat);
  }

  findAll() {
    return this.chatRepository.find({
      relations: ['participants', 'messages'],
    });
  }

  async findOne(id: number) {
    const chat = await this.chatRepository.findOne({
      where: { id },
      relations: ['participants', 'messages', 'messages.sender'],
    });

    if (!chat) throw new NotFoundException('Chat not found');

    return chat;
  }
}
