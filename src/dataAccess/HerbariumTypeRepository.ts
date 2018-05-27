import { inject } from 'inversify';
import { Connection, IsNull, Not } from 'typeorm';
import { Repository as DbSet } from 'typeorm';

import { HerbariumType, IHerbariumTypeRepository } from '../domain';
import { Provide, TYPES } from '../ioc';
import { HerbariumTypeEntity } from './mapping/HerbariumTypeEntity';
import Repository from './Repository';

@Provide(TYPES.HerbariumTypeRepository)
export default class HerbariumTypeRepository extends Repository<HerbariumType> implements IHerbariumTypeRepository {
  private herbariumContext: DbSet<HerbariumType>;

  constructor(@inject(TYPES.DbConnectionProvider) context: Connection) {
    super(context.getRepository(HerbariumTypeEntity));
    this.herbariumContext = context.getRepository(HerbariumTypeEntity);
  }
}
