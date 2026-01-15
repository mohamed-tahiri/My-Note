import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Chat } from '../chat/entities/chat.entity';
import { User } from '../users/entities/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatGateway } from '../chat/gateway/chat.gateway';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2,
    private readonly chatGateway: ChatGateway,
  ) {}

  async create(dto: CreateMessageDto): Promise<Message> {
    const [chat, sender] = await Promise.all([
      this.chatRepository.findOne({
        where: { id: dto.chatId },
        relations: ['participants'],
      }),
      this.userRepository.findOneBy({ id: dto.senderId }),
    ]);

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (!sender) {
      throw new NotFoundException('Sender not found');
    }

    const isParticipant = chat.participants.some((p) => p.id === sender.id);

    if (!isParticipant) {
      throw new ForbiddenException('User is not a participant of this chat');
    }

    const message = this.messageRepository.create({
      content: dto.content,
      sender,
      chat,
    });

    const savedMessage = await this.messageRepository.save(message);

    chat.lastMessage = savedMessage;
    chat.updatedAt = new Date();

    await this.chatRepository.save(chat);

    const messageWithDetails = await this.messageRepository.findOne({
      where: { id: savedMessage.id },
      relations: ['sender', 'chat'],
    });

    if (!messageWithDetails) return savedMessage;
    // 3. RÉCUPÉRATION DE L'ID DU CHAT
    // savedMessage.chat peut être un objet complet ou juste un ID selon votre config
    // On utilise l'ID du chat provenant du message chargé avec ses relations
    const chatId = messageWithDetails.chat.id;

    this.chatGateway.emitMessage(chatId, messageWithDetails);

    this.eventEmitter.emit('message.created', {
      messageId: savedMessage.id,
      chatId: chat.id,
      senderId: sender.id,
    });

    return savedMessage;
  }

  async findByChat(chatId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { chat: { id: chatId } },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }
}
