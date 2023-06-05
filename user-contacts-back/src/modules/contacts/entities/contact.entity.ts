import { Exclude } from 'class-transformer';
import { randomUUID } from 'node:crypto';

export class Contact {
  readonly id: string;
  name: string;
  phone: string;
  email: string;
  created_at: Date;
  @Exclude()
  userId: string;
  constructor() {
    this.id = randomUUID();
  }
}
