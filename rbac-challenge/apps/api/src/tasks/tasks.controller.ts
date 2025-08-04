import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  create(@Body() dto: CreateTaskDto, @Request() req) {
    return this.tasksService.createTask(dto, req.user);
  }

  @Get()
  async findAll(@Request() req) {
    return this.tasksService.findAll(req.user);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() body: any, @Request() req) {
    return this.tasksService.updateTask(Number(id), body, req.user);
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @Request() req) {
    return this.tasksService.deleteTask(Number(id), req.user);
  }
}