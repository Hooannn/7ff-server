import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import ProductsController from '@/controllers/products.controller';

class ProductsRoute implements Routes {
  public path = '/products';
  public router = Router();
  private productsController = new ProductsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:productId`, this.productsController.getProductById);
  }
}

export default ProductsRoute;
