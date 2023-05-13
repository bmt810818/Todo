import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyThroughRepositoryFactory,
  repository, HasOneRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {
  TodoList,
  Worker,
  WorkerRelations,
  WorkerWithTodolist, User} from '../models';
import {TodoListRepository} from './todo-list.repository';
import {UserRepository} from './user.repository';
import {WorkerWithTodolistRepository} from './worker-with-todolist.repository';

export class WorkerRepository extends DefaultCrudRepository<
  Worker,
  typeof Worker.prototype.id,
  WorkerRelations
> {

  public readonly todoLists: HasManyThroughRepositoryFactory<
    TodoList,
    typeof TodoList.prototype.id,
    WorkerWithTodolist,
    typeof Worker.prototype.id
  >;

  public readonly WorkerhasoneUser: HasOneRepositoryFactory<User, typeof Worker.prototype.id>;

  constructor(
    @inject('datasources.db')
    dataSource: DbDataSource,
    @repository.getter('WorkerWithTodolistRepository')
    protected workerWithTodolistRepositoryGetter: Getter<WorkerWithTodolistRepository>,
    @repository.getter('TodoListRepository')
    protected todoListRepositoryGetter: Getter<TodoListRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Worker, dataSource);
    this.WorkerhasoneUser = this.createHasOneRepositoryFactoryFor('WorkerhasoneUser', userRepositoryGetter);
    this.registerInclusionResolver('WorkerhasoneUser', this.WorkerhasoneUser.inclusionResolver);
    this.todoLists = this.createHasManyThroughRepositoryFactoryFor(
      'todoLists',
      todoListRepositoryGetter,
      workerWithTodolistRepositoryGetter,
    );
    this.registerInclusionResolver(
      'todoLists',
      this.todoLists.inclusionResolver
    );
  }
}
