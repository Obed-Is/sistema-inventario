export class SalesApi {
    async createSale(venta) {
        try {
            const response = await fetch('/api/sales/new', {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                method: 'POST',
                body: JSON.stringify({ venta })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            return { success: false };
        }
    }
}
