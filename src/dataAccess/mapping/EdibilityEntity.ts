import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Edibility } from '../../domain';
import { FungiEntity } from './FungiEntity';

@Entity('Edibility')
export class EdibilityEntity extends Edibility {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
      length: 50,
    })
    public rating: string;

    @OneToMany((type) => FungiEntity, (fungi) => fungi.edibility)
    public fungi: FungiEntity;
}
