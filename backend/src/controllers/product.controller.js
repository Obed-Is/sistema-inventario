import { ProductService } from "../services/productService.js"

export class ProductController {
    constructor(db) {
        this.productService = new ProductService(db)
    }

    async getAllProducts(req, res, next) {
        try {
            if (!req.logIn) return res.status(401).json({ success: false });
            const { page } = req.params;

            const products = await this.productService.getProductsService(page);

            res.status(200).json({ productos: products, success: true });
        } catch (error) {
            next(error)
        }
    }

    async createUnidad(req, res, next) {
        try {
            if (!req.logIn) return res.status(401).json({ success: false });

            const { nombreUnidad } = req.body;
            if (!nombreUnidad) return res.status(400).json({ success: false, message: 'Nombre de la unidad es requerido' });

            const unidad = await this.productService.createUnidadService(nombreUnidad);
            if (!unidad) return res.status(400).json({ success: false, message: 'Error al crear la unidad' });

            res.status(201).json({ success: true, message: 'Unidad creada' });
        } catch (error) {
            next(error)
        }
    }

    async getAllUnidad(req, res, next) {
        try {
            if (!req.logIn) return res.status(401).json({ success: false });

            const unidad = await this.productService.getAllUnidadService();
            if (!unidad) return res.status(400).json({ success: false, message: 'Error al obtener las unidades' });

            res.status(200).json({ unidades: unidad, success: true });
        } catch (error) {
            next(error)
        }
    }

    async deleteUnidad(req, res, next) {
        try {
            if (!req.logIn) return res.status(401).json({ success: false });

            const { id } = req.params;
            if (!id) return res.status(400).json({ success: false, message: 'El ID de la unidad es requerido' });

            const unidad = await this.productService.deleteUnidadService(id);
            if (!unidad) return res.status(400).json({ success: false, message: 'Error al eliminar la unidad' });

            res.status(200).json({ success: true, message: 'Unidad eliminada' });
        } catch (error) {
            next(error)
        }
    }

    async createProduct(req, res, next) {
        try {
            if (!req.logIn) return res.status(401).json({ success: false });
            const product = await this.productService.createProductService(req.body);
            if (!product) return res.status(400).json({ success: false, message: 'Error al crear el producto' });

            res.status(201).json({ success: true, message: 'Producto creado' });
        } catch (error) {
            next(error)
        }
    }

    async changeStatusProduct(req, res, next) {
        try {
            if (!req.logIn) return res.status(401).json({ success: false });

            const { id } = req.params;
            if (!id) return res.status(400).json({ success: false, message: 'El ID del producto es requerido' });

            const request = await this.productService.changeStatusProductService(req.body.estado, id);
            if (!request) return res.status(400).json({ success: false, message: 'Error al cambiar el estado del producto' });

            res.status(200).json({ success: true, message: 'Estado del producto cambiado' });
        } catch (error) {
            next(error)
        }
    }

    async updateProduct(req, res, next) {
        try {
            if (!req.logIn) return res.status(401).json({ success: false });

            const { id } = req.params;
            if (!id) return res.status(400).json({ success: false, message: 'El ID del producto es requerido' });

            const product = await this.productService.updateProductService(req.body, id);
            if (!product) return res.status(400).json({ success: false, message: 'Error al actualizar el producto' });

            res.status(200).json({ success: true, message: 'Producto actualizado' });
        } catch (error) {
            next(error)
        }
    }

    async deleteProduct(req, res, next) {
        try {
            if (!req.logIn) return res.status(401).json({ success: false });

            const { id } = req.params;
            if (!id) return res.status(400).json({ success: false, message: 'El ID del producto es requerido' });

            const product = await this.productService.deleteProductService(id);
            if (!product) return res.status(400).json({ success: false, message: 'Error al eliminar el producto' });

            res.status(200).json({ success: true, message: 'Producto eliminado' });
        } catch (error) {
            next(error)
        }
    }

    async getAllFilter(req, res, next) {
        try {
            if (!req.logIn) return res.status(401).json({ success: false });
            const { filter } = req.body;
            const { page } = req.params;
            const { value } = req.body;
            if (!filter) return res.status(400).json({ success: false, message: 'El filtro es requerido' });

            if (filter == 'nombre' || filter == 'codigo') {
                const products = await this.productService.getAllFilterByNameOrCodeService(value, page);
                if (!products) return res.status(400).json({ success: false, message: 'Error al obtener los productos' });

                return res.status(200).json({ productos: products, success: true });
            } else if (filter == 'categoria') {
                const products = await this.productService.getAllFilterCategoryService(value, page);
                if (!products) return res.status(400).json({ success: false, message: 'Error al obtener los productos' });

                return res.status(200).json({ productos: products, success: true });
            } else if (filter == 'estado') {
                const products = await this.productService.getAllFilterStatusService(value, page);
                if (!products) return res.status(400).json({ success: false, message: 'Error al obtener los productos' });

                return res.status(200).json({ productos: products, success: true });
            }

            return res.status(400).json({ success: false, message: 'El filtro es invalido' });
        } catch (error) {
            next(error)
        }
    }

    // Metodos para ventas
    async getProductForSales(req, res, next) {
        try {
            if (!req.logIn) return res.status(401).json({ success: false });

            const products = await this.productService.getProductsForSales();

            res.status(200).json({ success: true, productos: products });
        } catch (error) {
            next(error);
        }
    }

    async findProductForSales(req, res, next) {
        try {
            if (!req.logIn) return res.status(401).json({ success: false });

            const { producto } = req.body;
            if (!producto) return res.status(400).json({ success: false, message: 'El nombre o codigo del producto es requerido' });

            const productos = await this.productService.findProductForSales(producto);
            if (!productos) return res.status(400).json({ success: false, message: 'Error al obtener el producto' });

            res.status(200).json({ success: true, productos: productos });
        } catch (error) {
            next(error);
        }
    }
}