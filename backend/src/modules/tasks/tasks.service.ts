import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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
    // 1. Récupérer tous les assignés via le tableau d'IDs
    const assignees = await this.userRepository.findBy({
      id: In(dto.assigneeIds),
    });

    if (assignees.length === 0) {
      throw new NotFoundException('No valid assignees found');
    }

    let relatedNote: Note | null = null;
    if (dto.relatedNoteId) {
      relatedNote = await this.noteRepository.findOneBy({
        id: dto.relatedNoteId,
      });
      if (!relatedNote) throw new NotFoundException('Related note not found');
    }

    // 2. Créer la tâche avec le tableau d'assignés
    const task = this.taskRepository.create({
      ...dto,
      assignees, // ManyToMany attend un tableau d'entités
      relatedNote,
    });

    const savedTask = await this.taskRepository.save(task);

    // 3. Émettre l'événement avec les IDs des assignés
    this.eventEmitter.emit('task.created', {
      taskId: savedTask.id,
      title: savedTask.title,
      assigneeIds: assignees.map((a) => a.id),
    });

    return savedTask;
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({
      relations: ['assignees', 'relatedNote'],
    });
  }

  async findTaskByNote(id: number): Promise<Task[]> {
    return this.taskRepository.find({
      where: { relatedNote: { id } },
      relations: ['assignees', 'relatedNote'],
    });
  }

  async findTaskByUser(userId: number): Promise<Task[]> {
    // Pour trouver des tâches où l'utilisateur fait partie des assignés (ManyToMany)
    return this.taskRepository.find({
      where: { assignees: { id: userId } },
      relations: ['assignees', 'relatedNote'],
    });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assignees', 'relatedNote'],
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    // Mise à jour des assignés si le tableau est fourni
    if (dto.assigneeIds) {
      const assignees = await this.userRepository.findBy({
        id: In(dto.assigneeIds),
      });
      if (assignees.length === 0)
        throw new NotFoundException('Assignees not found');
      task.assignees = assignees;
    }

    if (dto.relatedNoteId) {
      const note = await this.noteRepository.findOneBy({
        id: dto.relatedNoteId,
      });
      if (!note) throw new NotFoundException('Related note not found');
      task.relatedNote = note;
    }

    const { ...rest } = dto;
    Object.assign(task, rest);

    const updatedTask = await this.taskRepository.save(task);

    this.eventEmitter.emit('task.updated', {
      taskId: updatedTask.id,
      title: updatedTask.title,
      assigneeIds: updatedTask.assignees.map((a) => a.id),
    });

    return updatedTask;
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);

    this.eventEmitter.emit('task.deleted', {
      taskId: task.id,
      title: task.title,
      assigneeIds: task.assignees.map((a) => a.id),
    });

    await this.taskRepository.remove(task);
  }
}
