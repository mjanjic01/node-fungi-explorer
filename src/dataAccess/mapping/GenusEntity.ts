import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Genus } from '../../domain';
import { SpeciesEntity } from './SpeciesEntity';

@Entity('Genus')
export class GenusEntity extends Genus {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
      length: 50,
    })
    public name: string;

    @OneToMany((type) => SpeciesEntity, (species) => species.genus)
    public species: SpeciesEntity;
}
