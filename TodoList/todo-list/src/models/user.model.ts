import {Entity, hasOne, model, property} from '@loopback/repository';
import {Mixin} from '../mixins/mixin';
import {Account} from './account.model';

@model()
export class User extends Mixin(Entity) {

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
  })
  address: string;

  @hasOne(() => Account)
  account: Account;

  @property({
    type: 'number',
  })
  workerId?: number;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;

export class PhoneUser extends User {

  @property({
    type: 'string',
    required: true,
  })
  phoneNumber: string;


}

