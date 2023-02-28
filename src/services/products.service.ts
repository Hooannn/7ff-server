import Product from '@/models/Product';

class ProductsService {
  private Product = Product;
  public async getProductById(productId: string) {
    return await this.Product.findById(productId);
  }
}
export default ProductsService;
