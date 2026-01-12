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

  // L'utilisateur rejoint une "room" spécifique au chat
  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket,
  ) {
    void client.join(`chat_${chatId}`);
    console.log(`Client ${client.id} joined room: chat_${chatId}`);
  }

  // L'utilisateur quitte la room
  @SubscribeMessage('leaveChat')
  handleLeaveChat(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket,
  ) {
    void client.leave(`chat_${chatId}`);
  }

  // Méthode pour diffuser un message (appelée par le MessagesService)
  emitMessage(chatId: number, message: any) {
    this.server.to(`chat_${chatId}`).emit('newMessage', message);
  }
}
