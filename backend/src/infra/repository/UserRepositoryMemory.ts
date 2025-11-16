import User from '../../domain/entity/User';
import UserRepository from './UserRepository';

export default class UserRepositoryMemory implements UserRepository {
  private users: User[] = [];

  async save(user: User): Promise<void> {
    this.users.push(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }
}
