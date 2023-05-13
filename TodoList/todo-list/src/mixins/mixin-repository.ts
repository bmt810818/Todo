import {Constructor} from '@loopback/core';
import {DataObject, Entity, EntityCrudRepository, Options} from '@loopback/repository';

/*
 * This function adds a new method 'findByTitle' to a repository class
 * where 'M' is a model which extends Model
 *
 * @param superClass - Base class
 *
 * @typeParam M - Model class which extends Model
 * @typeParam R - Repository class
 */
export function TimeStampRepositoryMixin<
  E extends Entity & {createAt?: Date, updateAt?: Date},
  ID,
  R extends Constructor<EntityCrudRepository<E, ID>>
>(repository: R) {
  class MixedRepository extends repository {

    async create(dataObject: DataObject<E>, options?: Options): Promise<E> {
      dataObject.createAt = new Date()
      dataObject.updateAt = new Date()
      console.log('show');
      return super.create(dataObject, options)
    }

    async update(dataObject: DataObject<E>, options?: Options): Promise<void> {
      dataObject.createAt = new Date();
      dataObject.updateAt = new Date();
      await super.update(dataObject, options);
    }

    async delete(dataObject: DataObject<E>, options?: Options): Promise<void> {
      dataObject.createAt = new Date();
      dataObject.updateAt = new Date();
      await super.delete(dataObject, options);
    }

  }

  return MixedRepository;
}
