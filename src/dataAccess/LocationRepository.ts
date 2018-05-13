import { inject } from 'inversify';
import { Connection } from 'typeorm';
import { Repository as DbSet } from 'typeorm';

import { ILocationRepository, Location } from '../domain';
import { Provide, TYPES } from '../ioc';
import { LocationEntity } from './mapping/LocationEntity';
import Repository from './Repository';

@Provide(TYPES.LocationRepository)
export default class LocationRepository extends Repository<Location> implements ILocationRepository {
  private locationContext: DbSet<Location>;

  constructor(@inject(TYPES.DbConnectionProvider) context: Connection) {
    super(context.getRepository(LocationEntity));
    this.locationContext = context.getRepository(LocationEntity);
  }
}
