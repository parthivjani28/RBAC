import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from '../permissions/permission.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // 'Owner', 'Admin', 'Viewer'

  @ManyToMany(() => Permission, { eager: true })
  @JoinTable()
  permissions: Permission[];
}