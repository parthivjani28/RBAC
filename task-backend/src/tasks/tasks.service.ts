import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../users/users.entity';
import { AuditLogService } from '../audit-log/audit-log.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepo: Repository<Task>,
    private auditLogService: AuditLogService,
  ) {}

  /**
   * The user object passed to this method MUST have 'organization' and 'role' relations loaded.
   * If you get an error here, ensure your Auth Guard or decorator fetches the user with these relations.
   */
  async createTask(data: { title: string; description?: string }, user: User) {
    if (!user.organization || !user.organization.id) {
      throw new ForbiddenException('User organization not loaded. Ensure user is loaded with organization relation.');
    }
    if (!user.role || !user.role.name) {
      throw new ForbiddenException('User role not loaded. Ensure user is loaded with role relation.');
    }
    // Normalize role name to lowercase
    const userRole = user.role.name.toLowerCase();
    const task = this.tasksRepo.create({
      ...data,
      owner: user,
      organization: { id: user.organization.id },
    });
    await this.auditLogService.log('create_task', user.id, `Task: ${data.title}`);
    return this.tasksRepo.save(task);
  }

  async findAll(user: User) {
    // Owner: all tasks in org, Admin: all in org, Viewer: only own
    const userRole = user.role.name.toLowerCase();
    let where: any = { organization: { id: user.organization.id } };
    if (userRole === 'viewer') {
      where.owner = { id: user.id };
    }
    return this.tasksRepo.find({
      where,
      relations: ['owner', 'organization'],
      order: { id: 'DESC' },
    });
  }

  async updateTask(id: number, data: any, user: User) {
    const task = await this.tasksRepo.findOne({ where: { id }, relations: ['owner', 'organization'] });
    if (!task) throw new NotFoundException('Task not found');
    if (!this.canEditOrDelete(task, user)) throw new ForbiddenException('No permission');
    Object.assign(task, data);
    await this.auditLogService.log('update_task', user.id, `Task ID: ${id}`);
    return this.tasksRepo.save(task);
  }

  async deleteTask(id: number, user: User) {
    const task = await this.tasksRepo.findOne({ where: { id }, relations: ['owner', 'organization'] });
    if (!task) throw new NotFoundException('Task not found');
    if (!this.canEditOrDelete(task, user)) throw new ForbiddenException('No permission');
    await this.tasksRepo.remove(task);
    await this.auditLogService.log('delete_task', user.id, `Task ID: ${id}`);
    return { deleted: true };
  }

  private canEditOrDelete(task: Task, user: User) {
    // Owner/Admin: can edit/delete any in org, Viewer: only own
    const userRole = user.role.name.toLowerCase();
    if (userRole === 'owner' || userRole === 'admin') {
      return task.organization.id === user.organization.id;
    }
    return task.owner.id === user.id;
  }
}