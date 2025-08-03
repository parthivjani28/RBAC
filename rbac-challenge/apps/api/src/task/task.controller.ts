import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard, Roles, RolesGuard } from '@rbac-challenge/auth';


@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  @Roles('Owner', 'Admin')
  create(@Body() dto: CreateTaskDto, @Req() req) {
    return this.taskService.create(dto, req.user);
  }

  @Get()
  @Roles('Owner', 'Admin', 'Viewer')
  findAll(@Req() req) {
    return this.taskService.findByUser(req.user);
  }

  @Put(':id')
  @Roles('Owner', 'Admin')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @Req() req) {
    return this.taskService.update(+id, dto, req.user);
  }

  @Delete(':id')
  @Roles('Owner')
  remove(@Param('id') id: string, @Req() req) {
    return this.taskService.delete(+id, req.user);
  }
}
