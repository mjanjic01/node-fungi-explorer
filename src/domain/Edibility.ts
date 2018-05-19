import Entity from './Entity';

export default class Edibility extends Entity {
  public rating: string;

  public toString(): string {
    return this.rating;
  }
}
