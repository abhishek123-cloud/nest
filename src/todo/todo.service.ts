import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from '../todo/todo.entity';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  // Create a new Todo item
  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    try {
      const todo = this.todoRepository.create(createTodoDto);
      return await this.todoRepository.save(todo);
    } catch (error) {
      console.error('Error creating todo:', error);
      throw new InternalServerErrorException('Failed to create todo');
    }
  }

  // Get all Todo items
  async findAll(): Promise<Todo[]> {
    try {
      return await this.todoRepository.find();
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw new InternalServerErrorException('Failed to retrieve todos');
    }
  }

  // Get a specific Todo item by ID
  async findOne(id: number): Promise<Todo> {
    try {
      const todo = await this.todoRepository.findOne({
        where: { id }, // Corrected this to match the FindOneOptions format
      });
      if (!todo) {
        throw new NotFoundException(`Todo with ID ${id} not found`);
      }
      return todo;
    } catch (error) {
      console.error('Error fetching todo:', error);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to retrieve todo');
    }
  }

  // Update a Todo item by ID
  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    try {
      const todo = await this.findOne(id);
      const updatedTodo = Object.assign(todo, updateTodoDto);
      return await this.todoRepository.save(updatedTodo);
    } catch (error) {
      console.error('Error updating todo:', error);
      throw new InternalServerErrorException('Failed to update todo');
    }
  }

  // Delete a Todo item by ID
  async remove(id: number): Promise<void> {
    try {
      const todo = await this.findOne(id);
      await this.todoRepository.remove(todo);
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw new InternalServerErrorException('Failed to delete todo');
    }
  }
}