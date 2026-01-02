import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
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
        synchronize: true, // ⚠️ false en prod
        logging: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
