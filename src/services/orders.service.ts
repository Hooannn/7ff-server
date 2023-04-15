/* eslint-disable @typescript-eslint/no-unused-vars */
import Order, { IOrder } from '@/models/Order';
import dayjs from 'dayjs';
import { Document, Types } from 'mongoose';

interface CreateChartParams {
  orders: (Document<unknown, any, IOrder> &
    Omit<
      IOrder & {
        _id: Types.ObjectId;
      },
      never
    >)[];
  to: number;
  from: number;
}

interface ChartData {
  date: string;
  name: string;
  value: number;
}
class OrdersService {
  private Order = Order;

  public async getAllOrders({ skip, limit, filter, sort }: { skip?: number; limit?: number; filter?: string; sort?: string }) {
    const parseFilter = JSON.parse(filter ? filter : '{}');
    const parseSort = JSON.parse(sort ? sort : '{ "createdAt": "-1" }');
    const total = await this.Order.countDocuments(parseFilter).sort(parseSort);
    const orders = await this.Order.find(parseFilter, null, { limit, skip }).sort(parseSort).populate('items.productId voucher');
    return { total, orders };
  }

  public async createOrder(order: Partial<IOrder>) {
    const newOrder = new this.Order(order);
    await newOrder.save();
    return newOrder;
  }

  public async deleteOrder(orderId: string) {
    return this.Order.findByIdAndDelete(orderId);
  }

  public async updateOrder(orderId: string, order: IOrder) {
    return await this.Order.findOneAndUpdate({ _id: orderId }, order, { returnOriginal: false });
  }

  public async getSummaryOrders(from: number, to: number) {
    const range = to - from;
    const currentCount = await this.Order.countDocuments({
      createdAt: { $gte: from, $lte: to },
    });
    const previousCount = await this.Order.countDocuments({
      createdAt: { $gte: from - range, $lte: from },
    });
    return { currentCount, previousCount };
  }

  public async getSummaryRevenues(from: number, to: number) {
    const DAY_TS = 86400000;
    const WEEK_TS = 604800000;
    const MONTH_TS = 2629743000;
    const YEAR_TS = 31556926000;
    const range = to - from;
    const currentOrders = await this.Order.find({
      createdAt: { $gte: from, $lte: to },
      status: 'Done',
    });
    const previousOrders = await this.Order.find({
      createdAt: { $gte: from - range, $lte: from },
      status: 'Done',
    });
    const currentCount = currentOrders.reduce((partialSum, order) => partialSum + order.totalPrice, 0);
    const previousCount = previousOrders.reduce((partialSum, order) => partialSum + order.totalPrice, 0);
    const createChartHandlers = [
      {
        condition: DAY_TS,
        execute: this.createDailyRevenuesChart,
      },
      {
        condition: WEEK_TS,
        execute: this.createWeeklyRevenuesChart,
      },
      {
        condition: MONTH_TS,
        execute: this.createMonthlyRevenuesChart,
      },
      {
        condition: YEAR_TS,
        execute: this.createYearlyRevenuesChart,
      },
    ];

    const createChartHandler = createChartHandlers.find(handler => range <= handler.condition);
    const details = await createChartHandler.execute({ orders: currentOrders, to, from });
    return { currentCount, previousCount, details };
  }

  private async createDailyRevenuesChart({ orders, to, from }: CreateChartParams) {
    const startDate = dayjs(from).startOf('day');
    const results: ChartData[] = Array.from(Array(24), (_, i) => ({
      date: startDate.add(i, 'hour').toISOString(),
      name: startDate.add(i, 'hour').format('hh:mm'),
      value: 0,
    }));
    orders.forEach(({ totalPrice, createdAt }: any) => {
      const index = results.findIndex(result => dayjs(createdAt).isSame(dayjs(result.date), 'hour'));
      results[index].value = results[index].value + totalPrice;
    });
    return results;
  }

  private async createWeeklyRevenuesChart({ orders, to, from }: CreateChartParams) {
    const startDate = dayjs(from).startOf('day');
    const results: ChartData[] = Array.from(Array(7), (_, i) => ({
      date: startDate.add(i, 'day').toISOString(),
      name: startDate.add(i, 'day').format('dddd DD-MM'),
      value: 0,
    }));
    orders.forEach(({ totalPrice, createdAt }: any) => {
      const index = results.findIndex(result => dayjs(createdAt).isSame(dayjs(result.date), 'day'));
      results[index].value = results[index].value + totalPrice;
    });
    return results;
  }

  private async createMonthlyRevenuesChart({ orders, to, from }: CreateChartParams) {
    const startDate = dayjs(from).startOf('day');
    const results: ChartData[] = Array.from(Array(startDate.daysInMonth()), (_, i) => ({
      date: startDate.add(i, 'day').toISOString(),
      name: startDate.add(i, 'day').format('dddd DD-MM'),
      value: 0,
    }));
    orders.forEach(({ totalPrice, createdAt }: any) => {
      const index = results.findIndex(result => dayjs(createdAt).isSame(dayjs(result.date), 'day'));
      results[index].value = results[index].value + totalPrice;
    });
    return results;
  }

  private async createYearlyRevenuesChart({ orders, to, from }: CreateChartParams) {
    const startDate = dayjs(from).startOf('day');
    const results: ChartData[] = Array.from(Array(12), (_, i) => ({
      date: startDate.add(i, 'month').toISOString(),
      name: startDate.add(i, 'month').format('MMMM'),
      value: 0,
    }));
    orders.forEach(({ totalPrice, createdAt }: any) => {
      const index = results.findIndex(result => dayjs(createdAt).isSame(dayjs(result.date), 'month'));
      results[index].value = results[index].value + totalPrice;
    });
    return results;
  }
}

export default OrdersService;
