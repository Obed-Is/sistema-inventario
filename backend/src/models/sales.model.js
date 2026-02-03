export class SalesModel {
    constructor(db) {
        this.db = db;
    }

    // Se recibe la conexion como parametro para poder usar las transacciones y en caso
    // de error poder revertir la transaccion(venta), lo mismo que en el modelo de productos
    async createNewSale(total_venta, descripcion, id_usuario, conn) {
        const executor = conn;
        try {
            return executor.execute(`
                    INSERT INTO movimientos 
                        (total_movimiento, descripcion, estado_registro,
                        id_tipo_movimiento, id_estado_movimiento, id_usuario)
                    VALUES
                        (?, ?, ?, ?, ?, ?)
                `,
                // se coloca 1 en estos caso ya q corresponde a una venta completa de manera simple
                // si se decide agregar distintos tipos de venta o movimientos se debera cambiar esto
                [total_venta, descripcion, 1, 1, 1, id_usuario]);
        } catch (error) {
            throw error;
        }
    }

    async createDetailSale(cantidad, precio_unitario, sub_total, id_producto, id_movimiento, conn) {
        const executor = conn;
        try {
            return executor.execute(`
                INSERT INTO detalles_movimiento
                    (cantidad, precio_unitario, sub_total, id_producto, id_movimiento)
                VALUES
                    (?, ?, ?, ?, ?)
            `,
                [cantidad, precio_unitario, sub_total, id_producto, id_movimiento]);
        } catch (error) {
            throw error;
        }
    }
}
