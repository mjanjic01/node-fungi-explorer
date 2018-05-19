import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../domain';

import { ClubEntity } from './ClubEntity';
import { HerbariumEntity } from './HerbariumEntity';
import { LocationEntity } from './LocationEntity';

@Entity('User')
export class UserEntity extends User {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
      length: 50,
    })
    public firstName: string;

    @Column({
      length: 50,
    })
    public lastName: string;

    @Column({
      length: 20,
    })
    public username: string;

    @Column({
      length: 128,
    })
    public passwordHash: string;

    @ManyToOne((type) => ClubEntity, (club) => club.member, {
      onDelete: 'SET NULL',
    })
    @JoinColumn()
    public club: ClubEntity;

    @ManyToMany((type) => HerbariumEntity, (herbarium) => herbarium.owners)
    @JoinTable({
      name: 'UserHerbarium',
    })
    public herbariums: Array<HerbariumEntity>;
}
