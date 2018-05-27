import Entity from './Entity';

export default class HerbariumType extends Entity {
  public name: string;

  public toString(): string {
    return this.name;
  }
}
