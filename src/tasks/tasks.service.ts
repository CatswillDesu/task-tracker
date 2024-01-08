import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskStatuses } from './task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto, TaskDto, TaskFilters, UpdateTaskDto } from './task.dto';
import { DataCollection } from 'src/shared/transfer-data';
import { User } from 'src/auth/auth.guard';
import { UserRoles } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  private map(model: Task): TaskDto {
    const dto = new TaskDto();
    dto.id = model.id;
    dto.title = model.title;
    dto.description = model.description;
    dto.priority = model.priority;
    dto.status = model.status;
    dto.dueDate = model.dueDate;
    dto.createdAt = model.createdAt;
    dto.updatedAt = model.updatedAt;
    dto.deletedAt = model.deletedAt;

    return dto;
  }

  async getTask(id: number, user: User): Promise<TaskDto> {
    const where = { id } as any;

    if (user.role !== UserRoles.ADMIN) {
      where.user = { id: user.id };
    }

    const task = await this.taskRepository.findOne({ where });

    if (!task) {
      throw new NotFoundException('Task was not found');
    }

    return this.map(task);
  }

  async findTasks(
    filters: TaskFilters,
    user: User,
  ): Promise<DataCollection<TaskDto>> {
    const queryBuilder = this.taskRepository.createQueryBuilder('task');

    if (user.role !== UserRoles.ADMIN) {
      queryBuilder.andWhere('task.userId = :userId', { userId: user.id });
    }

    if (filters.query) {
      queryBuilder.andWhere(
        '(task.title ILIKE :query OR task.description ILIKE :query)',
        { query: `%${filters.query}%` },
      );
    }

    if (filters.priority) {
      queryBuilder.andWhere('task.priority = :priority', {
        priority: filters.priority,
      });
    }

    if (filters.status) {
      queryBuilder.andWhere('task.status = :status', {
        status: filters.status,
      });
    }

    if (filters.sortBy) {
      queryBuilder.addOrderBy(
        `task.${filters.sortBy}`,
        (filters.order?.toUpperCase() as 'ASC' | 'DESC') || 'DESC',
      );
    }

    queryBuilder.offset(filters.page * filters.limit || 0);
    queryBuilder.limit(filters.limit || 10);

    const [tasks, count] = await queryBuilder.getManyAndCount();

    return new DataCollection(tasks, count);
  }

  async createTask(taskDto: CreateTaskDto, user: User): Promise<TaskDto> {
    if (taskDto.dueDate?.getTime() < new Date().getTime()) {
      throw new BadRequestException('Invalid date argument');
    }

    const exists = await this.taskRepository.findOne({
      where: {
        title: taskDto.title,
        user: {
          id: user.id,
        },
      },
    });

    if (exists) {
      throw new BadRequestException('Task with given title already exists');
    }

    const task = await this.taskRepository.save({
      ...taskDto,
      user: {
        id: user.id,
      },
    });

    return this.map(task);
  }

  async updateTask(
    id: number,
    taskDto: UpdateTaskDto,
    user: User,
  ): Promise<TaskDto> {
    if (taskDto.dueDate?.getTime() < new Date().getTime()) {
      throw new BadRequestException('Invalid date argument');
    }

    const where = { id } as any;

    if (user.role !== UserRoles.ADMIN) {
      where.user = { id: user.id };
    }

    const task = await this.taskRepository.findOne({ where });

    if (!task) {
      throw new NotFoundException('Task was not found');
    }

    Object.assign(task, taskDto);

    await this.taskRepository.save(task);

    return this.map(task);
  }

  async changeStatus(
    id: number,
    status: TaskStatuses,
    user: User,
  ): Promise<TaskDto> {
    const where = { id } as any;

    if (user.role !== UserRoles.ADMIN) {
      where.user = { id: user.id };
    }

    const task = await this.taskRepository.findOne({ where });

    if (!task) {
      throw new NotFoundException('Task was not found');
    }

    if (status === TaskStatuses.COMPLETED) {
      if (task.dueDate?.getTime() < new Date().getTime()) {
        task.status = TaskStatuses.CANCELED;
        await this.taskRepository.save(task);

        throw new BadRequestException(
          'Task completion date was expired. Status moved to CANCELED',
        );
      }
    }

    task.status = status;
    await this.taskRepository.save(task);

    return this.map(task);
  }

  async deleteTask(id: number, user: User): Promise<TaskDto> {
    const where = { id } as any;

    if (user.role !== UserRoles.ADMIN) {
      where.user = { id: user.id };
    }

    const task = await this.taskRepository.findOne({ where });

    if (!task) {
      throw new NotFoundException('Task was not found');
    }

    await this.taskRepository.softDelete(id);

    return task;
  }
}
