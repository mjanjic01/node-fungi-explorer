import Edibility from './Edibility';
import Entity from './Entity';
import Species from './Species';

export default class Fungi extends Entity {
  public species: Species;
  public variant?: string;
  public name?: string;
  public isProtected?: boolean;
  public edibility?: Edibility;

  public get fullLatinName() {
    return `${this.species.genus.name} ${this.species.name} ${this.variant || ''}`;
  }

  public toString() {
    if (this.name && this.name.length) {
      return `${this.name} - [${this.fullLatinName}]`;
    }

    return this.fullLatinName;
  }
}
