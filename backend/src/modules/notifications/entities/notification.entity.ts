import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Note } from '../../notes/entities/note.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; // mail, slack, whatsapp

  @Column()
  content: string;

  @Column({ default: false })
  read: boolean;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Note, (note) => note.notifications, { nullable: true })
  note: Note;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
