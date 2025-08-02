import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;

  @Column()
  userId: number;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ nullable: true })
  details: string;
}