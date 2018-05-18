import Entity from './Entity';

export default class Edibility extends Entity {
  public rating: string;

  public toString() {
    return this.rating;
  }
}
