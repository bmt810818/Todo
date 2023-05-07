import {Entity, model, property} from '@loopback/repository';

@model()
export class WorkerWithTodolist extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  id?: number;

  @property({
    type: 'number',
  })
  todoListId?: number;

  @property({
    type: 'number',
  })
  workerId?: number;

  constructor(data?: Partial<WorkerWithTodolist>) {
    super(data);
  }
}

export interface WorkerWithTodolistRelations {
  // describe navigational properties here
}

export type WorkerWithTodolistWithRelations = WorkerWithTodolist & WorkerWithTodolistRelations;
