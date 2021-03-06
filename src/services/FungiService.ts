import { inject } from 'inversify';

import {
  Fungi,
  Herbarium,
  HerbariumType,
  IFungiRepository,
  IHerbariumRepository,
  IHerbariumTypeRepository,
  ILocationRepository,
  IObservationRepository,
  IUserRepository,
  Location,
  Observation,
  User,
} from '../domain';
import { Provide, TYPES } from '../ioc';

export interface IFungiService {
  getFungi(): Promise<Array<Fungi>>;
  getFungiById(fungiId: number): Promise<Fungi>;
  createFungi(Fungi: Fungi): Promise<Fungi>;
  searchFungi(searchTerm: string): Promise<Array<Fungi>>;

  getObservations(): Promise<Array<Observation>>;
  setObservationHerbarium(observationId: number, herbariumId: number): Promise<Observation>;
  createObservation(Observation: Observation, herbariumId: number): Promise<Observation>;
  fungiObservations(fungiId: number, user: User): Promise<Array<Observation>>;

  getHerbariumById(herbariumId: number, user: User): Promise<Herbarium>;
  getHerbariumsByUser(userId: number): Promise<Array<Herbarium>>;
  createHerbarium(herbarium: Herbarium, user: User): Promise<Herbarium>;
  updateHerbarium(herbarium: Herbarium): Promise<Herbarium>;
  deleteHerbarium(herbariumId: number): Promise<Herbarium>;
  getHerbariumTypes(): Promise<Array<HerbariumType>>;
  createHerbariumType(herbariumType: HerbariumType): Promise<HerbariumType>;
}

@Provide(TYPES.FungiService)
export class FungiService implements IFungiService {
  constructor(
    @inject(TYPES.FungiRepository) private fungiRepository: IFungiRepository,
    @inject(TYPES.HerbariumRepository) private herbariumRepository: IHerbariumRepository,
    @inject(TYPES.HerbariumTypeRepository) private herbariumTypeRepository: IHerbariumTypeRepository,
    @inject(TYPES.ObservationRepository) private observationRepository: IObservationRepository,
    @inject(TYPES.LocationRepository) private locationRepository: ILocationRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
  ) { }

  // #region fungi
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

  public async fungiObservations(fungiId: number, user: User): Promise<Array<Observation>> {
    if (!user) {
      return await this.observationRepository.getPublicObservations(fungiId);
    }
    return await this.observationRepository.getObservationsByUser(fungiId, user.id);
  }

  public async searchFungi(searchTerm: string): Promise<Array<Fungi>> {
    if (searchTerm && searchTerm.length) {
      return await this.fungiRepository.searchByName(searchTerm);
    }

    return this.getFungi();
  }
  // #endregion fungi

  // #region observations
  public async getObservations(): Promise<Array<Observation>> {
    return await this.observationRepository.getAll();
  }

  public async setObservationHerbarium(observationId: number, herbariumId: number): Promise<Observation> {
    return await this.observationRepository.setObservationHerbarium(observationId, herbariumId);
  }

  public async createObservation(observationData: Observation, herbariumId: number): Promise<Observation> {
    let observationLocation: Location = null;
    if (observationData.location.latitude && observationData.location.latitude) {
      observationLocation = await this.locationRepository.insert(observationData.location);
    }
    const observation: Observation = await this.observationRepository.insert({
      date: observationData.date,
      description: observationData.description,
      fungi: observationData.fungi,
      image: `/${observationData.image}`,
      location: observationLocation,
    });
    await this.setObservationHerbarium(observation.id, herbariumId);

    return observation;
  }
  // #endregion observations

  // #region herbariums
  public async getHerbariumById(herbariumId: number, user: User): Promise<Herbarium> {
    const herbarium = await this.herbariumRepository.getById(herbariumId);
    const herbariumOwner = herbarium.owners.find((owner) => owner.id === user.id);

    if (herbarium.isPrivate && !herbariumOwner) {
      throw new Error('Nedozvoljen pristup herbariju');
    }

    return herbarium;
  }

  public async getHerbariumsByUser(userId: number): Promise<Array<Herbarium>> {
    return await this.herbariumRepository.getByUserId(userId);
  }

  public async createHerbarium(herbarium: Herbarium, user: User): Promise<Herbarium> {
    const errors = [];
    if (!herbarium.name) {
      errors.push('Naziv herbarija je obvezan.');
    }

    if (
      herbarium.name &&
      (herbarium.name.length < 3 || herbarium.name.length > 20)
    ) {
      errors.push('Naziv herbarija mora biti između 3 i 20 znakova duljine.');
    }

    if (
      herbarium.description &&
      herbarium.description.length > 255
    ) {
      errors.push('Maksimalna duljina opisa herbarija je 255 znakova.');
    }

    const owner = await this.userRepository.getById(user.id);
    if (!owner) {
      errors.push(`Korisnik s identifikatorom ${user.id} ne postoji.`);
    }

    if (errors.length) {
      throw new Error(errors.join('\n'));
    }

    herbarium.owners = [owner];
    return await this.herbariumRepository.insert(herbarium);
  }

  public async updateHerbarium(herbarium: Herbarium): Promise<Herbarium> {
    return await this.herbariumRepository.update(herbarium);
  }

  public async deleteHerbarium(herbariumId: number): Promise<Herbarium> {
    return await this.herbariumRepository.delete(herbariumId);
  }

  public async getHerbariumTypes(): Promise<Array<HerbariumType>> {
    return await this.herbariumTypeRepository.getAll();
  }

  public async createHerbariumType(herbariumType: HerbariumType): Promise<HerbariumType> {
    return await this.herbariumTypeRepository.insert(herbariumType);
  }
  // #endregion herbariums
}
