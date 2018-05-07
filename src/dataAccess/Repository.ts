import { injectable } from 'inversify';
import { Repository as DbSet } from 'typeorm';

import { Entity, IRepository } from '../domain';

@injectable()
export default class Repository<T extends Entity> implements IRepository<T> {
  constructor(private context: DbSet<T>) { }

  public async getAll(): Promise<Array<T>> {
    return await this.context.find();
  }

  public async getById(id: number): Promise<T> {
    return await this.context.findOne(id);
  }

  public async insert(entity: T): Promise<T> {
    await this.context.insert(entity);
    return entity;
  }

  public async update(entity: T): Promise<T> {
    await this.context.update(entity.id, entity as object);
    return entity;
  }

  public async delete(id: number): Promise<T> {
    const entity = await this.context.findOne(id);
    await this.context.remove(entity);
    return entity;
  }
}
