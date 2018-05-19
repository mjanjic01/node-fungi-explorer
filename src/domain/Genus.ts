import Entity from './Entity';

export default class Genus extends Entity {
  public name: string;

  public toString(): string {
    return this.name;
  }
}
