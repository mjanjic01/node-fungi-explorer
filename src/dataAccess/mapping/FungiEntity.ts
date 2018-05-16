import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Edibility, Fungi } from '../../domain';
import { EdibilityEntity } from './EdibilityEntity';
import { GenusEntity } from './GenusEntity';
import { ObservationEntity } from './ObservationEntity';
import { SpeciesEntity } from './SpeciesEntity';

@Entity('Fungi')
export class FungiEntity extends Fungi {

    @PrimaryGeneratedColumn()
    public id: number;

    /**
     * Vrsta
     */
    @ManyToOne((type) => SpeciesEntity, (species) => species.fungi, {
      eager: true,
      nullable: false,
    })
    @JoinColumn()
    public species: SpeciesEntity;

    /**
     * Varijanta
     */
    @Column({
      length: 50,
      nullable: true,
    })
    public variant: string;

    @Column({
      length: 255,
      nullable: true,
    })
    public name: string;

    @Column({
      name: 'protected',
      nullable: true,
    })
    public isProtected: boolean;

    @ManyToOne((type) => EdibilityEntity, (edibility) => edibility.fungi, {
      eager: true,
      onDelete: 'SET NULL',
    })
    @JoinColumn()
    public edibility: EdibilityEntity;

    @OneToMany((type) => ObservationEntity, (observation) => observation.fungi)
    public observations: ObservationEntity;

    @Column({
      type: 'tsvector',
    })
    @Index('weighted_tsv_idx', {
      synchronize: false,
    })
    public weightedTsv: ObservationEntity;
}
