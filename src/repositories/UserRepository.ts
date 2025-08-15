import { User } from '../models/User';
import { BaseRepository } from './BaseRepository';
import { FindOptionsWhere } from 'typeorm';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email } as FindOptionsWhere<User>);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.repository.findOneBy({ username } as FindOptionsWhere<User>);
  }

  async findActiveUsers(): Promise<User[]> {
    return this.repository.findBy({ isActive: true } as FindOptionsWhere<User>);
  }
} 