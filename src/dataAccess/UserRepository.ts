import { inject } from 'inversify';
import { Connection } from 'typeorm';
import { Repository as DbSet } from 'typeorm';

import { IUserRepository, User } from '../domain';
import { Provide, TYPES } from '../ioc';
import { UserEntity } from './mapping/UserEntity';
import Repository from './Repository';

@Provide(TYPES.UserRepository)
export default class UserRepository extends Repository<User> implements IUserRepository {
  private userContext: DbSet<User>;

  constructor(@inject(TYPES.DbConnectionProvider) context: Connection) {
    super(context.getRepository(UserEntity));
    this.userContext = context.getRepository(UserEntity);
  }

  public async getByUsername(username: string): Promise<User> {
    return await this.userContext.findOne({ username });
  }
}
