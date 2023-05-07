import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Worker, WorkerRelations, TodoList, WorkerWithTodolist} from '../models';
import {WorkerWithTodolistRepository} from './worker-with-todolist.repository';
import {TodoListRepository} from './todo-list.repository';

export class WorkerRepository extends DefaultCrudRepository<
  Worker,
  typeof Worker.prototype.id,
  WorkerRelations
> {

  public readonly todoLists: HasManyThroughRepositoryFactory<TodoList, typeof TodoList.prototype.id,
          WorkerWithTodolist,
          typeof Worker.prototype.id
        >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('WorkerWithTodolistRepository') protected workerWithTodolistRepositoryGetter: Getter<WorkerWithTodolistRepository>, @repository.getter('TodoListRepository') protected todoListRepositoryGetter: Getter<TodoListRepository>,
  ) {
    super(Worker, dataSource);
    this.todoLists = this.createHasManyThroughRepositoryFactoryFor('todoLists', todoListRepositoryGetter, workerWithTodolistRepositoryGetter,);
    this.registerInclusionResolver('todoLists', this.todoLists.inclusionResolver);
  }
}
