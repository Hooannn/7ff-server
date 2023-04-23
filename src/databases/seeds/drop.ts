import { connect, connection, disconnect } from 'mongoose';
import { dbConnection } from '..';
import User from '../../models/User';

export const deleteSeedUsers = () => {
  return User.deleteMany({ role: 'User' });
};

connect(dbConnection.url, dbConnection.options as any, async () => {
  connection.db.dropCollection('products');
  connection.db.dropCollection('vouchers');
  connection.db.dropCollection('categories');
  connection.db.dropCollection('orders');
  await deleteSeedUsers();
  disconnect();
});
