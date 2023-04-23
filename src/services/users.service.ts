import { errorStatus, SALTED_PASSWORD } from '@/config';
import { HttpException } from '@/exceptions/HttpException';
import User, { IUser } from '@/models/User';
import { compareSync, hashSync } from 'bcrypt';
class UsersService {
  private User = User;

  public async getAllUsers({ skip, limit, filter, sort }: { skip?: number; limit?: number; filter?: string; sort?: string }) {
    const parseFilter = JSON.parse(filter ? filter : '{}');
    const parseSort = JSON.parse(sort ? sort : '{ "createdAt": "-1" }');
    const total = await this.User.countDocuments(parseFilter).sort(parseSort);
    const users = await this.User.find(parseFilter, null, { limit, skip }).sort(parseSort).select('-password');
    return { total, users };
  }

  public async getUserById(id: string) {
    return await this.User.findById(id);
  }

  public async addUser(reqUser: IUser) {
    const { firstName, lastName, avatar, password, phoneNumber, role, email, address } = reqUser;
    const isEmailExisted = await this.User.findOne({ email });
    if (isEmailExisted) throw new HttpException(409, errorStatus.EMAIL_EXISTED);
    const hashedPassword = hashSync(password, parseInt(SALTED_PASSWORD));
    const user = new this.User({ email, password: hashedPassword, role, firstName, lastName, avatar, phoneNumber, address });
    await user.save();
    return user;
  }

  public async deleteUser(userId: string) {
    return this.User.findByIdAndDelete(userId);
  }

  public async updateUser(userId: string, user: IUser) {
    let hashedPassword = null;
    const { resetPassword, lastName, firstName, phoneNumber, address, avatar, role } = user as any;
    if (resetPassword) {
      hashedPassword = hashSync(resetPassword, parseInt(SALTED_PASSWORD));
    }
    const updatedUser = hashedPassword
      ? { password: hashedPassword, lastName, firstName, phoneNumber, address, avatar, role }
      : { lastName, firstName, phoneNumber, address, avatar, role };
    return await this.User.findOneAndUpdate({ _id: userId }, updatedUser, { returnOriginal: false });
  }

  public async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const target = await this.getUserById(userId);
    const isPasswordMatched = compareSync(currentPassword, target.password.toString());
    if (!isPasswordMatched) throw new HttpException(400, errorStatus.WRONG_PASSWORD);
    const hashedPassword = hashSync(newPassword, parseInt(SALTED_PASSWORD));
    return await this.User.findOneAndUpdate({ _id: userId }, { password: hashedPassword }, { returnOriginal: false });
  }

  public async getSummaryUsers(from: number, to: number) {
    const range = to - from;
    const currentCount = await this.User.countDocuments({
      createdAt: { $gte: from, $lte: to },
    });
    const previousCount = await this.User.countDocuments({
      createdAt: { $gte: from - range, $lte: from },
    });
    return { currentCount, previousCount };
  }

  public async getCartItems(userId: string) {
    const { cartItems } = await this.User.findById(userId).select('cartItems').populate('cartItems.product');
    return cartItems;
  }

  public async addCartItem({ userId, product, quantity }: { userId: string; product: string; quantity: number }) {
    const { modifiedCount } = await User.updateOne(
      { _id: userId, 'cartItems.product': product },
      { $inc: { 'cartItems.$[item].quantity': quantity } },
      { arrayFilters: [{ 'item.product': product }] },
    );

    if (modifiedCount === 0) {
      await User.updateOne({ _id: userId }, { $addToSet: { cartItems: { product, quantity } } });
    }
  }

  public async removeCartItem({ userId, product, quantity }: { userId: string; product: string; quantity: number }) {
    await User.updateOne({ _id: userId }, { $inc: { 'cartItems.$[item].quantity': -quantity } }, { arrayFilters: [{ 'item.product': product }] });
    await User.updateOne({ _id: userId, 'cartItems.quantity': { $lte: 0 } }, { $pull: { cartItems: { quantity: { $lte: 0 } } } });
  }

  public async resetCartItems(userId: string) {
    return await this.User.findByIdAndUpdate(userId, { cartItems: [] });
  }
}

export default UsersService;
