import Entity from './Entity';
import Genus from './Genus';

export default class Species extends Entity {
  public name: string;
  public genus: Genus;

  public toString() {
    return this.name;
  }
}
