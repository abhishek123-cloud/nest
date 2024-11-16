// src/todo/entities/todo.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: false })
  status: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Constructor to initialize every parameter
  constructor(
    id: number,

    title: string,
    description: string,
    status: boolean = false, // Default to 'false' if not provided
    created_at?: Date,
    updated_at?: Date
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.created_at = created_at || new Date(); // Set the current timestamp if not provided
    this.updated_at = updated_at || new Date(); // Set the current timestamp if not provided
  }
}