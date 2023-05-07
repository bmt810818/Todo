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
import {Worker} from '../models';
import {WorkerRepository} from '../repositories';

export class WorkerController {
  constructor(
    @repository(WorkerRepository)
    public workerRepository : WorkerRepository,
  ) {}

  @post('/workers')
  @response(200, {
    description: 'Worker model instance',
    content: {'application/json': {schema: getModelSchemaRef(Worker)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Worker, {
            title: 'NewWorker',
            exclude: ['id'],
          }),
        },
      },
    })
    worker: Omit<Worker, 'id'>,
  ): Promise<Worker> {
    return this.workerRepository.create(worker);
  }

  @get('/workers/count')
  @response(200, {
    description: 'Worker model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Worker) where?: Where<Worker>,
  ): Promise<Count> {
    return this.workerRepository.count(where);
  }

  @get('/workers')
  @response(200, {
    description: 'Array of Worker model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Worker, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Worker) filter?: Filter<Worker>,
  ): Promise<Worker[]> {
    return this.workerRepository.find(filter);
  }

  @patch('/workers')
  @response(200, {
    description: 'Worker PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Worker, {partial: true}),
        },
      },
    })
    worker: Worker,
    @param.where(Worker) where?: Where<Worker>,
  ): Promise<Count> {
    return this.workerRepository.updateAll(worker, where);
  }

  @get('/workers/{id}')
  @response(200, {
    description: 'Worker model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Worker, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Worker, {exclude: 'where'}) filter?: FilterExcludingWhere<Worker>
  ): Promise<Worker> {
    return this.workerRepository.findById(id, filter);
  }

  @patch('/workers/{id}')
  @response(204, {
    description: 'Worker PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Worker, {partial: true}),
        },
      },
    })
    worker: Worker,
  ): Promise<void> {
    await this.workerRepository.updateById(id, worker);
  }

  @put('/workers/{id}')
  @response(204, {
    description: 'Worker PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() worker: Worker,
  ): Promise<void> {
    await this.workerRepository.replaceById(id, worker);
  }

  @del('/workers/{id}')
  @response(204, {
    description: 'Worker DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.workerRepository.deleteById(id);
  }
}
