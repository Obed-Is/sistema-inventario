import { DuplicateError, NotFoundError, ValidationError } from "../errors/errors.js";
import { CategoryModel } from "../models/category.model.js";

export class CategoryService {
    constructor(db) {
        this.categoryModel = new CategoryModel(db)
    }

    async getCategoriesFromDb(page) {
        try {
            const limit = 5;
            let offset = 0;
            if (page == 1 || page <= 0) {
                offset = 0;
            } else {
                offset = limit * (page - 1);
            }

            const [categories] = await this.categoryModel.getCategoriesFromDb(limit, offset);
            const [actives_inactives] = await this.categoryModel.getCountActivesInactivesCategory();

            return [categories, actives_inactives[0].activas, actives_inactives[0].inactivas, actives_inactives[0].total];
        } catch (err) {
            throw err;
        }
    }

    async createCategoryService(campos) {
        try {
            if (!campos.nombre || campos.nombre.length < 3 || campos.nombre.length > 20 
                || !campos.descripcion || campos.descripcion.length < 5 || campos.descripcion.length > 50) {
                throw new ValidationError('Campos incompletos o invalidos', 422);
            }

            const [duplicate] = await this.categoryModel.verifyDuplicateCategory(campos.nombre);
            
            if (duplicate[0]) {
                throw new DuplicateError('Categoria duplicada', 409);
            }

            const [request] = await this.categoryModel.createCategoryInDb(campos.nombre, campos.descripcion);

            return request.affectedRows;
        } catch (err) {
            console.log(err)
            throw err;
        }
    }

    async updateCategoryService(campos, id) {
        try {
            if (!campos.nombre || campos.nombre.length < 3 || !campos.descripcion || campos.descripcion.length < 5 || !id) {
                throw new ValidationError('Campos incompletos o invalidos', 422);
            }
            const [duplicate] = await this.categoryModel.verifyDuplicateCategory(campos.nombre, id);
            if (duplicate.length) {
                throw new DuplicateError('Categoria duplicada', 409);
            }

            const [request] = await this.categoryModel.updateCategoryInDb(campos.nombre, campos.descripcion, id);

            return request.affectedRows;
        } catch (err) {
            throw err;
        }
    }

    async deleteCategoryService(id) {
        try {
            if(!id || id <= 0) {
                throw new NotFoundError('No se proporciono un identificador valido', 404);
            }

            const [request] = await this.categoryModel.deleteCategoryFromDb(id);

            if(!request.affectedRows) {
                return false;
            }
            
            return request.affectedRows;
        } catch (err) {
            throw err;
        }
    }
}