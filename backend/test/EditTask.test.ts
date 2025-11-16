import { randomUUID } from 'crypto';
import CreateTask from '../src/application/use-case/CreateTask';
import EditTask from '../src/application/use-case/EditTask';
import Task from '../src/domain/entity/Task';
import TaskRepositoryMemory from '../src/infra/repository/TaskRepositoryMemory';

it('should edit a task title', async () => {
  const taskRepository = new TaskRepositoryMemory();
  const createTask = new CreateTask(taskRepository);
  const editTask = new EditTask(taskRepository);

  const userId = randomUUID();

  const task = await createTask.execute({
    title: 'Original Title',
    userId: userId,
  });

  const createdTask = await taskRepository.findById(task.id, userId);
  expect(createdTask).toBeDefined();
  expect(createdTask).toBeInstanceOf(Task);
  expect(createdTask?.title).toBe('Original Title');

  await editTask.execute({
    id: task.id,
    title: 'Updated Title',
    finished: task.finished,
    userId: userId,
  });

  const updatedTask = await taskRepository.findById(task.id, userId);
  expect(updatedTask).toBeDefined();
  expect(updatedTask?.title).toBe('Updated Title');
});
