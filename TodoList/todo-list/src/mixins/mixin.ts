import {MixinTarget} from '@loopback/core';
import {property} from '@loopback/repository';

/**
 * A mixin factory to add `category` property
 *
 * @param superClass - Base Class
 * @typeParam T - Model class
 */
export function Mixin<T extends MixinTarget<object>>(
  superClass: T,
) {
  class MixedModel extends superClass {
    @property({
      type: 'date',
      defaultFn: 'now',
    })
    createAt?: Date;

    @property({
      type: 'date',
      defaultFn: 'now',
    })
    updateAt?: Date;
  }
  return MixedModel;
}
