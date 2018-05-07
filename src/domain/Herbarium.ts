import Entity from './Entity';
import Observation from './Observation';

export default class Herbarium extends Entity {
  public name: string;
  public description?: string;
  public isPrivate: boolean;
  public observations: Array<Observation>;
}
