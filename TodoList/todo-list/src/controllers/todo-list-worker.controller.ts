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
TodoList,
WorkerWithTodolist,
Worker,
} from '../models';
import {TodoListRepository} from '../repositories';

export class TodoListWorkerController {
  constructor(
    @repository(TodoListRepository) protected todoListRepository: TodoListRepository,
  ) { }

  @get('/todo-lists/{id}/workers', {
    responses: {
      '200': {
        description: 'Array of TodoList has many Worker through WorkerWithTodolist',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Worker)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Worker>,
  ): Promise<Worker[]> {
    return this.todoListRepository.workers(id).find(filter);
  }

  @post('/todo-lists/{id}/workers', {
    responses: {
      '200': {
        description: 'create a Worker model instance',
        content: {'application/json': {schema: getModelSchemaRef(Worker)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof TodoList.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Worker, {
            title: 'NewWorkerInTodoList',
            exclude: ['id'],
          }),
        },
      },
    }) worker: Omit<Worker, 'id'>,
  ): Promise<Worker> {
    return this.todoListRepository.workers(id).create(worker);
  }

  @patch('/todo-lists/{id}/workers', {
    responses: {
      '200': {
        description: 'TodoList.Worker PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Worker, {partial: true}),
        },
      },
    })
    worker: Partial<Worker>,
    @param.query.object('where', getWhereSchemaFor(Worker)) where?: Where<Worker>,
  ): Promise<Count> {
    return this.todoListRepository.workers(id).patch(worker, where);
  }

  @del('/todo-lists/{id}/workers', {
    responses: {
      '200': {
        description: 'TodoList.Worker DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Worker)) where?: Where<Worker>,
  ): Promise<Count> {
    return this.todoListRepository.workers(id).delete(where);
  }
}
