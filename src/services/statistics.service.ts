import OrdersService from './orders.service';
import UsersService from './users.service';

class StatisticsService {
  private usersService = new UsersService();
  private ordersService = new OrdersService();
  public async getStatistics(from: number, to: number) {
    const users = await this.usersService.getSummaryUsers(from, to);
    const orders = await this.ordersService.getSummaryOrders(from, to);
    const revenues = await this.ordersService.getSummaryRevenues(from, to);
    return { users, orders, revenues };
  }
}

export default StatisticsService;
