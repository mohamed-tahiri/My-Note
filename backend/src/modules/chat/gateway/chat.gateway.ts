import { Message } from '@/modules/messages/entities/message.entity';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' }, // À restreindre en production
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody() chatId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `chat_${chatId}`;
    void client.join(roomName);
    console.log(`Client ${client.id} joined room: ${roomName}`);
  }

  @SubscribeMessage('leaveChat')
  handleLeaveChat(
    @MessageBody() chatId: number,
    @ConnectedSocket() client: Socket,
  ) {
    void client.leave(`chat_${chatId}`);
  }

  emitMessage(chatId: number, message: Message) {
    const roomName = `chat_${chatId}`;
    console.log(`Sending message to room ${roomName}`, message.content);

    this.server.to(`chat_${chatId}`).emit('newMessage', message);
  }
}
