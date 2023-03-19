import { errorStatus, SALTED_PASSWORD } from '@/config';
import { HttpException } from '@/exceptions/HttpException';
import User, { IUser } from '@/models/User';
import { hashSync } from 'bcrypt';

class UsersService {
  private User = User;

  public async getAllUsers({ skip, limit }: { skip?: number; limit?: number }) {
    return await this.User.find(null, null, { limit, skip });
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
}

export default UsersService;
