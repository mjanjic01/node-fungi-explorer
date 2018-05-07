import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Species } from '../../domain';
import { FungiEntity } from './FungiEntity';
import { GenusEntity } from './GenusEntity';

@Entity('Species')
export class SpeciesEntity extends Species {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
      length: 50,
    })
    public name: string;

    /**
     * Rod
     */
    @ManyToOne((type) => GenusEntity, (genus) => genus.species, {
      eager: true,
      nullable: false,
    })
    @JoinColumn()
    public genus: GenusEntity;

    @OneToMany((type) => FungiEntity, (fungi) => fungi.species)
    public fungi: FungiEntity;
}
