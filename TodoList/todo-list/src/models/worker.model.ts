import {Entity, model, property, hasMany} from '@loopback/repository';
import {TodoList} from './todo-list.model';
import {WorkerWithTodolist} from './worker-with-todolist.model';

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

  constructor(data?: Partial<Worker>) {
    super(data);
  }
}

export interface WorkerRelations {
  // describe navigational properties here
}

export type WorkerWithRelations = Worker & WorkerRelations;
