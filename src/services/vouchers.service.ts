import { errorStatus } from '@/config';
import Voucher, { IVoucher } from '@/models/Voucher';
import { HttpException } from '@/exceptions/HttpException';

class VouchersService {
  private Voucher = Voucher;

  public async getAllVouchers({ skip, limit, filter, sort }: { skip?: number; limit?: number; filter?: string; sort?: string }) {
    const parseFilter = JSON.parse(filter ? filter : '{}');
    const parseSort = JSON.parse(sort ? sort : '{ "createdAt": "-1" }');
    const total = await this.Voucher.countDocuments(parseFilter).sort(parseSort);
    const vouchers = await this.Voucher.find(parseFilter, null, { limit, skip }).sort(parseSort);
    return { total, vouchers };
  }

  public async addVoucher(reqVoucher: IVoucher) {
    const { code, discountAmount, discountType, expiredDate } = reqVoucher;
    const isVoucherExisted = await this.Voucher.findOne({ code: code.toUpperCase() });
    if (isVoucherExisted) throw new HttpException(400, errorStatus.BAD_REQUEST);
    const voucher = new this.Voucher({ code: code.toUpperCase(), discountAmount, discountType, expiredDate });
    await voucher.save();
    return voucher;
  }

  public async deleteVoucher(voucherId: string) {
    return this.Voucher.findByIdAndDelete(voucherId);
  }

  public async updateVoucher(voucherId: string, voucher: IVoucher) {
    return await this.Voucher.findOneAndUpdate({ _id: voucherId }, voucher, { returnOriginal: false });
  }

  public async checkVoucherByCode(code: string) {
    const voucher = await this.Voucher.findOne({ code: code.toUpperCase() });
    if (!voucher) throw new HttpException(400, errorStatus.VOUCHER_NOT_FOUND);
    return voucher;
  }
}
export default VouchersService;
