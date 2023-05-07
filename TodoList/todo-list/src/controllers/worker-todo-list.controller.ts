import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
  import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
Worker,
WorkerWithTodolist,
TodoList,
} from '../models';
import {WorkerRepository} from '../repositories';

export class WorkerTodoListController {
  constructor(
    @repository(WorkerRepository) protected workerRepository: WorkerRepository,
  ) { }

  @get('/workers/{id}/todo-lists', {
    responses: {
      '200': {
        description: 'Array of Worker has many TodoList through WorkerWithTodolist',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TodoList)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<TodoList>,
  ): Promise<TodoList[]> {
    return this.workerRepository.todoLists(id).find(filter);
  }

  @post('/workers/{id}/todo-lists', {
    responses: {
      '200': {
        description: 'create a TodoList model instance',
        content: {'application/json': {schema: getModelSchemaRef(TodoList)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Worker.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TodoList, {
            title: 'NewTodoListInWorker',
            exclude: ['id'],
          }),
        },
      },
    }) todoList: Omit<TodoList, 'id'>,
  ): Promise<TodoList> {
    return this.workerRepository.todoLists(id).create(todoList);
  }

  @patch('/workers/{id}/todo-lists', {
    responses: {
      '200': {
        description: 'Worker.TodoList PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TodoList, {partial: true}),
        },
      },
    })
    todoList: Partial<TodoList>,
    @param.query.object('where', getWhereSchemaFor(TodoList)) where?: Where<TodoList>,
  ): Promise<Count> {
    return this.workerRepository.todoLists(id).patch(todoList, where);
  }

  @del('/workers/{id}/todo-lists', {
    responses: {
      '200': {
        description: 'Worker.TodoList DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(TodoList)) where?: Where<TodoList>,
  ): Promise<Count> {
    return this.workerRepository.todoLists(id).delete(where);
  }
}
