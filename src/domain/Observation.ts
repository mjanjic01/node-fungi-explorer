import Entity from './Entity';
import Fungi from './Fungi';
import Location from './Location';

export default class Observation extends Entity {
  public description?: string;
  public date: Date;
  public fungi: Fungi;
  public image?: string;
  public location?: Location;
}
