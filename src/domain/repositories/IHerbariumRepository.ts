import Herbarium from '../Herbarium';
import IRepository from './IRepository';

export default interface IHerbariumRepository extends IRepository<Herbarium> {
  getByUserId(userId: number): Promise<Array<Herbarium>>;
}
