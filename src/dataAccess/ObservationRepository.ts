import { inject } from 'inversify';
import { Brackets, Connection } from 'typeorm';
import { Repository as DbSet } from 'typeorm';

import { IObservationRepository, Location, Observation, User } from '../domain';
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

  public getPublicObservations(fungiId: number): Promise<Array<Observation>> {
    return this.observationContext
      .createQueryBuilder('Observation')
        .leftJoinAndSelect('Observation.location', 'Location')
        .leftJoinAndSelect('Observation.herbarium', 'Herbarium')
        .where('Observation.fungi = :fungiId', { fungiId })
        .andWhere('Herbarium.isPrivate = :isPrivate', { isPrivate: false })
        .getMany();
  }

  public getObservationsByUser(fungiId: number, userId: number): Promise<Array<Observation>> {
    return this.observationContext
      .createQueryBuilder('Observation')
        .leftJoinAndSelect('Observation.location', 'Location')
        .leftJoinAndSelect('Observation.herbarium', 'Herbarium')
        .leftJoinAndSelect('Herbarium.owners', 'User')
        .where('Observation.fungi = :fungiId', { fungiId })
        .andWhere('(User.id = :userId OR Herbarium.isPrivate = :isPrivate)', { userId, isPrivate: false })
        .getMany();
  }

  public async setObservationHerbarium(observationId: number, herbariumId: number): Promise<Observation> {
    await this.observationContext.update({
      id: observationId,
    }, {
      herbarium: herbariumId,
    } as any);
    return await this.getById(observationId);
  }
}
