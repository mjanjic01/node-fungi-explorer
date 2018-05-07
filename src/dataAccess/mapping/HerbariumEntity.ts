import {
  Column,
  Entity,
  EntitySchema,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Fungi, Herbarium, Observation } from '../../domain';
import { ObservationEntity } from './ObservationEntity';
import { UserEntity } from './UserEntity';

@Entity('Herbarium')
export class HerbariumEntity extends Herbarium {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    length: 50,
  })
  public name: string;

  @Column({
    nullable: true,
  })
  public description: string;

  @Column({
    name: 'private',
  })
  public isPrivate: boolean;

  @OneToMany((type) => ObservationEntity, (observation) => observation.herbarium)
  public observations: Array<ObservationEntity>;
}
