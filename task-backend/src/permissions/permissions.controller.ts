import { Controller, Post, Body, Param, Get, UseGuards, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../roles/role.entity';
import { Permission } from './permission.entity';
import { Permissions } from './permissions.decorator';
import { PermissionsGuard } from './permissions.guard';

@Controller('permissions')
export class PermissionsController {
  constructor(
    @InjectRepository(Role) private rolesRepo: Repository<Role>,
    @InjectRepository(Permission) private permsRepo: Repository<Permission>,
  ) {}

  @Post('assign')
  async assignPermissionToRole(
    @Body() body: { roleName: string; permissionName: string }
  ) {
    const role = await this.rolesRepo.findOne({ where: { name: body.roleName }, relations: ['permissions'] });
    if (!role) throw new NotFoundException('Role not found');
    const perm = await this.permsRepo.findOne({ where: { name: body.permissionName } });
    if (!perm) throw new NotFoundException('Permission not found');
    if (role.permissions.some(p => p.id === perm.id)) {
      throw new BadRequestException('Permission already assigned to role');
    }
    role.permissions.push(perm);
    await this.rolesRepo.save(role);
    return { message: `Permission '${perm.name}' assigned to role '${role.name}'` };
  }

  @Post('remove')
  async removePermissionFromRole(
    @Body() body: { roleName: string; permissionName: string }
  ) {
    const role = await this.rolesRepo.findOne({ where: { name: body.roleName }, relations: ['permissions'] });
    if (!role) throw new NotFoundException('Role not found');
    const perm = await this.permsRepo.findOne({ where: { name: body.permissionName } });
    if (!perm) throw new NotFoundException('Permission not found');
    role.permissions = role.permissions.filter(p => p.id !== perm.id);
    await this.rolesRepo.save(role);
    return { message: `Permission '${perm.name}' removed from role '${role.name}'` };
  }

  @Get()
  async getAllPermissions() {
    return this.permsRepo.find();
  }

  @Get('role/:roleName')
  async getPermissionsForRole(@Param('roleName') roleName: string) {
    const role = await this.rolesRepo.findOne({ where: { name: roleName }, relations: ['permissions'] });
    if (!role) throw new NotFoundException('Role not found');
    return role.permissions;
  }

  @UseGuards(PermissionsGuard)
  @Permissions('permission:manage')
  @Get('protected')
  protectedExample() {
    return { message: 'You have permission:manage!' };
  }
}

async function removePermissionFromRole(
    rolesRepo: Repository<Role>,
    permsRepo: Repository<Permission>,
    body: { roleName: string; permissionName: string }
) {
    const role = await rolesRepo.findOne({ where: { name: body.roleName }, relations: ['permissions'] });
    if (!role) throw new NotFoundException('Role not found');
    const perm = await permsRepo.findOne({ where: { name: body.permissionName } });
    if (!perm) throw new NotFoundException('Permission not found');
    role.permissions = role.permissions.filter(p => p.id !== perm.id);
    await rolesRepo.save(role);
    return { message: `Permission '${perm.name}' removed from role '${role.name}'` };
}
