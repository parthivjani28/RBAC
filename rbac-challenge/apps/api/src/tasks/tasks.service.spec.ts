import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { AuditLogService } from '../audit-log/audit-log.service';
import { User } from '../users/users.entity';

const mockTasksRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

const mockAuditLogService = {
  log: jest.fn(),
};

describe('TasksService', () => {
  let service: TasksService;
  let tasksRepo: typeof mockTasksRepo;
  let auditLogService: typeof mockAuditLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: mockTasksRepo },
        { provide: AuditLogService, useValue: mockAuditLogService },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    tasksRepo = module.get(getRepositoryToken(Task));
    auditLogService = module.get(AuditLogService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw if user organization not loaded', async () => {
    const user = { role: { name: 'owner' } } as User;
    await expect(service.createTask({ title: 't' }, user)).rejects.toThrow('User organization not loaded');
  });

  it('should throw if user role not loaded', async () => {
    const user = { organization: { id: 1 } } as User;
    await expect(service.createTask({ title: 't' }, user)).rejects.toThrow('User role not loaded');
  });

  it('should create a task for owner', async () => {
    const user = { id: 1, organization: { id: 1 }, role: { name: 'owner' } } as any;
    tasksRepo.create.mockReturnValue({ title: 't', owner: user, organization: { id: 1 } });
    tasksRepo.save.mockResolvedValue({ id: 1, title: 't' });
    auditLogService.log.mockResolvedValue(undefined);
    const result = await service.createTask({ title: 't' }, user);
    expect(tasksRepo.create).toHaveBeenCalled();
    expect(tasksRepo.save).toHaveBeenCalled();
    expect(auditLogService.log).toHaveBeenCalledWith('create_task', 1, expect.any(String));
    expect(result).toEqual({ id: 1, title: 't' });
  });

  it('should only allow viewer to find own tasks', async () => {
    const user = { id: 2, organization: { id: 1 }, role: { name: 'viewer' } } as any;
    tasksRepo.find.mockResolvedValue([{ id: 1, owner: { id: 2 } }]);
    const result = await service.findAll(user);
    expect(tasksRepo.find).toHaveBeenCalledWith({
      where: { organization: { id: 1 }, owner: { id: 2 } },
      relations: ['owner', 'organization'],
      order: { id: 'DESC' },
    });
    expect(result).toEqual([{ id: 1, owner: { id: 2 } }]);
  });

  it('should not allow viewer to update others tasks', async () => {
    const user = { id: 2, organization: { id: 1 }, role: { name: 'viewer' } } as any;
    tasksRepo.findOne.mockResolvedValue({ id: 1, owner: { id: 3 }, organization: { id: 1 } });
    await expect(service.updateTask(1, { title: 'new' }, user)).rejects.toThrow('No permission');
  });
});
