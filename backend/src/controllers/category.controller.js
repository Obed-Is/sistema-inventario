import { CategoryService } from "../services/categoryService.js"

export class CategoryController {
    constructor(db) {
        this.categoryService = new CategoryService(db)
    }


    async getCategories(req, res, next) {
        try {
            if (!req.logIn) return res.status(401).json({ success: false });
            const { page } = req.params;

            const categories = await this.categoryService.getCategoriesFromDb(page);

            res.status(200).json({ 
                categorias: categories[0], 
                activas : categories[1], 
                inactivas : categories[2], 
                total : categories[3], 
                success: true 
            });
        } catch (err) {
            next(err);
        }
    }

    async createrCategory(req, res, next) {
        try {
            if (!req.logIn) return res.status(401).json({ success: false });

            const request = await this.categoryService.createCategoryService(req.body);

            if (!request) return res.status(500).json({ success: false, message: 'Error al crear la categoria' });

            res.status(201).json({ success: true, message: 'Categoria creada' });
        } catch (err) {
            next(err)
        }
    }


    async updateCategory(req, res, next) {
        try {
            if (!req.logIn) return res.status(401).json({ success: false });
            const { id } = req.params;
            const request = await this.categoryService.updateCategoryService(req.body, id);

            if (!request) return res.status(500).json({ success: false, message: 'Error al actualizar la categoria' });

            res.status(200).json({ success: true, message: 'Categoria actualizada' });
        } catch (err) {
            throw err;
        }
    }

    async changeState(req, res, next) {
        try {
            if (!req.logIn) return res.status(401).json({ success: false });
            const { id } = req.params;
            const request = await this.categoryService.changeStateService(req.body, id);

            if (!request) return res.status(500).json({ success: false, message: 'Error al actualizar la categoria' });

            res.status(200).json({ success: true, message: 'Categoria actualizada' });
        } catch (err) {
            throw err;
        }
    }

    async searchCategory(req, res, next) {
        try {
            if (!req.logIn) return res.status(401).json({ success: false });
            const request = await this.categoryService.searchCategoryService(req.body);
            if (!request) return res.status(500).json({ 
                success: false, 
                message: 'Error al actualizar la categoria', 
                categorias : [] 
            });

            res.status(200).json({ success: true, categorias : request });
        } catch (err) {
            throw err;
        }
    }

    async deleteCategory(req, res, next) {
        try {
            if (!req.logIn) return res.status(401).json({ success: false, message: 'Sin acceso' });
            const { id } = req.params;

            const request = await this.categoryService.deleteCategoryService(id);

            if (!request) return res.status(500).json({ success: false, message: 'Error al eliminar la categoria' });

            res.status(200).json({ success: true, message: 'Categoria eliminada' });
        } catch (err) {
            throw err;
        }
    }

}