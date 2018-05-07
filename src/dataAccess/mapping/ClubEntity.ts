import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Club } from '../../domain';
import { UserEntity } from './UserEntity';

@Entity('Club')
export class ClubEntity extends Club {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
      length: 50,
    })
    public name: string;

    @Column({
      length: 50,
      nullable: true,
    })
    public address: string;

    @OneToMany((type) => UserEntity, (user) => user.club)
    public member: UserEntity;
}
