import { randomUUID } from 'crypto';
import CreateTask from '../src/application/use-case/CreateTask';
import RemoveTask from '../src/application/use-case/RemoveTask';
import Task from '../src/domain/entity/Task';
import TaskRepositoryMemory from '../src/infra/repository/TaskRepositoryMemory';

it('should remove a task', async () => {
  const taskRepository = new TaskRepositoryMemory();
  const createTask = new CreateTask(taskRepository);
  const removeTask = new RemoveTask(taskRepository);

  const userId = randomUUID();

  const task = await createTask.execute({
    title: 'Test Task to be removed',
    userId,
  });

  const createdTask = await taskRepository.findById(task.id, userId);
  expect(createdTask).toBeDefined();
  expect(createdTask).toBeInstanceOf(Task);

  await removeTask.execute({ id: task.id, userId });

  const deletedTask = await taskRepository.findById(task.id, userId);
  expect(deletedTask).toBeNull();
});

it('should throw an error when trying to remove a non-existing task', async () => {
  const taskRepository = new TaskRepositoryMemory();
  const removeTask = new RemoveTask(taskRepository);

  const userId = randomUUID();

  await expect(
    removeTask.execute({ id: randomUUID(), userId }),
  ).rejects.toThrow('Tarefa não encontrada');
});
