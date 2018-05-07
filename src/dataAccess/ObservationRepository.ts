import { inject } from 'inversify';
import { Connection } from 'typeorm';
import { Repository as DbSet } from 'typeorm';

import { IObservationRepository, Observation } from '../domain';
import { Provide, TYPES } from '../ioc';
import { ObservationEntity } from './mapping/ObservationEntity';
import Repository from './Repository';

@Provide(TYPES.ObservationRepository)
export default class ObservationRepository extends Repository<Observation> implements IObservationRepository {
  private observationContext: DbSet<Observation>;

  constructor(@inject(TYPES.DbConnectionProvider) context: Connection) {
    super(context.getRepository(ObservationEntity));
    this.observationContext = context.getRepository(ObservationEntity);
  }
}
