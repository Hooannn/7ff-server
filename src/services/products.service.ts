import Product, { IProduct } from '../models/Product';
import { Document, Types, mongo } from 'mongoose';
interface UpdateParams {
  product: Document<unknown, any, IProduct> &
    Omit<
      IProduct & {
        _id: Types.ObjectId;
      },
      never
    >;
  itemQuantity: number;
}
class ProductsService {
  private Product = Product;
  public async getProductById(productId: string) {
    return await this.Product.findById(productId).populate('category');
  }

  public async getProductsPrice(items: { product: string | Types.ObjectId; quantity: number }[]) {
    const productIds = items.map(item => new mongo.ObjectId(item.product));
    const failedProducts = [];
    let totalPrice = 0;
    const products = await this.Product.find({ _id: { $in: productIds } });
    for (let index = 0; index < products.length; index++) {
      const itemQuantity = items.find(item => item.product.toString() === products[index]._id.toString()).quantity;
      if (itemQuantity <= products[index].stocks) {
        totalPrice += products[index].price * itemQuantity;
        await Promise.all([
          await products[index].updateOne({ $inc: { stocks: -itemQuantity } }),
          await this.updateYearlySales({ product: products[index], itemQuantity }),
          await this.updateWeeklySales({ product: products[index], itemQuantity }),
          await this.updateMonthlySales({ product: products[index], itemQuantity }),
        ]);
        products[index].save();
      } else failedProducts.push(products[index]._id.toString());
    }
    return { totalPrice, failedProducts };
  }

  public async getAllProducts({ skip, limit, filter, sort }: { skip?: number; limit?: number; filter?: string; sort?: string }) {
    const parseFilter = JSON.parse(filter ? filter : '{}');
    const parseSort = JSON.parse(sort ? sort : '{ "createdAt": "-1" }');
    const total = await this.Product.countDocuments(parseFilter).sort(parseSort);
    const products = await this.Product.find(parseFilter, null, { limit, skip }).sort(parseSort).populate('category');
    return { total, products };
  }

  public async searchProducts({ q }: { q: string }) {
    const parseSearchTerm = JSON.parse(q);
    const products = await this.Product.find({
      $or: [
        {
          'name.vi': parseSearchTerm,
        },
        {
          'name.en': parseSearchTerm,
        },
      ],
    }).sort('{ "createdAt": "-1" }');
    return { products };
  }

  public async addProduct(reqProduct: IProduct) {
    const product = new this.Product(reqProduct);
    await product.save();
    return product;
  }

  public async deleteProduct(productId: string) {
    return this.Product.findByIdAndDelete(productId);
  }

  public async updateProduct(productId: string, product: IProduct) {
    return await this.Product.findOneAndUpdate({ _id: productId }, product, { returnOriginal: false });
  }

  private async updateYearlySales({ product, itemQuantity }: UpdateParams) {
    const year = new Date().getFullYear().toString();
    const yearlyDataIndex = product.yearlyData.findIndex(data => data.year === year);
    if (yearlyDataIndex !== -1) {
      await product.updateOne(
        { $inc: { 'yearlyData.$[elem].totalSales': product.price * itemQuantity, 'yearlyData.$[elem].totalUnits': itemQuantity } },
        { arrayFilters: [{ 'elem.year': year }] },
      );
    } else {
      await product.updateOne({
        $push: { yearlyData: { year, totalSales: product.price * itemQuantity, totalUnits: itemQuantity } },
      });
    }
  }

  private async updateMonthlySales({ product, itemQuantity }: UpdateParams) {
    const year = new Date().getFullYear().toString();
    const month = new Date().getMonth() + 1;
    const monthlyDataIndex = product.monthlyData.findIndex(data => data.year === year && data.month === month.toString());
    if (monthlyDataIndex !== -1) {
      await product.updateOne(
        { $inc: { 'monthlyData.$[elem1].totalSales': product.price * itemQuantity, 'monthlyData.$[elem2].totalUnits': itemQuantity } },
        { arrayFilters: [{ 'elem1.year': year }, { 'elem2.month': month }], upsert: true },
      );
    } else {
      await product.updateOne({
        $push: { monthlyData: { year, month, totalSales: product.price * itemQuantity, totalUnits: itemQuantity } },
      });
    }
  }

  private async updateWeeklySales({ product, itemQuantity }: UpdateParams) {
    const year = new Date().getFullYear().toString();
    const week = `${this.getWeekNumber(new Date())}`;
    const weeklyDataIndex = product.weeklyData.findIndex(data => data.year === year && data.week === week);
    if (weeklyDataIndex !== -1) {
      await product.updateOne(
        { $inc: { 'weeklyData.$[elem1].totalSales': product.price * itemQuantity, 'weeklyData.$[elem2].totalUnits': itemQuantity } },
        { arrayFilters: [{ 'elem1.week': week }, { 'elem2.year': year }], upsert: true },
      );
    } else {
      await product.updateOne({
        $push: { weeklyData: { year, week, totalSales: product.price * itemQuantity, totalUnits: itemQuantity } },
      });
    }
  }

  private getWeekNumber = (date: Date) => {
    const onejan = new Date(date.getFullYear(), 0, 1);
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayOfYear = ((today.getTime() - onejan.getTime() + 86400000) / 86400000) >> 0;
    return Math.ceil(dayOfYear / 7);
  };
}

export default ProductsService;
