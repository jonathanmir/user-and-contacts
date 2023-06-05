import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private UsersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.UsersRepository.create(createUserDto);
    return user;
  }

  async findAll() {
    const users = await this.UsersRepository.findAll();
    return users;
  }

  async findOne(id: string) {
    const user = await this.UsersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }
  async findByEmail(email: string) {
    const user = await this.UsersRepository.findByEmail(email);
    return user;
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.UsersRepository.update(id, updateUserDto);
    return user;
  }

  async remove(id: string) {
    await this.UsersRepository.remove(id);
    return;
  }
}
