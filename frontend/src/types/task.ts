export interface Task {
  id: string;
  title: string;
  finished: boolean;
}

export interface ListTasksOutput {
  tasks: Task[];
  count: number;
  page: number;
  limit: number;
}
