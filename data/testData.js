import {faker} from '@faker-js/faker';
export const newUser1 = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    city: faker.location.city(),
    country:'Ukraine',
    phoneNumber:'+380' + faker.phone.number('#########'),
    streetAddress:faker.location.streetAddress(),
    zipCode:faker.location.zipCode(),
}

export const cardData = {
    cardNumber:process.env.CARD_NUMBER,
    cardDate:process.env.CARD_DATE,
    cardCvv:faker.finance.creditCardCVV(),
}
export const apiDataPost = {
        title: 'Hello World',
        body: 'Test body',
        UserId: 1,
}
export const apiDataPatch = {
        title: 'Hello AQA'
}