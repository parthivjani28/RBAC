import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { hasRole } from './role-hierarchy.util';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest();
    // Normalize user role and required roles to lowercase
    const userRole = user.role?.name?.toLowerCase?.() || user.role?.toLowerCase?.() || '';
    return requiredRoles.map(r => r.toLowerCase()).some(role => hasRole(userRole, role));
  }
}