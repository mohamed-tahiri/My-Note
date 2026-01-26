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

    const owner = await this.userRepository.findOne({
      where: { id: createChatDto.ownerId },
    });

    if (!owner) {
      throw new NotFoundException('Owner user not found');
    }

    const chat = this.chatRepository.create({
      name: createChatDto.name,
      type: createChatDto.type,
      participants,
      ownerId: createChatDto.ownerId,
      owner,
    });

    return this.chatRepository.save(chat);
  }

  async findOne(id: number) {
    const chat = await this.chatRepository.findOne({
      where: { id },
      relations: ['owner','participants', 'messages', 'messages.sender'],
      order: {
        messages: {
          createdAt: 'ASC',
        },
      },
    });

    if (!chat) throw new NotFoundException('Chat not found');

    return chat;
  }

  async findChatsByUser(userId: number): Promise<Chat[]> {
    const chats = await this.chatRepository.find({
      where: {
        participants: {
          id: userId,
        },
      },
      relations: ['owner','participants', 'lastMessage', 'lastMessage.sender'],
      order: {
        updatedAt: 'DESC',
      },
    });

    return chats;
  }
}
