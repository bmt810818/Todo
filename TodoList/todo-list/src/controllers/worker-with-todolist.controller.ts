import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {WorkerWithTodolist} from '../models';
import {WorkerWithTodolistRepository} from '../repositories';

export class WorkerWithTodolistController {
  constructor(
    @repository(WorkerWithTodolistRepository)
    public workerWithTodolistRepository : WorkerWithTodolistRepository,
  ) {}

  @post('/worker-with-todolists')
  @response(200, {
    description: 'WorkerWithTodolist model instance',
    content: {'application/json': {schema: getModelSchemaRef(WorkerWithTodolist)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WorkerWithTodolist, {
            title: 'NewWorkerWithTodolist',
            exclude: ['id'],
          }),
        },
      },
    })
    workerWithTodolist: Omit<WorkerWithTodolist, 'id'>,
  ): Promise<WorkerWithTodolist> {
    return this.workerWithTodolistRepository.create(workerWithTodolist);
  }

  @get('/worker-with-todolists/count')
  @response(200, {
    description: 'WorkerWithTodolist model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(WorkerWithTodolist) where?: Where<WorkerWithTodolist>,
  ): Promise<Count> {
    return this.workerWithTodolistRepository.count(where);
  }

  @get('/worker-with-todolists')
  @response(200, {
    description: 'Array of WorkerWithTodolist model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(WorkerWithTodolist, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(WorkerWithTodolist) filter?: Filter<WorkerWithTodolist>,
  ): Promise<WorkerWithTodolist[]> {
    return this.workerWithTodolistRepository.find(filter);
  }

  @patch('/worker-with-todolists')
  @response(200, {
    description: 'WorkerWithTodolist PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WorkerWithTodolist, {partial: true}),
        },
      },
    })
    workerWithTodolist: WorkerWithTodolist,
    @param.where(WorkerWithTodolist) where?: Where<WorkerWithTodolist>,
  ): Promise<Count> {
    return this.workerWithTodolistRepository.updateAll(workerWithTodolist, where);
  }

  @get('/worker-with-todolists/{id}')
  @response(200, {
    description: 'WorkerWithTodolist model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(WorkerWithTodolist, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(WorkerWithTodolist, {exclude: 'where'}) filter?: FilterExcludingWhere<WorkerWithTodolist>
  ): Promise<WorkerWithTodolist> {
    return this.workerWithTodolistRepository.findById(id, filter);
  }

  @patch('/worker-with-todolists/{id}')
  @response(204, {
    description: 'WorkerWithTodolist PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WorkerWithTodolist, {partial: true}),
        },
      },
    })
    workerWithTodolist: WorkerWithTodolist,
  ): Promise<void> {
    await this.workerWithTodolistRepository.updateById(id, workerWithTodolist);
  }

  @put('/worker-with-todolists/{id}')
  @response(204, {
    description: 'WorkerWithTodolist PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() workerWithTodolist: WorkerWithTodolist,
  ): Promise<void> {
    await this.workerWithTodolistRepository.replaceById(id, workerWithTodolist);
  }

  @del('/worker-with-todolists/{id}')
  @response(204, {
    description: 'WorkerWithTodolist DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.workerWithTodolistRepository.deleteById(id);
  }
}
