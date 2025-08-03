import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,
  ) {}

  async create(dto: CreateTaskDto, user: any) {
    const task = this.taskRepo.create({
      ...dto,
      createdBy: { id: user.userId },
      organization: { id: user.organization.id },
    });
    return this.taskRepo.save(task);
  }

  async findByUser(user: any) {
    return this.taskRepo.find({
      where: { organization: { id: user.organization.id } },
      relations: ['createdBy', 'organization'],
    });
  }

  async update(id: number, dto: UpdateTaskDto, user: any) {
    const task = await this.taskRepo.findOne({ where: { id }, relations: ['organization'] });
    if (!task || task.organization.id !== user.organization.id) {
      throw new NotFoundException('Task not found or access denied');
    }
    Object.assign(task, dto);
    return this.taskRepo.save(task);
  }

  async delete(id: number, user: any) {
    const task = await this.taskRepo.findOne({ where: { id }, relations: ['organization'] });
    if (!task || task.organization.id !== user.organization.id) {
      throw new NotFoundException('Task not found or access denied');
    }
    return this.taskRepo.remove(task);
  }
}
