import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { HerbariumType } from '../../domain';
import { HerbariumEntity } from './HerbariumEntity';
import { SpeciesEntity } from './SpeciesEntity';

@Entity('HerbariumType')
export class HerbariumTypeEntity extends HerbariumType {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
      length: 50,
    })
    public name: string;

    @OneToMany((type) => HerbariumEntity, (herbarium) => herbarium.type)
    public herbarium: HerbariumEntity;
}
