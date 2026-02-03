import { SalesModel } from "../models/sales.model.js";
import { ProductModel } from "../models/product.model.js";
import { ValidationError } from "../errors/errors.js";

export class SalesService {
    constructor(db) {
        this.salesModel = new SalesModel(db);
        this.productModel = new ProductModel(db);
        this.pool = db;
    }

    async createNewSale(venta, id_usuario) {
        const connection = await this.pool.getConnection();

        try {
            // en caso de que algo falle se hace un rollback de la venta
            await connection.beginTransaction();

            await this.#validateSale(venta.productos);

            //crear venta y obtener su ID
            const [sale] = await this.salesModel.createNewSale(venta.total_venta, venta.descripcion, id_usuario, connection);
            const idSale = sale.insertId;
            if (!idSale) throw new Error('No se pudo crear la venta');

            //por medio del id generar los detalles del movimiento con las cantidades y precios
            for (const producto of venta.productos) {
                const precioUnitario = Number(
                    (producto.subtotal / producto.cantidad).toFixed(2)
                );
                await this.salesModel.createDetailSale(
                    producto.cantidad,
                    precioUnitario,
                    producto.subtotal,
                    producto.id,
                    idSale,
                    connection
                );

                await this.productModel.decreaseStock(
                    producto.id,
                    producto.cantidad,
                    connection
                );
            }
            // si todo sale bien se hace un commit de la venta
            await connection.commit();
            return true;
        } catch (error) {
            // si algo sale mal se hace un rollback de la venta
            await connection.rollback();
            throw error;
        } finally {
            // y aqui se libera la conexion
            connection.release();
        }
    }


    async #validateSale(productos) {
        if (!Array.isArray(productos) && productos.length === 0) {
            throw new ValidationError('No se proporcionaron productos', 422);
        }

        for (const producto of productos) {
            if (producto.cantidad <= 0 || !producto.id || producto.subtotal <= 0) {
                throw new ValidationError(`No se proporcionaron todos los datos del producto ${producto.nombre}`, 422);
            }

            const [detail] = await this.productModel.validateStock(producto.id);
            if (detail.length === 0) {
                throw new ValidationError(`No se encontro el producto ${producto.nombre}`, 422);
            }

            if (detail[0].stock < producto.cantidad || !detail[0].stock) {
                throw new ValidationError(`No hay stock suficiente para el producto ${producto.nombre}`, 422);
            }
        }
    }

}