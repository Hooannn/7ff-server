import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import FilesController from '@/controllers/files.controller';

class FilesRoute implements Routes {
  public path = '/files';
  public router = Router();
  private filesController = new FilesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/upload/image/single`, this.filesController.uploadSingleImage);
    this.router.get(`${this.path}/search/folder`, this.filesController.searchByFolder);
  }
}

export default FilesRoute;
