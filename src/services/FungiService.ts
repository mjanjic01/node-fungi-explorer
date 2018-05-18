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

export interface IFungiService {
  getFungi(): Promise<Array<Fungi>>;
  getFungiById(fungiId: number): Promise<Fungi>;
  createFungi(Fungi: Fungi): Promise<Fungi>;
  searchFungi(searchTerm: string): Promise<Array<Fungi>>;

  getObservations(): Promise<Array<Observation>>;
  createObservation(Observation: Observation): Promise<Observation>;
  fungiObservations(fungiId: number): Promise<Array<Observation>>;
}

@Provide(TYPES.FungiService)
export class FungiService implements IFungiService {
  constructor(
    @inject(TYPES.FungiRepository) private fungiRepository: IFungiRepository,
    @inject(TYPES.ObservationRepository) private observationRepository: IObservationRepository,
    @inject(TYPES.LocationRepository) private locationRepository: ILocationRepository,
  ) { }

  public async getFungi(): Promise<Array<Fungi>> {
    return await this.fungiRepository.getAll();
  }

  public async getFungiById(fungiId: number): Promise<Fungi> {
    return await this.fungiRepository.getById(fungiId);
  }

  public async createFungi(fungi: Fungi): Promise<Fungi> {
    return await this.fungiRepository.insert(fungi);
  }

  public async fungiDetails(fungiId: number): Promise<Fungi> {
    return await this.fungiRepository.getById(fungiId);
  }

  public async fungiObservations(fungiId: number): Promise<Array<Observation>> {
    return (await this.observationRepository.getObservationsByFungi(fungiId));
  }

  public async searchFungi(searchTerm: string): Promise<Array<Fungi>> {
    if (searchTerm && searchTerm.length) {
      return await this.fungiRepository.searchByName(searchTerm);
    }

    return this.getFungi();
  }

  public async getObservations(): Promise<Array<Observation>> {
    return await this.observationRepository.getAll();
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
      image: `/${observationData.image}`,
      location: observationLocation,
    });
  }
}
