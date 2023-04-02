import Order, { IOrder } from '@/models/Order';
class OrdersService {
  private Order = Order;

  public async getAllOrders({ skip, limit, filter, sort }: { skip?: number; limit?: number; filter?: string; sort?: string }) {
    const parseFilter = JSON.parse(filter ? filter : '{}');
    const parseSort = JSON.parse(sort ? sort : '{ "createdAt": "-1" }');
    const total = await this.Order.countDocuments(parseFilter).sort(parseSort);
    const orders = await this.Order.find(parseFilter, null, { limit, skip }).sort(parseSort);
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
}

export default OrdersService;
