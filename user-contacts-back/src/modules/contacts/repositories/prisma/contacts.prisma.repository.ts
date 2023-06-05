import { Injectable, NotFoundException } from '@nestjs/common';
import { ContactsRepository } from '../contacts.repository';
import { PrismaService } from 'src/database/prisma.service';
import { CreateContactDto } from '../../dto/create-contact.dto';
import { Contact } from '../../entities/contact.entity';
import { plainToInstance } from 'class-transformer';
import { UpdateContactDto } from '../../dto/update-contact.dto';

@Injectable()
export class ContactsPrismaRepository implements ContactsRepository {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateContactDto): Promise<Contact> {
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });
    if (!user) {
      throw new NotFoundException(`Provided User doesn't exist.`);
    }
    const contact = new Contact();
    Object.assign(contact, { ...data });
    const newContact = await this.prisma.contact.create({
      data: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        user: { connect: { id: contact.userId } },
      },
    });
    return plainToInstance(Contact, newContact);
  }
  async findOne(id: string): Promise<Contact> {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    return plainToInstance(Contact, contact);
  }
  async findAll(): Promise<Contact[]> {
    const contacts = await this.prisma.contact.findMany();
    return plainToInstance(Contact, contacts);
  }
  async findByUser(userId: string): Promise<Contact[]> {
    const contacts = await this.prisma.contact.findMany({
      where: { userId },
    });
    return plainToInstance(Contact, contacts);
  }
  async update(id: string, data: UpdateContactDto): Promise<Contact> {
    const foundContact = await this.prisma.contact.findUnique({
      where: { id },
    });
    if (!foundContact) {
      throw new NotFoundException(`Contact not found.`);
    }
    const contact = new Contact();
    Object.assign(contact, { ...data });

    const updatedContact = await this.prisma.contact.update({
      where: { id },
      data: {
        email: contact.email,
        phone: contact.phone,
        name: contact.name,
      },
    });
    return plainToInstance(Contact, updatedContact);
  }
  async remove(contactIds: string[]): Promise<void> {
    const foundContacts = await this.prisma.contact.findMany({
      where: { id: { in: contactIds } },
    });
    const foundIds = foundContacts.map((e) => e.id);
    await this.prisma.contact.deleteMany({
      where: {
        id: {
          in: foundIds,
        },
      },
    });
  }
}
