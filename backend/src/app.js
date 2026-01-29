import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
//importacion de archivos
import routerAth from './routes/auth/routerAuth.js';
import userRouter from './routes/users.router.js';
import categoryRouter from './routes/category.router.js';
import productRouter from './routes/product.router.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

//middlewares del servidor
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/user', routerAth);
app.use('/user', userRouter);
app.use('/category', categoryRouter);
app.use('/product', productRouter);

//para q express capture el error debe ir de ultimo
app.use(errorHandler);


app.listen(process.env.SERVER_PORT, () => {
    console.log('Servidor ejecutandose en el puerto 3000');
})