import { connect, disconnect } from 'mongoose';
import Product from '../../models/Product';
import Voucher from '../../models/Voucher';
import Category from '../../models/Category';
import { dbConnection } from '..';
// PRODUCTS
export const execProductSeeds = () => {
  return Product.insertMany([
    {
      name: 'Product 1',
      description: 'Product 1 description',
      price: 100,
      stocks: 10,
    },
    {
      name: 'Product 2',
      description: 'Product 2 description',
      price: 2000,
      stocks: 10,
    },
    {
      name: 'Product 3',
      description: 'Product 3 description',
      price: 30000,
      stocks: 10,
    },
    {
      name: 'Product 4',
      description: 'Product 4 description',
      price: 400,
      stocks: 10,
    },
  ]);
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
export const execCategorySeeds = () => {
  return Category.insertMany([
    {
      name: 'Category 1',
      description: 'Category 1',
    },
    {
      name: 'Category 2',
      description: 'Category 2',
    },
    {
      name: 'Category 3',
      description: 'Category 3',
    },
    {
      name: 'Category 4',
      description: 'Category 4',
    },
  ]);
};

connect(dbConnection.url, dbConnection.options as any, async () => {
  await execProductSeeds();
  await execCategorySeeds();
  await execVoucherSeeds();
  disconnect();
});
