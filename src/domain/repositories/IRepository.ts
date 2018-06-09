import Entity from '../Entity';

export default interface IRepository<T extends Entity> {
  getAll(): Promise<Array<T>>;
  getById(id: number): Promise<T>;
  insert(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: number): Promise<T>;
  deleteAll(): Promise<void>;
}
