import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository, 
  repository, 
  HasManyRepositoryFactory, 
  HasOneRepositoryFactory, 
  HasManyThroughRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {
  TodoList, 
  TodoListRelations, 
  Todo, 
  TodoListImage, 
  Worker, 
  WorkerWithTodolist} from '../models';
import {TodoRepository} from './todo.repository';
import {TodoListImageRepository} from './todo-list-image.repository';
import {WorkerWithTodolistRepository} from './worker-with-todolist.repository';
import {WorkerRepository} from './worker.repository';

export class TodoListRepository extends DefaultCrudRepository<
  TodoList,
  typeof TodoList.prototype.id,
  TodoListRelations
> {

  public readonly todos: HasManyRepositoryFactory<
    Todo, 
    typeof TodoList.prototype.id
  >;

  public readonly todoListImage: HasOneRepositoryFactory<
    TodoListImage, 
    typeof TodoList.prototype.id
  >;

  public readonly workers: HasManyThroughRepositoryFactory<
    Worker, typeof Worker.prototype.id,
    WorkerWithTodolist,
    typeof TodoList.prototype.id
  >;

  public findByTitle(title: string) {
    return this.findOne({where: {title}});
  }

  constructor(
    @inject('datasources.db') 
    dataSource: DbDataSource, 
    @repository.getter('TodoRepository') 
    protected todoRepositoryGetter: Getter<TodoRepository>, 
    @repository.getter('TodoListImageRepository') 
    protected todoListImageRepositoryGetter: Getter<TodoListImageRepository>, 
    @repository.getter('WorkerWithTodolistRepository') 
    protected workerWithTodolistRepositoryGetter: Getter<WorkerWithTodolistRepository>, 
    @repository.getter('WorkerRepository') 
    protected workerRepositoryGetter: Getter<WorkerRepository>,
  ) {
    super(TodoList, dataSource);
    this.workers = this.createHasManyThroughRepositoryFactoryFor(
      'workers', 
      workerRepositoryGetter, 
      workerWithTodolistRepositoryGetter,
    );
    this.registerInclusionResolver(
      'workers', 
      this.workers.inclusionResolver
    );
    this.todoListImage = this.createHasOneRepositoryFactoryFor(
      'todoListImage', 
      todoListImageRepositoryGetter
    );
    this.registerInclusionResolver(
      'todoListImage', 
      this.todoListImage.inclusionResolver
    );
    this.todos = this.createHasManyRepositoryFactoryFor(
      'todos', 
      todoRepositoryGetter,
    );
    this.registerInclusionResolver(
      'todos', 
      this.todos.inclusionResolver
    );
  }
}
