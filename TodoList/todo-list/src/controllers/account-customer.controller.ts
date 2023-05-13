import {repository,} from '@loopback/repository';
import {AccountRepository} from '../repositories';

export class AccountCustomerController {
  constructor(
    @repository(AccountRepository)
    public accountRepository: AccountRepository,
  ) {}

  
}
