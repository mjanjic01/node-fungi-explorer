import { inject } from 'inversify';
import { Connection, IsNull, Not } from 'typeorm';
import { Repository as DbSet } from 'typeorm';

import { Herbarium, IHerbariumRepository, Location } from '../domain';
import { Provide, TYPES } from '../ioc';
import { HerbariumEntity } from './mapping/HerbariumEntity';
import Repository from './Repository';

@Provide(TYPES.HerbariumRepository)
export default class HerbariumRepository extends Repository<Herbarium> implements IHerbariumRepository {
  private herbariumContext: DbSet<Herbarium>;

  constructor(@inject(TYPES.DbConnectionProvider) context: Connection) {
    super(context.getRepository(HerbariumEntity));
    this.herbariumContext = context.getRepository(HerbariumEntity);
  }

  public getByUserId(userId: number): Promise<Array<Herbarium>> {
    return this.herbariumContext
      .createQueryBuilder('Herbarium')
        .leftJoinAndSelect('Herbarium.owners', 'User')
        .leftJoinAndSelect('Herbarium.observations', 'Observation')
        .leftJoinAndSelect('Observation.fungi', 'Fungi')
        .leftJoinAndSelect('Fungi.species', 'Species')
        .leftJoinAndSelect('Species.genus', 'Genus')
        .where('User.id = :userId', { userId })
        .getMany();
  }
}
