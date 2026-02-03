export class ProductosApi {

    async getProducts(pagina) {
        try {
            const response = await fetch(`/api/product/${pagina}`, {
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

    async filterProducts(pagina, filter, value) {
        try {
            const response = await fetch(`/api/product/filter/${pagina}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                method: 'POST',
                body: JSON.stringify({ filter, value })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error)
            return { success: false };
        }
    }

    async createProduct(producto) {
        try {
            const response = await fetch(`/api/product`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                method: 'POST',
                body: JSON.stringify(producto)
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error)
            return { success: false };
        }
    }

    async updateProduct(producto) {
        try {
            const response = await fetch(`/api/product/${producto.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                method: 'PUT',
                body: JSON.stringify(producto)
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
            const response = await fetch(`/api/product/${id}`, {
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

    async deleteProduct(id) {
        try {
            const response = await fetch(`/api/product/${id}`, {
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

    async getUnidades() {
        try {
            const response = await fetch(`/api/product/unidad`, {
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

    async createUnidad(nombreUnidad) {
        try {
            const response = await fetch(`/api/product/unidad`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                method: 'POST',
                body: JSON.stringify({ nombreUnidad })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error)
            return { success: false };
        }
    }

    async deleteUnidad(id) {
        try {
            const response = await fetch(`/api/product/unidad/${id}`, {
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

    // metodos para el modulo deventas
    async getProductsForSales() {
        try {
            const response = await fetch('/api/product/sales', {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                method: 'GET',
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
            return { success: false };
        }
    }

    async findProductForSales(producto) {
        try {
            const response = await fetch('/api/product/sales/find', {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                method: 'POST',
                body: JSON.stringify({ producto })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
            return { success: false };
        }
    }
}
