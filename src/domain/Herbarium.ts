import Entity from './Entity';
import HerbariumType from './HerbariumType';
import Observation from './Observation';
import User from './User';

export default class Herbarium extends Entity {
  public name: string;
  public description?: string;
  public isPrivate: boolean;
  public type: HerbariumType;
  public observations?: Array<Observation>;
  public owners?: Array<User>;
}
