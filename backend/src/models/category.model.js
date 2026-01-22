
export class CategoryModel {
    constructor(db) {
        this.db = db;
    }


    async getCategoriesFromDb(limit, offset) {
        try {
            return this.db.query(`SELECT c.*, COUNT(p.id_categoria) AS 'total_productos' FROM categorias c 
                LEFT JOIN productos p ON p.id_categoria = c.id AND p.estado != -1 WHERE c.estado != -1
                GROUP BY c.id LIMIT ? OFFSET ?`,
                [limit, offset]
            );
        } catch (err) {
            throw err;
        }
    }

    async verifyDuplicateCategory(nombre, id) {
        try {
            return this.db.query(`SELECT nombre FROM categorias WHERE nombre = ? AND estado != -1 AND id != ?`,
                [nombre, id ?? -1]
            );
        } catch (err) {
            throw err;
        }
    }

    async createCategoryInDb(nombre, descripcion) {
        try {
            return this.db.execute(`INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)`,
                [nombre, descripcion]
            )
        } catch (err) {
            throw err;
        }
    }

    async updateCategoryInDb(nombre, descripcion, id) {
        try {
            return this.db.execute(`UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ? AND estado != -1`,
                [nombre, descripcion, id]
            )
        } catch (err) {
            throw err;
        }
    }

    // el eliminado es simplemente logico logico por si contiene relaciones en la db
    async deleteCategoryFromDb(id) {
        try {
            return this.db.execute(`UPDATE categorias SET estado = -1 WHERE id = ? AND estado != -1`, [id])
        } catch (err) {
            throw err;
        }
    }
}