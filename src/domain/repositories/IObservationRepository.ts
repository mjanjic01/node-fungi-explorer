import Observation from '../Observation';
import IRepository from './IRepository';

export default interface IObservationRepository extends IRepository<Observation> {
  getObservationsByFungi(fungiId: number): Promise<Array<Observation>>;
}
