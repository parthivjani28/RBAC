import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // e.g. 'task:create', 'task:edit', 'audit:view'
}