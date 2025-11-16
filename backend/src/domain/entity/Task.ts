import { randomUUID } from 'crypto';

export default class Task {
  constructor(
    private readonly _id: string,
    private _title: string,
    private _finished: boolean = false,
    private readonly _userId: string,
    private readonly _createdAt: Date = new Date(),
  ) {
    if (!_id) this._id = randomUUID();
    if (!_title) throw new Error('Title cannot be empty');
  }

  static create(title: string, userId: string): Task {
    const id = crypto.randomUUID();

    if (!title) throw new Error('Invalid task title');
    if (!userId) throw new Error('User ID is required');

    return new Task(id, title, false, userId, new Date());
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get finished(): boolean {
    return this._finished;
  }

  get userId(): string {
    return this._userId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  changeTitle(newTitle: string) {
    if (!newTitle) throw new Error('Title cannot be empty');
    this._title = newTitle;
  }

  finish() {
    this._finished = true;
  }

  unfinish() {
    this._finished = false;
  }
}
