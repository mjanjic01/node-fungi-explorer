import Edibility from './Edibility';
import Entity from './Entity';
import Species from './Species';

export default class Fungi extends Entity {
  public species: Species;
  public variant?: string;
  public name?: string;
  public isProtected?: boolean;
  public edibility?: Edibility;
}
