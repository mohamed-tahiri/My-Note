import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NoteListener } from './listeners/note.listener';
import { TaskListener } from './listeners/task.listener';
import { AppointmentListener } from './listeners/appointments.listener';
import { NotificationsGateway } from './notifications.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User])],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsGateway,
    AppointmentListener,
    NoteListener,
    TaskListener,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
