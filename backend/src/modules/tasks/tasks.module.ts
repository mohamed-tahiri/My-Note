import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { Note } from '../notes/entities/note.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Chat } from '../chat/entities/chat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User, Note, Chat]),
    EventEmitterModule,
  ],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
