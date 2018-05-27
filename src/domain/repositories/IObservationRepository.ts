import Observation from '../Observation';
import User from '../User';
import IRepository from './IRepository';

export default interface IObservationRepository extends IRepository<Observation> {
  getPublicObservations(fungiId: number): Promise<Array<Observation>>;
  getObservationsByUser(fungiId: number, userId: number): Promise<Array<Observation>>;
}
