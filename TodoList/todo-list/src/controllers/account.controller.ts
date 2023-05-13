import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {UserRepository} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response
} from '@loopback/rest';
import {PasswordHasherBindings, TokenServiceBindings, UserServiceBindings} from '../keys';
import {Account, SignUpRequest, User} from '../models';
import {AccountRepository, Credentials} from '../repositories';
import {BcryptHasher} from '../services/hash.password.bcrypt';
import {JWTService} from '../services/jwt-service';
import {MyUserService} from '../services/UserService.service';
import {MyUserProfile} from '../type';


export class AccountController {
  constructor(
    @repository(AccountRepository)
    public accountRepository: AccountRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: BcryptHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject(UserServiceBindings.USER_SERVICE)
    public accountService: MyUserService,
  ) { }

  @post('/accounts/Signup')
  @response(200, {
    description: 'Account model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Account)
      }
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SignUpRequest, {
            title: 'NewAccount',
            exclude: ['userId', 'id'],
          }),
        },
      },
    })

    req: Omit<SignUpRequest, 'userId' | 'Id'>
  ): Promise<Account> {
    const {username, password, name, address, email} = req

    const newUser = new User({
      name,
      address,
      email,
    });
    const user = await this.userRepository.create({
      newUser
    });
    if (!user) {
      throw new HttpErrors[500]('Not create new user')
    }
    console.log(`Creating new user with: ${JSON.stringify(user)}`);
    const userId = Number(user.id)
    const account = new Account({
      username,
      password,
      userId
    })

    // Hash the password before creating the account
    const hashedPassword = await this.passwordHasher.hashPassword(
      password
    );
    account.password = hashedPassword;
    const newAccount = await this.accountRepository.create(account)
    const accountWithoutPassword = {...account, password: '******'};
    console.log(`Creating new account with: ${JSON.stringify(accountWithoutPassword)}`);

    return newAccount;
  }

  @get('/accounts/count')
  @response(200, {
    description: 'Account model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authenticate('jwt')
  async count(
    @param.where(Account) where?: Where<Account>,
  ): Promise<Count> {
    return this.accountRepository.count(where);
  }

  @get('/accounts')
  @response(200, {
    description: 'Array of Account model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Account, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Account) filter?: Filter<Account>,
  ): Promise<Account[]> {
    return this.accountRepository.find(filter);
  }

  @patch('/accounts')
  @response(200, {
    description: 'Account PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {partial: true}),
        },
      },
    })
    account: Account,
    @param.where(Account) where?: Where<Account>,
  ): Promise<Count> {
    return this.accountRepository.updateAll(account, where);
  }

  @get('/accounts/{id}')
  @response(200, {
    description: 'Account model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Account, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('username') username: string,
    @param.filter(Account, {exclude: 'where'}) filter?: FilterExcludingWhere<Account>
  ): Promise<Account> {
    return this.accountRepository.findById(username, filter);
  }

  @patch('/accounts/{id}')
  @response(204, {
    description: 'Account PATCH success',
  })
  async updateById(
    @param.path.number('username') username: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {
            partial: true
          }),
        },
      },
    })
    account: Account,
  ): Promise<void> {
    await this.accountRepository.updateById(username, account);
  }

  @put('/accounts/{id}')
  @response(204, {
    description: 'Account PUT success',
  })
  async replaceById(
    @param.path.number('username') username: string,
    @requestBody() account: Account,
  ): Promise<void> {
    await this.accountRepository.replaceById(username, account);
  }

  @del('/accounts/{id}')
  @response(204, {
    description: 'Account DELETE success',
  })
  async deleteById(@param.path.string('username') username: string): Promise<void> {
    await this.accountRepository.deleteById(username);
  }

  @post('/accounts/login')
  @response(200, {
    description: 'Login success',
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              username: {
                type: 'string'
              },
              password: {
                type: 'string'
              }
            }
          }

        },
      },
    }) credentials: Credentials
  ): Promise<{token: string}> {

    const account = await this.accountService.verifyCredentials(credentials);
    console.log(`Account logging: ${JSON.stringify(account)}`)
    const userProfile = this.accountService.convertToUserProfile(account);
    console.log(`User Profile: ${JSON.stringify(userProfile)}`)
    const token = await this.jwtService.generateToken(userProfile);
    return Promise.resolve({token});

  }


  @patch('/accounts/change-password')
  @authenticate('jwt')
  async changePassword(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: MyUserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              oldPassword: {type: 'string'},
              newPassword: {type: 'string'},
            },
            required: ['oldPassword', 'newPassword'],
          },
        },
      },
    })
    req: {
      oldPassword: string;
      newPassword: string;
    },
  ): Promise<void> {
    const {oldPassword, newPassword} = req;

    // 1. Find the account by ID
    const account = await this.accountRepository.findOne({where: {userId: currentUser.id}});
    if (!account) {
      throw new Error('Account not found');
    }
    console.log(`currentAccount: ${JSON.stringify(account)}`)

    // 2. Validate the old password
    if (await this.passwordHasher.comparePassword(oldPassword, account.password)) {
      // 3. Hash the new password
      const hashedPassword = await this.passwordHasher.hashPassword(newPassword);
      console.log(`passwordMatched: ${JSON.stringify(hashedPassword)}`);
      // 4. Update the account with the new password
      account.password = hashedPassword;
      await this.accountRepository.updateById(account.username, account);

    } else throw new HttpErrors.Unauthorized('Old password is wrong');

  }
}
