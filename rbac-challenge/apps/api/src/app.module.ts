import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { Organization } from './organizations/organization.entity';
import { OrganizationModule } from './organizations/organization.module';
import { Task } from './tasks/task.entity';
import { User } from './users/users.entity';
import { Role } from './roles/role.entity';
import { Permission } from './permissions/permission.entity';
import { RolesModule } from './roles/roles.module';
import { AuditLog } from './audit-log/audit-log.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'mydatabase.db',
      entities: [User, Task, Organization, Role, Permission, AuditLog],
      synchronize: true,
    }),
    OrganizationModule,
    AuthModule,
    UsersModule,
    TasksModule,
    RolesModule,
  ],
})
export class AppModule {}
