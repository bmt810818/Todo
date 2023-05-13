import { UserService } from '@loopback/authentication';
import { UserProfile, securityId } from '@loopback/security';
import { Credentials, UserRepository, AccountRepository } from '../repositories';
import { User } from '../models';
import { repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { inject } from '@loopback/core';
import { BcryptHasher } from './hash.password.bcrypt';
import { PasswordHasherBindings } from '../keys';

export class MyUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
    @repository(AccountRepository)
    public accountRepository: AccountRepository,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const foundAccount = await this.accountRepository.findOne({
      where: {
        username: credentials.username
      },
    });
    if (!foundAccount) {
      throw new HttpErrors.NotFound(
        `user not found with this ${credentials.username}`,
      );
    }

console.log(`Found Account Details: ${JSON.stringify(foundAccount)}`);
console.log(`Credential password: ${credentials.password}`);
console.log(`FoundAccount password: ${foundAccount.password}`);

    const passwordMatched = await this.hasher.comparePassword(
      credentials.password,
      foundAccount.password,
    );
    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('password is not valid');
    }
    const foundUser = await this.userRepository.findOne({
        where: {
        id: foundAccount.userId}
    })

    return foundUser!;
  }
  convertToUserProfile(user: User): UserProfile {
    return { [securityId]: `${user.id}`, 
    id: user.id || 0, 
    name: user.name, 
    email: user.email, 
    address:user.address}
  }
}