import { randomUUID } from 'crypto';
import Task from '../src/domain/entity/Task';

test('should instantiate a Task', () => {
  const randomTaskId = randomUUID();
  const randomUserId = randomUUID();
  const task = new Task(randomTaskId, 'Test Task', false, randomUserId);
  expect(task).toBeInstanceOf(Task);
  expect(task.id).toBe(randomTaskId);
  expect(task.title).toBe('Test Task');
  expect(task.userId).toBe(randomUserId);
  expect(task.finished).toBe(false);
});

test('should throw an error when title is empty', () => {
  expect(() => {
    new Task(randomUUID(), '', false, randomUUID());
  }).toThrow('Title cannot be empty');
});

test('should throw an error when invalid title on create', () => {
  expect(() => {
    Task.create('', randomUUID());
  }).toThrow('Invalid task title');
});

test('should auto-generate an id if not provided', () => {
  const randomUserId = randomUUID();
  const task = Task.create('Test Task without ID', randomUserId);
  expect(task).toBeInstanceOf(Task);
  expect(task.id).toBeDefined();
  expect(task.title).toBe('Test Task without ID');
  expect(task.finished).toBe(false);
  expect(task.userId).toBe(randomUserId);
});

test('should finish a task', () => {
  const randomTaskId = randomUUID();
  const randomUserId = randomUUID();
  const task = new Task(randomTaskId, 'Unfinished Task', false, randomUserId);
  expect(task.finished).toBe(false);
  task.finish();
  expect(task.finished).toBe(true);
});
