import { successStatus } from '@/config';
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

  public getAllProduct = async (req: Request, res: Response, next: NextFunction) => {
    try{
      const { skip, limit, filter, sort} = req.query;
      const { total, products } = await this.productsService.getAllProduct({
        skip: parseInt(skip?.toString()),
        limit: parseInt(limit?.toString()),
        filter: filter?.toString(),
        sort: sort?.toString(),
      });
      res.status(200).json({ code: 200, success: true, data: products, total, took: products.length });
    } catch(error){
      next(error);
    }
  };

  public addProduct = async (req: Request, res: Response, next: NextFunction) =>{
    try {
      const reqProduct = req.body;
      const product = await this.productsService.addProduct(reqProduct);
      res.status(201).json({ code: 201, success: true, data: product, message: successStatus.CREATE_SUCCESSFULLY });
    } catch (error){
      next(error);
    }
  };

  public deleteProduct =async (req: Request, res: Response, next: NextFunction) => {
    try{
      const { id } = req.query;
      await this.productsService.deleteProduct(id.toString());
      res.status(200).json({ code: 200, success: true, message: successStatus.DELETE_SUCCESSFULLY });
    } catch(error){
      next(error);
    }
  };

  public updateProduct =async (req:Request, res: Response, next: NextFunction) => {
    try{
      const { id } = req.query;
      const product = req.body;
      const updateProduct = await this.productsService.updateProduct(id.toString(),product);
      res.status(200).json({ code: 200, success: true, data: updateProduct, message: successStatus.UPDATE_SUCCESSFULLY });
    } catch(error){
      next(error);
    }
  };
}

export default ProductsController;
