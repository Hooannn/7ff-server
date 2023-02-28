import ProductsService from '@/services/products.service';
import { NextFunction, Request, Response } from 'express';
class ProductsController {
  private productsService = new ProductsService();
  public getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const product = await this.productsService.getProductById(productId);
      res.status(200).json({ code: 200, success: true, data: product });
    } catch (error) {
      next(error);
    }
  };
}

export default ProductsController;
