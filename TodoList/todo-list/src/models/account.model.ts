import {Entity, belongsTo, model, property} from '@loopback/repository';
import {User} from './user.model';
@model()

export class Account extends Entity {

  @property({
    type: 'string',
    required: true,
    id: true,
  })
  username: string;

  @property({
    type: 'string',
    length: 11,
    required: true,
  })
  password: string;

  @belongsTo(() => User)
  userId: number;

  constructor(data?: Partial<Account>) {
    super(data);
  }
}

export interface AccountRelations {
  // describe navigational properties here
}

export type AccountWithRelations = Account & AccountRelations;

@model()
export class SignUpRequest extends Account {

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number

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
    required: true,
  })
  address: string;
}
