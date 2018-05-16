import Fungi from '../Fungi';
import IRepository from './IRepository';

export default interface IFungiRepository extends IRepository<Fungi> {
  searchByName(searchTerm: string): Promise<Array<Fungi>>;
}
