// import { NotFoundError } from 'rxjs';
// import { CreateUserDto } from '../../dto/create-user.dto';
// import { UpdateUserDto } from '../../dto/update-user.dto';
// import { User } from '../../entities/user.entity';
// import { UsersRepository } from '../users.repository';

// export class UsersInMemoryRepository implements UsersRepository {
//   private database: User[] = [];
//   create(data: CreateUserDto): User | Promise<User> {
//     const newUser = new User();
//     Object.assign(newUser, {
//       ...data,
//     });
//     this.database.push(newUser);
//     return newUser;
//   }

//   findAll(): User[] | Promise<User[]> {
//     return this.database;
//   }
//   findOne(id: string): User | Promise<User> {
//     const user = this.database.find((user) => user.id == id);
//     return user;
//   }
//   update(id: string, data: UpdateUserDto): User | Promise<User> {
//     const userIndex = this.database.findIndex((user) => user.id == id);
//     this.database[userIndex] = {
//       ...this.database[userIndex],
//       ...data,
//     };
//     return this.database[userIndex];
//   }
//   remove(id: string): void | Promise<void> {
//     const userIndex = this.database.findIndex((user) => user.id == id);
//     this.database.splice(userIndex, 1);
//   }
// }
