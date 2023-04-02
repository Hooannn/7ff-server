import Product from '@/models/Product';
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
}

export default ProductsService;
