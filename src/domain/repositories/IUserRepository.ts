import User from '../User';
import IRepository from './IRepository';

export default interface IUserRepository extends IRepository<User> {
  getByUsername(username: string): Promise<User>;
}
