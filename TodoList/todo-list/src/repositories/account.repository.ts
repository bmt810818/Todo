import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Account, AccountRelations, User} from '../models';
import {UserRepository} from './user.repository';

export type Credentials = {
  userId: number,
  username: string,
  password: string
}
export class AccountRepository extends DefaultCrudRepository<
  Account,
  typeof Account.prototype.username,
  AccountRelations
> {

  public readonly user: BelongsToAccessor<
    User,
    typeof Account.prototype.username
  >;

  constructor(
    @inject('datasources.db')
    dataSource: DbDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Account, dataSource);
    this.user = this.createBelongsToAccessorFor(
      'user',
      userRepositoryGetter,
    );
    this.registerInclusionResolver(
      'user',
      this.user.inclusionResolver
    );
  }
}
