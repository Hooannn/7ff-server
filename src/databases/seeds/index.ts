// SHOULD RUN drop.ts script before running this
import Order from '../../models/Order';
import { faker } from '@faker-js/faker';
import { connect, disconnect } from 'mongoose';
import Product from '../../models/Product';
import Voucher from '../../models/Voucher';
import Category from '../../models/Category';
import User from '../../models/User';
import { dbConnection } from '..';
faker.setLocale('vi');
// USERS
export const execUserSeeds = (n = 100) => {
  const userSeeds = [];
  for (let i = 0; i <= n; i++) {
    const fakeUser = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      avatar: faker.image.avatar(),
      email: faker.internet.email(),
      address: faker.address.cityName(),
      password: faker.internet.password(),
      phoneNumber: faker.phone.number(),
      role: 'User',
      createdAt: faker.date.between(new Date('2023-01-01').getTime(), Date.now()),
    };
    userSeeds.push(fakeUser);
  }
  return User.insertMany(userSeeds);
};
// PRODUCTS
export const execProductSeeds = (n = 30) => {
  const productSeeds = [];
  for (let i = 0; i <= n; i++) {
    const fakeProduct = {
      name: {
        vi: faker.commerce.productName(),
        en: faker.commerce.productName(),
      },
      description: {
        vi: faker.commerce.productDescription(),
        en: faker.commerce.productDescription(),
      },
      price: faker.commerce.price(),
      stocks: 1000000,
      featuredImages: faker.helpers.arrayElements(new Array(10).fill(faker.image.food())),
    };
    productSeeds.push(fakeProduct);
  }
  return Product.insertMany(productSeeds);
};

// VOUCHERs
export const execVoucherSeeds = () => {
  return Voucher.insertMany([
    {
      code: 'SAVE50PERCENT',
      discountType: 'percent',
      discountAmount: 0.5,
      expiredDate: Date.now() * 2,
    },
    {
      code: 'SAVE500K',
      discountType: 'amount',
      discountAmount: 500000,
      expiredDate: Date.now() * 2,
    },
    {
      code: 'GETFUN10',
      discountType: 'percent',
      discountAmount: 0.1,
      expiredDate: Date.now() * 2,
    },
    {
      code: 'ADMIN100',
      discountType: 'percent',
      discountAmount: 1,
      expiredDate: Date.now() * 2,
    },
  ]);
};

// CATEGORIES
export const execCategorySeeds = (n = 10) => {
  const categorySeeds = [];
  for (let i = 0; i <= n; i++) {
    const fakeCategory = {
      name: {
        vi: faker.commerce.department(),
        en: faker.commerce.department(),
      },
      description: {
        vi: faker.commerce.productAdjective(),
        en: faker.commerce.productAdjective(),
      },
    };
    categorySeeds.push(fakeCategory);
  }
  return Category.insertMany(categorySeeds);
};

// ORDERS
export const execOrderSeeds = (n = 100) => {
  const orderSeeds = [];
  for (let i = 0; i <= n; i++) {
    const fakeOrder = {
      totalPrice: faker.commerce.price(50000, 2000000),
      status: 'Done',
      createdAt: faker.date.between(new Date('2023-01-01').getTime(), Date.now()),
    };
    orderSeeds.push(fakeOrder);
  }
  return Order.insertMany(orderSeeds);
};

connect(dbConnection.url, dbConnection.options as any, async () => {
  await execProductSeeds();
  await execCategorySeeds();
  await execVoucherSeeds();
  await execUserSeeds();
  await execOrderSeeds();
  disconnect();
});
