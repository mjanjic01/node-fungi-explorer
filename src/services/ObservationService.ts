import { inject } from 'inversify';

import {
  Fungi,
  IFungiRepository,
  ILocationRepository,
  IObservationRepository,
  Location,
  Observation,
} from '../domain';
import { Provide, TYPES } from '../ioc';

export interface IObservationService {
  getObservations(): Promise<Array<Observation>>
  getFungi(): Promise<Array<Fungi>>
  createObservation(Observation: Observation): Promise<Observation>
}

@Provide(TYPES.ObservationService)
export class ObservationService implements IObservationService {
  constructor(
    @inject(TYPES.FungiRepository) private fungiRepository: IFungiRepository,
    @inject(TYPES.ObservationRepository) private observationRepository: IObservationRepository,
    @inject(TYPES.LocationRepository) private locationRepository: ILocationRepository,
  ) { }

  public async getObservations(): Promise<Array<Observation>> {
    return await this.observationRepository.getAll();
  }

  public async getFungi(): Promise<Array<Fungi>> {
    return await this.fungiRepository.getAll();
  }

  public async createObservation(observationData: Observation): Promise<Observation> {
    let observationLocation: Location = null;
    if (observationData.location.latitude && observationData.location.latitude) {
      observationLocation = await this.locationRepository.insert(observationData.location);
    }
    return await this.observationRepository.insert({
      date: observationData.date,
      description: observationData.description,
      fungi: observationData.fungi,
      image: observationData.image,
      location: observationLocation,
    });
  }
}
