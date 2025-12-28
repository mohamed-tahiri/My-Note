import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from '../users/entities/user.entity';
import { Note } from '../notes/entities/note.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateTaskDto): Promise<Task> {
    const assignee = await this.userRepository.findOneBy({
      id: dto.assigneeId,
    });
    if (!assignee) throw new NotFoundException('Assignee not found');
    let relatedNote: Note | null = null;
    if (dto.relatedNoteId) {
      relatedNote = await this.noteRepository.findOneBy({
        id: dto.relatedNoteId,
      });
      if (!relatedNote) throw new NotFoundException('Related note not found');
    }
    const task = this.taskRepository.create({
      ...dto,
      assignee,
      relatedNote,
    });
    const savedTask = await this.taskRepository.save(task);
    this.eventEmitter.emit('task.created', {
      taskId: savedTask.id,
      assigneeId: assignee.id,
    });
    return savedTask;
  }
  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({ relations: ['assignee', 'relatedNote'] });
  }

  async findTaskByNote(id: number): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      where: { relatedNote: { id } },
      relations: ['assignee', 'relatedNote'],
    });

    if (!tasks) throw new NotFoundException('Task not found');

    return tasks;
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assignee', 'relatedNote'],
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }
  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    if (dto.assigneeId) {
      const assignee = await this.userRepository.findOneBy({
        id: dto.assigneeId,
      });
      if (!assignee) throw new NotFoundException('Assignee not found');
      task.assignee = assignee;
    }
    if (dto.relatedNoteId) {
      const note = await this.noteRepository.findOneBy({
        id: dto.relatedNoteId,
      });
      if (!note) throw new NotFoundException('Related note not found');
      task.relatedNote = note;
    }
    Object.assign(task, dto);
    const updatedTask = await this.taskRepository.save(task);
    this.eventEmitter.emit('task.updated', { taskId: updatedTask.id });
    return updatedTask;
  }
  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
    this.eventEmitter.emit('task.deleted', { taskId: task.id });
  }
}
