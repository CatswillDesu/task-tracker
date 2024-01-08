import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ChangeStatusDto,
  CreateTaskDto,
  TaskFilters,
  UpdateTaskDto,
} from './task.dto';
import { TasksService } from './tasks.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { ReqUser } from 'src/shared/decorators/user.decorator';
import { User } from 'src/auth/auth.guard';

@Controller('tasks')
@UseGuards(RolesGuard)
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get(':id')
  getTask(@Param('id', ParseIntPipe) id: number, @ReqUser() user: User) {
    return this.taskService.getTask(id, user);
  }

  @Get()
  findTasks(@Query() taskFilters: TaskFilters, @ReqUser() user: User) {
    return this.taskService.findTasks(taskFilters, user);
  }

  @Post()
  createTask(@Body() taskDto: CreateTaskDto, @ReqUser() user: User) {
    return this.taskService.createTask(taskDto, user);
  }

  @Patch(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() taskDto: UpdateTaskDto,
    @ReqUser() user: User,
  ) {
    return this.taskService.updateTask(id, taskDto, user);
  }

  @Patch(':id/status')
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeStatusDto,
    @ReqUser() user: User,
  ) {
    return this.taskService.changeStatus(id, dto.status, user);
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number, @ReqUser() user: User) {
    return this.taskService.deleteTask(id, user);
  }
}
