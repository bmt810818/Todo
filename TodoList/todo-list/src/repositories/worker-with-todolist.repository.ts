import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {WorkerWithTodolist, WorkerWithTodolistRelations} from '../models';

export class WorkerWithTodolistRepository extends DefaultCrudRepository<
  WorkerWithTodolist,
  typeof WorkerWithTodolist.prototype.id,
  WorkerWithTodolistRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(WorkerWithTodolist, dataSource);
  }
}
