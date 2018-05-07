import { inject } from 'inversify';

import { Fungi, IFungiRepository, IObservationRepository, Observation } from '../domain';
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
  ) { }

  public async getObservations(): Promise<Array<Observation>> {
    return await this.observationRepository.getAll();
  }

  public async getFungi(): Promise<Array<Fungi>> {
    return await this.fungiRepository.getAll();
  }

  public async createObservation(observation: Observation): Promise<Observation> {
    return await this.observationRepository.insert(observation);
  }
}
