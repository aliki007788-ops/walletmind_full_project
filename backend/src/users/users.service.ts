import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async create(email: string, password_raw: string): Promise<User> {
    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(password_raw, salt);
    const user = this.usersRepository.create({ email, password_hash });
    return this.usersRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async setPlaidAccessToken(id: string, token: string) {
    await this.usersRepository.update(id, { plaid_access_token: token });
  }
}
