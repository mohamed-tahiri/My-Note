/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsePipes, ValidationPipe, Logger } from '@nestjs/common';
import { CreateMessageDto } from '../../messages/dto/create-message.dto';
import { MessagesService } from '../../messages/messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.warn(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChat')
  joinChat(
    @MessageBody('chatId') chatId: number,
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(`chat-${chatId}`);
    this.logger.log(`Client ${client.id} joined chat ${chatId}`);
  }

  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() dto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user as { id: number };

    const message = await this.messagesService.create({
      ...dto,
      senderId: user.id,
    });

    this.server.to(`chat-${dto.chatId}`).emit('newMessage', message);

    return message;
  }
}
