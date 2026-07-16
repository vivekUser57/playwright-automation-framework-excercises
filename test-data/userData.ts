import { faker } from "@faker-js/faker";

export const user = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: "Test@123",
    title: "Mr",
    day: "10",
    month: "5",
    year: "1995",
    newsletter: true,
    offers: true,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    address: faker.location.streetAddress(),
    country: "India",
    state: "Rajasthan",
    city: "Jaipur",
    zipcode: "302001",
    mobile: faker.phone.number()
};