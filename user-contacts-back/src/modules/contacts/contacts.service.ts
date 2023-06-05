import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactsRepository } from './repositories/contacts.repository';
import { plainToInstance } from 'class-transformer';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  constructor(private ContactsRepository: ContactsRepository) {}
  async create(createContactDto: CreateContactDto) {
    const contact = await this.ContactsRepository.create(createContactDto);
    return contact;
  }

  async findAll() {
    const contacts = await this.ContactsRepository.findAll();
    return contacts;
  }

  async findOne(id: string) {
    const contact = await this.ContactsRepository.findOne(id);
    if (!contact) {
      throw new NotFoundException('Contact not found.');
    }
    return contact;
  }
  async findByUser(userId: string) {
    const contacts = await this.ContactsRepository.findByUser(userId);
    return contacts;
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    const contact = await this.ContactsRepository.update(id, updateContactDto);
    return contact;
  }

  async remove(contactIds: string[]) {
    const deleted = await this.ContactsRepository.remove(contactIds);
    return;
  }
}
