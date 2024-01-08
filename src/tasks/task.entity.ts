import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../auth/user.entity';

export enum TaskPriorities {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum TaskStatuses {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'enum', enum: TaskPriorities, default: TaskPriorities.LOW })
  priority: TaskPriorities;

  @Column({ type: 'enum', enum: TaskStatuses, default: TaskStatuses.WAITING })
  status: TaskStatuses;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.tasks)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
