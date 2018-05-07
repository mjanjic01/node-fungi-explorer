import { inject } from 'inversify';
import { Connection } from 'typeorm';
import { Repository as DbSet } from 'typeorm';

import { Fungi, IFungiRepository } from '../domain';
import { Provide, TYPES } from '../ioc';
import { FungiEntity } from './mapping/FungiEntity';
import Repository from './Repository';

@Provide(TYPES.FungiRepository)
export default class FungiRepository extends Repository<Fungi> implements IFungiRepository {
  private fungiContext: DbSet<Fungi>;

  constructor(@inject(TYPES.DbConnectionProvider) context: Connection) {
    super(context.getRepository(FungiEntity));
    this.fungiContext = context.getRepository(FungiEntity);
  }
}
