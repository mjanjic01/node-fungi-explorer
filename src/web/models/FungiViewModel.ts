import { Fungi } from '../../domain';

export default class FungiViewModel {
  public id: number;
  public genus: string;
  public species: string;
  public variant?: string;
  public name?: string;
  public isProtected?: boolean;
  public edibility?: string;
  public image?: string;

  constructor(fungi: Fungi, image?: string) {
    this.id = fungi.id;
    this.genus = fungi.species.genus.name;
    this.species = fungi.species.name;
    this.variant = fungi.variant;
    this.name = fungi.name;
    this.isProtected = fungi.isProtected;
    this.edibility = fungi.edibility.rating;
    this.image = image;
  }

  public fullLatinName(): string {
    return `${this.genus} ${this.species} ${this.variant || ''}`;
  }
}
