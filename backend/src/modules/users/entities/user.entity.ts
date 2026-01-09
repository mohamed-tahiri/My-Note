import { Appointment } from '@/modules/appointments/entities/appointment.entity';
import { Message } from '@/modules/messages/entities/message.entity';
import { Note } from '@/modules/notes/entities/note.entity';
import { Task } from '@/modules/tasks/entities/task.entity';
import { Exclude } from 'class-transformer';
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

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  role: string; // admin, user, manager

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  refreshToken: string | null;

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  @OneToMany(() => Task, (task) => task.assignees)
  tasks: Task[];

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments: Appointment[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  @Column({ default: 'light' })
  themePreference: 'light' | 'dark';

  @Column({ default: 'fr' })
  language: string;

  @Column({ default: false })
  isTwoFactorEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
