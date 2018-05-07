import * as bcrypt from 'bcrypt';
import { inject } from 'inversify';

import { IUserRepository, User } from '../domain';
import { Provide, TYPES } from '../ioc';

const SALT_ROUNDS = 10;

export interface IAuthService {
  registerUser(username: string, password: string, repeatedPassword: string): Promise<User>;
  loginUser(username: string, password: string): Promise<User>;
}

@Provide(TYPES.AuthService)
export class AuthService implements IAuthService {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) { }

  public async registerUser(username: string, password: string, repeatedPassword: string): Promise<User> {
    if (password !== repeatedPassword) {
      throw new Error('Lozinke se ne poklapaju');
    }

    const user = await this.userRepository.getByUsername(username);
    if (user) {
      throw new Error('Već postoji korisnik s danim korisničkim imenom');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    return await this.userRepository.insert({
      firstName: 'John',
      lastName: 'Doe',
      passwordHash,
      username,
    });

  }

  public async loginUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.getByUsername(username);
    if (!user) {
      throw new Error('Ne postoji korisnik s danim korisničkim imenom');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (isValid) {
      return user;
    }

    throw new Error('Neispravno korisničko ime ili lozinka');
  }
}
