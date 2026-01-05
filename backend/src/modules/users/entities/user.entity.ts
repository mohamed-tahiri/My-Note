import { Appointment } from '@/modules/appointments/entities/appointment.entity';
import { Message } from '@/modules/messages/entities/message.entity';
import { Note } from '@/modules/notes/entities/note.entity';
import { Task } from '@/modules/tasks/entities/task.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string; // admin, user, manager

  @Column({ type: 'varchar', nullable: true })
  refreshToken: string | null;

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  @OneToMany(() => Task, (task) => task.assignee)
  tasks: Task[];

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments: Appointment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
