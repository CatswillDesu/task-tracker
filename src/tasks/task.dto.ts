import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TaskPriorities, TaskStatuses } from './task.entity';
import { Transform, Type } from 'class-transformer';
import { BaseFilters } from 'src/shared/transfer-data';

export class TaskDto {
  id: number;

  title: string;

  description: string;

  priority: TaskPriorities;

  status: TaskStatuses;

  @Transform(({ value }) => value.toISOString(), { toClassOnly: true })
  dueDate: Date;

  @Transform(({ value }) => value.toISOString(), { toClassOnly: true })
  createdAt: Date;

  @Transform(({ value }) => value.toISOString(), { toClassOnly: true })
  updatedAt: Date;

  @Transform(({ value }) => value.toISOString(), { toClassOnly: true })
  deletedAt: Date;
}

export class CreateTaskDto {
  @IsString()
  @MaxLength(30)
  title: string;

  @IsString()
  @MaxLength(300)
  description: string;

  @IsEnum(TaskPriorities)
  @IsOptional()
  priority: TaskPriorities;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dueDate: Date;
}

export class UpdateTaskDto extends CreateTaskDto {
  constructor() {
    super();
  }

  @IsString()
  @MaxLength(30)
  @IsOptional()
  title: string;

  @IsString()
  @MaxLength(300)
  @IsOptional()
  description: string;
}

export class ChangeStatusDto {
  @IsEnum(TaskStatuses)
  status: TaskStatuses;
}

export class TaskFilters extends BaseFilters {
  @IsEnum(TaskPriorities)
  @IsOptional()
  priority?: TaskPriorities;

  @IsEnum(TaskStatuses)
  @IsOptional()
  status?: TaskStatuses;
}
