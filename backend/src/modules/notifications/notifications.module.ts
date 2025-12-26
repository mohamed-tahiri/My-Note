import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NoteListener } from './listeners/note.listener';
import { TaskListener } from './listeners/task.listener';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NoteListener, TaskListener],
})
export class NotificationsModule {}
