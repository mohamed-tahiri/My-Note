import { Task } from '@/modules/tasks/entities/task.entity';
import { User } from '@/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// On définit l'union type pour la cohérence
export type AppointmentType = 'Professional' | 'Personal' | 'Medical';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'timestamp' })
  startAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  endAt: Date;

  @Column({ nullable: true })
  location: string;

  @Column({
    type: 'enum',
    enum: ['Professional', 'Personal', 'Medical'],
    default: 'Personal',
  })
  type: AppointmentType;

  @ManyToOne(() => Task, (task) => task.appointments, { nullable: true })
  task: Task;

  @ManyToOne(() => User, (user) => user.appointments)
  user: User;

  @ManyToOne(() => User, { nullable: true })
  assignedTo: User | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
