import App from './app';
import AuthRoute from './routes/auth.route';
import FilesRoute from './routes/files.route';
import IndexRoute from './routes/index.route';
import ProductsRoute from './routes/products.route';
import UsersRoute from './routes/users.route';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([new UsersRoute(), new IndexRoute(), new FilesRoute(), new ProductsRoute(), new AuthRoute()]);

app.listen();
