import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from '../notifications.service';

@Injectable()
export class NoteListener {
  private readonly logger = new Logger(NoteListener.name);

  constructor(private readonly notificationService: NotificationsService) {}

  @OnEvent('note.created')
  async handleNoteCreated(payload: { noteId: number; userId: number }) {
    await this.notificationService.create({
      userId: payload.userId,
      content: `Note ${payload.noteId} created`,
    });

    this.logger.log(
      `Note created! Note ID: ${payload.noteId}, User ID: ${payload.userId}`,
    );
  }
}
