import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

interface NotificationPayload {
  id: number;
  content: string;
  createdAt: Date;
}

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  server: Server;

  // notifications.gateway.ts

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;

    if (userId) {
      try {
        await client.join(`user-${String(userId)}`);

        this.logger.log(
          `Client ${client.id} joined room user-${String(userId)}`,
        );
      } catch (error) {
        this.logger.error(`Failed to join room: ${error}`);
      }
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  emitNotification(userId: number, payload: NotificationPayload) {
    this.server.to(`user-${userId}`).emit('notification', payload);
  }
}
