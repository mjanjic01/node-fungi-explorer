import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Observation } from '../../domain';
import { FungiEntity } from './FungiEntity';
import { HerbariumEntity } from './HerbariumEntity';
import { LocationEntity } from './LocationEntity';

@Entity('Observation')
export class ObservationEntity extends Observation {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
      nullable: true,
    })
    public description?: string;

    @Column({
      type: 'date',
    })
    public date: Date;

    @Column({
      nullable: true,
    })
    public image?: string;

    @ManyToOne((type) => FungiEntity, (fungi) => fungi.observations, {
      eager: true,
      nullable: false,
      onDelete: 'CASCADE',
    })
    @JoinColumn()
    public fungi: FungiEntity;

    @OneToOne((type) => LocationEntity, {
      onDelete: 'SET NULL',
    })
    @JoinColumn()
    public location: LocationEntity;

    @ManyToOne((type) => HerbariumEntity, (herbarium) => herbarium.observations, {
      onDelete: 'CASCADE',
    })
    public herbarium: HerbariumEntity;
}
