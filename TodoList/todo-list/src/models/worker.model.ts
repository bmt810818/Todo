import {Entity, model, property, hasMany, hasOne} from '@loopback/repository';
import {TodoList} from './todo-list.model';
import {WorkerWithTodolist} from './worker-with-todolist.model';
import {User} from './user.model';

@model()
export class Worker extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  position: string;

  @property({
    type: 'date',
    required: true,
  })
  dateCreated: string;

  @hasMany(() => TodoList, {through: {model: () => WorkerWithTodolist}})
  todoLists: TodoList[];

  @hasOne(() => User)
  user: User;

  @hasOne(() => User)
  WorkerhasoneUser: User;

  constructor(data?: Partial<Worker>) {
    super(data);
  }
}
export interface WorkerRelations {
  // describe navigational properties here
}

export type WorkerWithRelations = Worker & WorkerRelations;
