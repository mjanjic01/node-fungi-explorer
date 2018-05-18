import Entity from './Entity';

export default class Genus extends Entity {
  public name: string;

  public toString() {
    return this.name;
  }
}
