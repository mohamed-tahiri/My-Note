import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'presence',
})
export class PresenceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  /**
   * Map pour suivre les sessions actives.
   * Clé : ID de l'utilisateur (number)
   * Valeur : Set des IDs de sockets (string[]) - Gère le multi-onglet
   */
  private activeUsers = new Map<number, Set<string>>();

  /**
   * Gère la connexion d'un client
   */
  handleConnection(client: Socket) {
    const userId = Number(client.handshake.query.userId);
    if (isNaN(userId)) return client.disconnect();

    if (!this.activeUsers.has(userId)) {
      this.activeUsers.set(userId, new Set());
      this.server.emit('USER_ONLINE', userId);
    }

    // On utilise le "!" car on vient de faire le .set() juste au-dessus
    // ou on utilise une constante sécurisée
    const sessions = this.activeUsers.get(userId)!; 
    sessions.add(client.id);
    
    client.emit('SYNC_PRESENCE', Array.from(this.activeUsers.keys()));
  }

  /**
   * Gère la déconnexion d'un client
   */
  handleDisconnect(client: Socket) {
    const userId = Number(client.handshake.query.userId);
    if (isNaN(userId)) return;

    const sessions = this.activeUsers.get(userId);

    // Vérification de sécurité (Règle l'erreur TS 2532)
    if (sessions) {
        sessions.delete(client.id);
        
        if (sessions.size === 0) {
            this.activeUsers.delete(userId);
            this.server.emit('USER_OFFLINE', userId);
        }
    }
  }

  /**
   * Optionnel: Méthode utilitaire pour vérifier si un utilisateur est en ligne
   */
  isUserOnline(userId: number): boolean {
    return this.activeUsers.has(userId);
  }
}