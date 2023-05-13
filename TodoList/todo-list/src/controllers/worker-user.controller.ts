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
  User,
  Worker,
} from '../models';
import {WorkerRepository} from '../repositories';

export class WorkerUserController {
  constructor(
    @repository(WorkerRepository) protected workerRepository: WorkerRepository,
  ) { }

  @get('/workers/{id}/user', {
    responses: {
      '200': {
        description: 'Worker has one User',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {
              includeRelations: true,
            }),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<User>,

  ): Promise<User> {

    return this.workerRepository.WorkerhasoneUser(id).get(filter);
    // const worker = await this.workerRepository.find({
    //   include: ['WorkerhasoneUser'],
    // });
    // return this.workerRepository.find(filter);
  }

  @post('/workers/{id}/user', {
    responses: {
      '200': {
        description: 'Worker model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Worker.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUserInWorker',
            exclude: ['id'],
            optional: ['workerId']
          }),
        },
      },
    }) user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.workerRepository.WorkerhasoneUser(id).create(user);
  }

  @patch('/workers/{id}/user', {
    responses: {
      '200': {
        description: 'Worker.User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: Partial<User>,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.workerRepository.WorkerhasoneUser(id).patch(user, where);
  }

  @del('/workers/{id}/user', {
    responses: {
      '200': {
        description: 'Worker.User DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.workerRepository.WorkerhasoneUser(id).delete(where);
  }
}
