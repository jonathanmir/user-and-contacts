import { CreateContactDto } from '../dto/create-contact.dto';
import { UpdateContactDto } from '../dto/update-contact.dto';
import { Contact } from '../entities/contact.entity';

export abstract class ContactsRepository {
  abstract create(data: CreateContactDto): Promise<Contact> | Contact;
  abstract findAll(): Promise<Contact[] | undefined> | Contact[];
  abstract findOne(id: string): Promise<Contact | undefined> | Contact;
  abstract findByUser(id: string): Promise<Contact[] | []> | Contact | [];
  abstract update(
    id: string,
    data: UpdateContactDto,
  ): Promise<Contact> | Contact;
  abstract remove(contactIds: string[]): Promise<void> | void;
}
