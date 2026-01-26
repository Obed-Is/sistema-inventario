export class CategoryApi {

    async getCategories(pagina) {
        try {
            const response = await fetch(`/api/category/${pagina}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                method: 'GET',
            });
            const data = await response.json();

            return data;
        } catch (error) {
            console.log(error)
            return { success: false };
        }
    }

    async cretateCategory(categoria) {
        try {
            const response = await fetch(`/api/category/create`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                method: 'POST',
                body: JSON.stringify(categoria)
            });
            const data = await response.json();

            return data;
        } catch (error) {
            console.log(error)
            return { success: false };
        }
    }

    async updateCategory(categoria) {
        try {
            const response = await fetch(`/api/category/${categoria.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                method: 'PUT',
                body: JSON.stringify(categoria)
            });
            const data = await response.json();

            return data;
        } catch (error) {
            console.log(error)
            return { success: false };
        }
    }

    async changeStatusApi(estado, id) {
        try {
            const response = await fetch(`/api/category/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                method: 'PATCH',
                body: JSON.stringify({ estado })
            });
            const data = await response.json();

            return data;
        } catch (error) {
            console.log(error)
            return { success: false };
        }
    }

    async searchCategoryApi(nombre) {
        try {
            const response = await fetch(`/api/category/search`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                method: 'POST',
                body: JSON.stringify({ nombre })
            });
            const data = await response.json();

            return data;
        } catch (error) {
            console.log(error)
            return { success: false };
        }
    }

    async deleteCategory(id) {
        try {
            const response = await fetch(`/api/category/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                method: 'DELETE',
            });
            const data = await response.json();

            return data;
        } catch (error) {
            console.log(error)
            return { success: false };
        }
    }
}