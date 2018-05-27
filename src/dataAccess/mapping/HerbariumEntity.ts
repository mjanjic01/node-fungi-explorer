import {
  Column,
  Entity,
  EntitySchema,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Fungi, Herbarium, Observation } from '../../domain';
import { HerbariumTypeEntity } from './HerbariumTypeEntity';
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

  @ManyToOne((type) => HerbariumTypeEntity, (types) => types.herbarium, {
    eager: true,
    nullable: false,
  })
  @JoinColumn()
  public type: HerbariumTypeEntity;

  @Column({
    name: 'private',
  })
  public isPrivate: boolean;

  @OneToMany((type) => ObservationEntity, (observation) => observation.herbarium, { eager: true })
  public observations?: Array<ObservationEntity>;

  @ManyToMany((type) => UserEntity, (user) => user.herbariums, { eager: true })
  public owners: Array<UserEntity>;
}
