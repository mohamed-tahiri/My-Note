import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../modules/notifications/entities/notification.entity';
import { Chat } from '../modules/chat/entities/chat.entity';
import { Message } from '../modules/messages/entities/message.entity';
import { Note } from '../modules/notes/entities/note.entity';
import { User } from '../modules/users/entities/user.entity';
import { Task } from '../modules/tasks/entities/task.entity';
import { Appointment } from '../modules/appointments/entities/appointment.entity';
import { File } from '../modules/files/entities/file.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USER ?? 'user',
      password: process.env.DB_PASSWORD ?? 'password',
      database: process.env.DB_NAME ?? 'appdb',
      entities: [
        User,
        Note,
        Message,
        Chat,
        Notification,
        Task,
        Appointment,
        File,
      ],
      synchronize: true,
      logging: true,
    }),
  ],
})
export class DatabaseModule {}
