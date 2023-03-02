import App from './app';
import AuthRoute from './routes/auth.route';
import IndexRoute from './routes/index.route';
import ProductsRoute from './routes/products.route';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new ProductsRoute(), new AuthRoute()]);

app.listen();
