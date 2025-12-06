import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
//importacion de archivos
import routerAth from './routes/auth/routerAuth.js';

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

app.use('/', routerAth);

app.listen(process.env.SERVER_PORT, () => {
    console.log('Servidor ejecutandose en el puerto 3000');
})