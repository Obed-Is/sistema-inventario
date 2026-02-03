export class ProductModel {
    constructor(db) {
        this.db = db;
    }

    async getProductsFromDb(limit, offset) {
        try {
            console.log(limit, offset);
            return this.db.query(`
                SELECT 
                    p.id, p.codigo, p.nombre, p.costo_compra, p.precio_venta, p.estado, 
                    p.stock, p.stock_limite, p.create_at, p.update_at, c.nombre AS 'nombre_categoria', u.nombre AS 'unidad_medida'
                FROM productos p 
                INNER JOIN categorias c ON c.id = p.id_categoria
				INNER JOIN unidades_medida u ON u.id = p.id_unidad
                WHERE p.estado != -1 AND c.estado = 1 
                ORDER BY p.codigo LIMIT ? OFFSET ?`,
                [limit, offset]
            );
        } catch (error) {
            throw error;
        }
    }

    async getUnidadByName(nombre) {
        try {
            return this.db.query(`SELECT id FROM unidades_medida WHERE nombre = ? AND estado = 1`, [nombre]);
        } catch (error) {
            throw error;
        }
    }

    async createUnidadInDb(nombre) {
        try {
            return this.db.execute(`INSERT INTO unidades_medida (nombre) VALUES (?)`, [nombre]);
        } catch (error) {
            throw error;
        }
    }

    async getAllUnidadFromDb() {
        try {
            return this.db.query(`SELECT id, nombre FROM unidades_medida WHERE estado = 1`);
        } catch (error) {
            throw error;
        }
    }

    async verifyDuplicateProduct(codigo, nombre, id) {
        try {
            return this.db.query(`SELECT id FROM productos WHERE (codigo = ? OR nombre = ?) AND estado != -1 AND id != ?`, [codigo, nombre, id ?? -1]);
        } catch (error) {
            throw error;
        }
    }

    async createProductInDb(nombre, codigo, costo_compra, precio_venta, stock, stock_limite, id_categoria, id_unidad) {
        try {
            return this.db.execute(`
                INSERT INTO productos (nombre, codigo, costo_compra, precio_venta, stock, stock_limite, id_categoria, id_unidad) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [nombre, codigo, costo_compra, precio_venta, stock, stock_limite, id_categoria, id_unidad]
            );
        } catch (error) {
            throw error;
        }
    }

    async deleteUnidadInDb(id) {
        try {
            return this.db.execute(`UPDATE unidades_medida SET estado = -1 WHERE id = ?`,
                [id]
            );
        } catch (error) {
            throw error;
        }
    }

    async changeStatusProductInDb(estado, id) {
        try {
            return this.db.execute(`UPDATE productos SET estado = ? WHERE id = ?`, [estado, id]);
        } catch (error) {
            throw error;
        }
    }

    async updateProductInDb(nombre, codeParser, costo_compra, precio_venta, stock, stock_limite, id_categoria, id_unidad, id) {
        try {
            return this.db.execute(`
                UPDATE productos 
                SET nombre = ?, codigo = ?, costo_compra = ?, precio_venta = ?, 
                stock = ?, stock_limite = ?, id_categoria = ?, id_unidad = ?
                WHERE id = ?`,
                [nombre, codeParser, costo_compra, precio_venta, stock, stock_limite, id_categoria, id_unidad, id]);
        } catch (error) {
            throw error;
        }
    }

    async deleteProductInDb(id) {
        try {
            return this.db.execute(`UPDATE productos SET estado = -1 WHERE id = ?`, [id]);
        } catch (error) {
            throw error;
        }
    }

    async getAllFilterByNameOrCodeFromDb(value, limit, offset) {
        try {
            return this.db.query(`
                SELECT 
                    p.id, p.codigo, p.nombre, p.costo_compra, p.precio_venta, p.estado, 
                    p.stock, p.stock_limite, p.create_at, p.update_at, c.nombre AS 'nombre_categoria', u.nombre AS 'unidad_medida'
                FROM productos p 
                INNER JOIN categorias c ON c.id = p.id_categoria
				INNER JOIN unidades_medida u ON u.id = p.id_unidad
                WHERE (p.nombre LIKE ? OR p.codigo LIKE ?) AND p.estado != -1 AND c.estado = 1 
                ORDER BY p.codigo LIMIT ? OFFSET ?`,
                [`%${value}%`, `%${value}%`, limit, offset]);
        } catch (error) {
            throw error;
        }
    }

    async getAllFilterCategoryFromDb(value, limit, offset) {
        try {
            return this.db.query(`
                SELECT 
                    p.id, p.codigo, p.nombre, p.costo_compra, p.precio_venta, p.estado, 
                    p.stock, p.stock_limite, p.create_at, p.update_at, c.nombre AS 'nombre_categoria', u.nombre AS 'unidad_medida'
                FROM productos p 
                INNER JOIN categorias c ON c.id = p.id_categoria
				INNER JOIN unidades_medida u ON u.id = p.id_unidad
                WHERE c.id = ? AND p.estado != -1 AND c.estado = 1 
                ORDER BY p.codigo LIMIT ? OFFSET ?`,
                [value, limit, offset]);
        } catch (error) {
            throw error;
        }
    }

    async getAllFilterStatusFromDb(value, limit, offset) {
        try {
            return this.db.query(`
                SELECT 
                    p.id, p.codigo, p.nombre, p.costo_compra, p.precio_venta, p.estado, 
                    p.stock, p.stock_limite, p.create_at, p.update_at, c.nombre AS 'nombre_categoria', u.nombre AS 'unidad_medida'
                FROM productos p 
                INNER JOIN categorias c ON c.id = p.id_categoria
				INNER JOIN unidades_medida u ON u.id = p.id_unidad
                WHERE p.estado = ? AND c.estado = 1 
                ORDER BY p.codigo LIMIT ? OFFSET ?`,
                [value, limit, offset]);
        } catch (error) {
            throw error;
        }
    }

    async getProductsForSales() {
        return this.db.query(`
            SELECT 
                p.id, 
                p.codigo, 
                p.nombre, 
                p.precio_venta, 
                p.stock, 
                u.nombre AS 'medida_unidad' 
            FROM productos p 
            INNER JOIN unidades_medida u ON u.id = p.id_unidad
            INNER JOIN categorias c ON c.id = p.id_categoria
            WHERE p.estado = 1 AND c.estado = 1
            ORDER BY p.codigo
            LIMIT 10 OFFSET 0
        `);
    }

    async findProductForSalesInDb(producto) {
        return this.db.query(`
                SELECT 
                    p.id, 
                    p.codigo, 
                    p.nombre, 
                    p.precio_venta, 
                    p.stock, 
                    u.nombre AS 'medida_unidad' 
                FROM productos p 
                INNER JOIN unidades_medida u ON u.id = p.id_unidad
                INNER JOIN categorias c ON c.id = p.id_categoria
                WHERE (p.codigo LIKE ? OR p.nombre LIKE ?) AND p.estado = 1 AND c.estado = 1 
                ORDER BY p.codigo
            `, [`%${producto}%`, `%${producto}%`]
        );
    }

    async validateStock(id) {
        return this.db.query(`SELECT stock FROM productos WHERE id = ?`, [id]);
    }

    async decreaseStock(id, cantidad, conn) {
        // Se recibe la conexion como parametro para poder usar las transacciones y en caso
        // de error poder revertir la transaccion(venta)
        const executor = conn || this.db;
        try {
            return executor.execute(`
                UPDATE productos 
                SET stock = stock - ? 
                WHERE id = ?`, [cantidad, id]
            );
        } catch (error) {
            throw error;
        }
    }
}
