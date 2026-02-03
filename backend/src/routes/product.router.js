import { Router } from 'express';
import { TokenMiddleware } from '../middleware/tokenMiddleware.js';
import { poolDatabase } from '../services/connectionDatabase.js';
import { ProductController } from "../controllers/product.controller.js";

const productRouter = Router();
const tokenMiddle = new TokenMiddleware(poolDatabase);
const productController = new ProductController(poolDatabase);

productRouter.get('/sales', // productos para mostrar en el panel de ventas
    (req, res, next) => tokenMiddle.userIsLog(req, res, next),
    (req, res, next) => productController.getProductForSales(req, res, next));

productRouter.get('/unidad', //obtener las unidades ejm: kilogramo, libra etc.
    (req, res, next) => tokenMiddle.userIsLog(req, res, next),
    (req, res, next) => productController.getAllUnidad(req, res, next));

productRouter.get('/:page',
    (req, res, next) => tokenMiddle.userIsLog(req, res, next),
    (req, res, next) => productController.getAllProducts(req, res, next));

productRouter.post('/sales/find', // buscar producto por nombre o codigo para venta
    (req, res, next) => tokenMiddle.userIsLog(req, res, next),
    (req, res, next) => productController.findProductForSales(req, res, next));

productRouter.post('/filter/:page', //obtener los productos filtrados
    (req, res, next) => tokenMiddle.userIsLog(req, res, next),
    (req, res, next) => productController.getAllFilter(req, res, next));

productRouter.post('',
    (req, res, next) => tokenMiddle.userIsLog(req, res, next),
    (req, res, next) => productController.createProduct(req, res, next));

productRouter.post('/unidad', //crear una unidad
    (req, res, next) => tokenMiddle.userIsLog(req, res, next),
    (req, res, next) => productController.createUnidad(req, res, next));

productRouter.patch('/:id',
    (req, res, next) => tokenMiddle.userIsLog(req, res, next),
    (req, res, next) => productController.changeStatusProduct(req, res, next));

productRouter.put('/:id',
    (req, res, next) => tokenMiddle.userIsLog(req, res, next),
    (req, res, next) => productController.updateProduct(req, res, next));

productRouter.delete('/unidad/:id', //eliminar una unidad
    (req, res, next) => tokenMiddle.userIsLog(req, res, next),
    (req, res, next) => productController.deleteUnidad(req, res, next));

productRouter.delete('/:id', //eliminar un producto
    (req, res, next) => tokenMiddle.userIsLog(req, res, next),
    (req, res, next) => productController.deleteProduct(req, res, next));

export default productRouter;