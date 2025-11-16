import { DataSource, Repository } from 'typeorm';
import { UserModel } from '../database/typeorm/model/UserModel';
import UserRepository from './UserRepository';
import User from '../../domain/entity/User';

export default class UserRepositoryTypeORM implements UserRepository {
  private readonly userRepository: Repository<UserModel>;

  constructor(private readonly dataSource: DataSource) {
    this.userRepository = dataSource.getRepository(UserModel);
  }

  async save(user: User): Promise<void> {
    const model = this.parseDomainToModel(user);
    await this.userRepository.save(model);
  }

  async findById(id: string): Promise<User | null> {
    const model = await this.userRepository.findOneBy({ id });
    if (!model) return null;
    return this.parseModelToDomain(model);
  }

  async findByEmail(email: string): Promise<User | null> {
    const model = await this.userRepository.findOneBy({ email });
    if (!model) return null;
    return this.parseModelToDomain(model);
  }

  private parseDomainToModel(user: User): UserModel {
    const model = new UserModel();
    model['id'] = user.id;
    model['email'] = user.email;
    model['password'] = user.getPasswordHash();
    model['created_at'] = user.createdAt;
    return model;
  }

  private parseModelToDomain(model: UserModel): User {
    return new User(model.id, model.email, model.password, model.created_at);
  }
}
