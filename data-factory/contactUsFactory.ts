import { faker } from '@faker-js/faker';
import { ContactUsDetails } from '../types/ContactUsDetails';

export class ContactUsFactory {
  static create(): ContactUsDetails {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      subject: faker.lorem.words(4),
      message: faker.lorem.paragraphs(2),
    };
  }
}