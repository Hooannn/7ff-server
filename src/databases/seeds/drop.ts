import { connect, connection, disconnect } from 'mongoose';
import { dbConnection } from '..';

connect(dbConnection.url, dbConnection.options as any, () => {
  connection.db.dropCollection('products');
  connection.db.dropCollection('vouchers');
  connection.db.dropCollection('categories');
  connection.db.dropCollection('orders');
  disconnect();
});
