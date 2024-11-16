import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { Repository } from 'typeorm';
import { Todo } from '../todo/todo.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

// Mock Repository
const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

// Helper Function for Mock Todo
const createMockTodo = (id: number, title: string): Todo => ({
  id,
  title,
  description: `${title} description`,
  status: false,
  created_at: new Date(),
  updated_at: new Date(),
});

describe('TodoService', () => {
  let service: TodoService;
  let repository: jest.Mocked<Repository<Todo>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    repository = module.get(getRepositoryToken(Todo));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const todos = [createMockTodo(1, 'Test Todo')];
      repository.find.mockResolvedValue(todos);

      const result = await service.findAll();
      expect(result).toEqual(todos);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single todo', async () => {
      const todo = createMockTodo(1, 'Test Todo');
      repository.findOne.mockResolvedValue(todo);

      const result = await service.findOne(1);
      expect(result).toEqual(todo);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if todo not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const dto = { title: 'New Todo', description: 'New Desc', status: false };
      const todo = createMockTodo(1, dto.title);
      repository.create.mockReturnValue(todo);
      repository.save.mockResolvedValue(todo);

      const result = await service.create(dto);
      expect(result).toEqual(todo);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(todo);
    });
  });

  describe('update', () => {
    it('should update an existing todo', async () => {
      const todo = createMockTodo(1, 'Old Todo');
      const updatedDto = { title: 'Updated Todo', description: 'Updated Desc', status: true };
      const updatedTodo = { ...todo, ...updatedDto };

      repository.findOne.mockResolvedValue(todo);
      repository.save.mockResolvedValue(updatedTodo);

      const result = await service.update(1, updatedDto);
      expect(result).toEqual(updatedTodo);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.save).toHaveBeenCalledWith(updatedTodo);
    });

    it('should throw NotFoundException if todo not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.update(1, { title: 'Updated' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a todo', async () => {
      const todo = createMockTodo(1, 'Todo to delete');
      repository.findOne.mockResolvedValue(todo);
      repository.remove.mockResolvedValue(todo);

      const result = await service.remove(1);
      expect(result).toBeUndefined();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.remove).toHaveBeenCalledWith(todo);
    });

    it('should throw NotFoundException if todo not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
})