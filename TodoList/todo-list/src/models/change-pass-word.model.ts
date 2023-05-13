import {Model, model, property} from '@loopback/repository';

@model()
export class ChangePassword {
  @property({
    type: 'string',
    required: true,
  })
  oldPassword: string;

  @property({
    type: 'string',
    required: true,
  })
  newPassword: string;
}

export interface ChangePassWordRelations {
  // describe navigational properties here
}

export type ChangePassWordWithRelations = ChangePassword & ChangePassWordRelations;
