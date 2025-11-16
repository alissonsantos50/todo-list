import TaskRepositoryMemory from '../src/infra/repository/TaskRepositoryMemory';
import CreateTask from '../src/application/use-case/CreateTask';
import { randomUUID } from 'crypto';

test('should create and return a Task', async () => {
  const taskRepository = new TaskRepositoryMemory();
  const createTask = new CreateTask(taskRepository);
  const userId = randomUUID();

  const input = { title: 'New Task', userId };
  const output = await createTask.execute(input);

  expect(output).toHaveProperty('id');
  expect(output.title).toBe('New Task');
  expect(output.finished).toBe(false);
  expect(output.createdAt).toBeInstanceOf(Date);

  const allTasks = await taskRepository.findAll(userId);
  expect(allTasks.length).toBe(1);
  expect(allTasks[0].id).toBe(output.id);
  expect(allTasks[0].title).toBe('New Task');
  expect(allTasks[0].finished).toBe(false);
  expect(allTasks[0].createdAt).toBeInstanceOf(Date);
});
