import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NoteListener {
  private readonly logger = new Logger(NoteListener.name);

  @OnEvent('note.created')
  handleNoteCreated(payload: { noteId: number; userId: number }) {
    this.logger.log(
      `Note created! Note ID: ${payload.noteId}, User ID: ${payload.userId}`,
    );
  }
}
