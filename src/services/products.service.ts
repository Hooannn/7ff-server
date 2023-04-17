import Product, { IProduct } from '../models/Product';
import { Types, mongo } from 'mongoose';
class ProductsService {
  private Product = Product;
  public async getProductById(productId: string) {
    return await this.Product.findById(productId);
  }

  public async getProductsPrice(items: { productId: string | Types.ObjectId; quantity: number }[]) {
    const productIds = items.map(item => new mongo.ObjectId(item.productId));
    const failedProducts = [];
    let totalPrice = 0;
    const products = await this.Product.find({ _id: { $in: productIds } });
    for (let index = 0; index < products.length; index++) {
      const itemQuantity = items.find(item => item.productId.toString() === products[index]._id.toString()).quantity;
      if (itemQuantity <= products[index].stocks) {
        totalPrice += products[index].price * itemQuantity;
        await products[index].updateOne({ $inc: { stocks: -itemQuantity } });
        products[index].save();
      } else failedProducts.push(products[index]._id.toString());
    }
    return { totalPrice, failedProducts };
  }

  public async getAllProducts({ skip, limit, filter, sort }: { skip?: number; limit?: number; filter?: string; sort?: string }) {
    const parseFilter = JSON.parse(filter ? filter : '{}');
    const parseSort = JSON.parse(sort ? sort : '{ "createdAt": "-1" }');
    const total = await this.Product.countDocuments(parseFilter).sort(parseSort);
    const products = await this.Product.find(parseFilter, null, { limit, skip }).sort(parseSort);
    return { total, products };
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
}

export default ProductsService;
