import TaskRepository from '../../infra/repository/TaskRepository';

export default class ListTasks {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: ListTasksInput): Promise<ListTasksOutput> {
    const [tasks, count] = await this.taskRepository.findAll(
      input.userId,
      input.page,
      input.limit,
      input.filter,
    );

    return {
      tasks: tasks.map((task) => ({
        id: task.id,
        title: task.title,
        finished: task.finished,
        createdAt: task.createdAt,
      })),
      count,
      page: input.page,
      limit: input.limit,
    };
  }
}

type ListTasksInput = {
  userId: string;
  page: number;
  limit: number;
  filter?: string;
};

type ListTasksOutput = {
  tasks: {
    id: string;
    title: string;
    finished: boolean;
    createdAt: Date;
  }[];
  count: number;
  page: number;
  limit: number;
};
