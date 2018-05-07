import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Location } from '../../domain';

@Entity('Location')
export class LocationEntity extends Location {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
      precision: 9,
      scale: 6,
      type: 'decimal',
    })
    public longitude: number;

    @Column({
      precision: 9,
      scale: 6,
      type: 'decimal',
    })
    public latitude: number;
}
