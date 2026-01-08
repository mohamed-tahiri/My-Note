import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from '../users/entities/user.entity';
import { NotePriority } from './enums/notePriority.enum';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateNoteDto): Promise<Note> {
    const user = await this.userRepository.findOneBy({ id: dto.userId });
    if (!user) throw new NotFoundException('User not found');

    const note = this.noteRepository.create({
      title: dto.title,
      content: dto.content,
      user: user,
      priority: dto.priority as NotePriority,
    });
    const saved = await this.noteRepository.save(note);

    // 🔔 Event-driven

    this.eventEmitter.emit('note.created', {
      noteId: saved.id,
      userId: saved.user.id,
    });

    return saved;
  }

  async update(id: number, dto: CreateNoteDto): Promise<Note> {
    const user = await this.userRepository.findOneBy({ id: dto.userId });
    if (!user) throw new NotFoundException('User not found');

    // Mettre à jour la note
    await this.noteRepository.update(id, {
      title: dto.title,
      content: dto.content,
      user: user,
      priority: dto.priority as NotePriority,
    });

    // Récupérer la note mise à jour
    const updatedNote = await this.noteRepository.findOneBy({ id });
    if (!updatedNote) throw new NotFoundException('Note not found');

    // 🔔 Event-driven
    this.eventEmitter.emit('note.updated', {
      noteId: updatedNote.id,
      userId: user.id,
    });

    return updatedNote;
  }

  async findAll(): Promise<Note[]> {
    return this.noteRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllByUser(userId: number): Promise<Note[]> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const notes = await this.noteRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    return notes;
  }

  async findOne(id: number): Promise<Note> {
    const note = await this.noteRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async remove(id: number): Promise<void> {
    const note = await this.noteRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    const result = await this.noteRepository.delete(id);

    this.eventEmitter.emit('note.deleted', {
      noteId: id,
      userId: note.user.id,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Note not found');
    }
  }
}
