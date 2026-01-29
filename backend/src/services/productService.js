import { ProductModel } from "../models/product.model.js";
import { DuplicateError, NotFoundError, ValidationError } from "../errors/errors.js";

export class ProductService {
    constructor(db) {
        this.productModel = new ProductModel(db);
    }

    async getProductsService(page) {
        try {
            const { limit, offset } = this.#limitOffsetControl(page);

            const [products] = await this.productModel.getProductsFromDb(limit, offset);

            return products;
        } catch (error) {
            throw error;
        }
    }

    async createUnidadService(nombreUnidad) {
        try {
            const [duplicate] = await this.productModel.getUnidadByName(nombreUnidad);
            if (duplicate[0]) {
                throw new DuplicateError('Unidad duplicada', 409);
            }

            const [unidad] = await this.productModel.createUnidadInDb(nombreUnidad);
            return unidad;
        } catch (error) {
            throw error;
        }
    }

    async getAllUnidadService() {
        try {
            const [unidades] = await this.productModel.getAllUnidadFromDb();
            return unidades;
        } catch (error) {
            throw error;
        }
    }

    async deleteUnidadService(idUnidad) {
        try {
            const [unidad] = await this.productModel.deleteUnidadInDb(idUnidad);

            if (!unidad.affectedRows) {
                throw new NotFoundError('Unidad no encontrada', 404);
            }

            return unidad.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    async createProductService(campos) {
        try {
            this.#validateProduct(campos);
            const { nombre, codigo, costo_compra, precio_venta, stock, stock_limite, id_categoria, id_unidad } = campos;
            const codeParser = codigo.toString().padStart(4, '0');

            const [duplicate] = await this.productModel.verifyDuplicateProduct(codeParser, nombre);
            if (duplicate.length) {
                throw new DuplicateError('Producto duplicado el codigo o nombre ya existen', 409);
            }
            const [product] = await this.productModel.createProductInDb(nombre, codeParser, costo_compra, precio_venta, stock, stock_limite, id_categoria, id_unidad);
            return product.insertId;
        } catch (error) {
            throw error;
        }
    }

    async changeStatusProductService(estado, id) {
        if (!estado || !id) throw new ValidationError('Campos incompletos o invalidos', 422);
        const estadoParser = (estado.toLowerCase() == 'activo') ? 1 : 0;

        try {
            const [product] = await this.productModel.changeStatusProductInDb(estadoParser, id);

            if (!product.affectedRows) {
                throw new NotFoundError('Producto no encontrado', 404);
            }
            return product.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    async updateProductService(campos, id) {
        try {
            if (!campos || !id) throw new ValidationError('Campos incompletos o invalidos', 422);

            const { nombre, codigo, costo_compra, precio_venta, stock, stock_limite, id_categoria, id_unidad } = campos;

            this.#validateProduct(campos);

            const codeParser = codigo.toString().padStart(4, '0');

            const [duplicate] = await this.productModel.verifyDuplicateProduct(codeParser, nombre, id);
            console.log(duplicate);
            if (duplicate.length) {
                throw new DuplicateError('Producto duplicado el codigo o nombre ya existen', 409);
            }

            const [product] = await this.productModel.updateProductInDb(nombre, codeParser, costo_compra, precio_venta, stock, stock_limite, id_categoria, id_unidad, id);

            if (!product.affectedRows) {
                throw new NotFoundError('Producto no encontrado', 404);
            }

            return product.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    async deleteProductService(id) {
        try {
            if (!id) throw new ValidationError('El ID del producto es requerido', 422);

            const [product] = await this.productModel.deleteProductInDb(id);

            if (!product.affectedRows) {
                throw new NotFoundError('Producto no encontrado', 404);
            }

            return product.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    #validateProduct(campos) {
        if (!campos.nombre || campos.nombre.trim().length < 2) {
            throw new ValidationError('El nombre del producto es obligatorio y debe tener al menos 2 caracteres', 422);
        }

        if (!campos.codigo || campos.codigo.trim().length < 1 || campos.codigo.trim().length > 4) {
            throw new ValidationError('El codigo del producto es obligatorio y debe tener entre 1 y 4 caracteres', 422);
        }

        if (!campos.costo_compra || isNaN(campos.costo_compra) || parseFloat(campos.costo_compra) <= 0) {
            throw new ValidationError('El costo de compra es obligatorio y debe ser mayor a 0', 422);
        }

        if (!campos.precio_venta || isNaN(campos.precio_venta) || parseFloat(campos.precio_venta) <= 0) {
            throw new ValidationError('El precio de venta es obligatorio y debe ser mayor a 0', 422);
        }

        if (campos.stock === undefined || campos.stock === null || isNaN(campos.stock) || parseInt(campos.stock) < 0) {
            throw new ValidationError('El stock es obligatorio y debe ser un número mayor o igual a 0', 422);
        }

        if (campos.stock_limite === undefined || campos.stock_limite === null || isNaN(campos.stock_limite) || parseInt(campos.stock_limite) < 0) {
            throw new ValidationError('El stock límite es obligatorio y debe ser un número mayor o igual a 0', 422);
        }

        if (campos.id_categoria === undefined || campos.id_categoria === null || isNaN(campos.id_categoria) || parseInt(campos.id_categoria) <= 0) {
            throw new ValidationError('La categoría es obligatoria y debe ser un ID valido', 422);
        }

        if (campos.id_unidad === undefined || campos.id_unidad === null || isNaN(campos.id_unidad) || parseInt(campos.id_unidad) <= 0) {
            throw new ValidationError('La unidad es obligatoria y debe ser un ID valido', 422);
        }

        return true;
    }

    async getAllFilterByNameOrCodeService(value, page) {
        const { limit, offset } = this.#limitOffsetControl(page);

        try {
            const [products] = await this.productModel.getAllFilterByNameOrCodeFromDb(value, limit, offset);
            if (!products) {
                throw new NotFoundError('No se encontraron productos', 404);
            }
            return products;
        } catch (error) {
            throw error;
        }
    }

    async getAllFilterCategoryService(value, page) {
        const { limit, offset } = this.#limitOffsetControl(page);

        try {
            const [products] = await this.productModel.getAllFilterCategoryFromDb(value, limit, offset);
            if (!products) {
                throw new NotFoundError('No se encontraron productos', 404);
            }
            return products;
        } catch (error) {
            throw error;
        }
    }

    async getAllFilterStatusService(value, page) {
        const { limit, offset } = this.#limitOffsetControl(page);

        try {
            const [products] = await this.productModel.getAllFilterStatusFromDb(value, limit, offset);
            if (!products) {
                throw new NotFoundError('No se encontraron productos', 404);
            }
            return products;
        } catch (error) {
            throw error;
        }
    }

    #limitOffsetControl(page) {
        if (!page || page <= 0) page = 1;

        const limit = 10;
        let offset = 0;
        if (page == 1 || page <= 0) {
            offset = 0;
        } else {
            offset = limit * (page - 1);
        }
        return { limit, offset };
    }
}
