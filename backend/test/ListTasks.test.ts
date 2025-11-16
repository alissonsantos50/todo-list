import { randomUUID } from 'crypto';
import CreateTask from '../src/application/use-case/CreateTask';
import ListTasks from '../src/application/use-case/ListTasks';
import TaskRepositoryMemory from '../src/infra/repository/TaskRepositoryMemory';

test('should list all tasks', async () => {
  const taskRepository = new TaskRepositoryMemory();
  const createTask = new CreateTask(taskRepository);
  const listTasks = new ListTasks(taskRepository);

  const userId = randomUUID();

  const task1 = await createTask.execute({ title: 'First Task', userId });
  const task2 = await createTask.execute({ title: 'Second Task', userId });

  const output = await listTasks.execute({ userId, page: 1, limit: 10 });

  expect(output.tasks.length).toBe(2);

  expect(output.tasks).toEqual(
    expect.arrayContaining([
      {
        id: task1.id,
        title: 'First Task',
        finished: false,
        createdAt: task1.createdAt,
      },
      {
        id: task2.id,
        title: 'Second Task',
        finished: false,
        createdAt: task2.createdAt,
      },
    ]),
  );
});
