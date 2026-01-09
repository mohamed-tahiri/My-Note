import { Appointment } from '@/modules/appointments/entities/appointment.entity';
import { Note } from '@/modules/notes/entities/note.entity';
import { User } from '@/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskStatus } from '../enums/taskstatus.enum';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @ManyToMany(() => User, (user) => user.tasks)
  @JoinTable()
  assignees: User[];

  @ManyToOne(() => Note, { nullable: true })
  relatedNote: Note | null;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @OneToMany(() => Appointment, (appointment) => appointment.task)
  appointments: Appointment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
