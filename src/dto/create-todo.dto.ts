// src/todo/dto/create-todo.dto.ts
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsBoolean()
  @IsOptional()
  status: boolean = false; // Default value for status

  constructor(title: string, description: string, status?: boolean) {
    this.title = title;
    this.description = description;
    if (status !== undefined) {
      this.status = status;
    }
  }
}