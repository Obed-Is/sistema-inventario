<template>
    <div class="bodega-page">
        <div class="bodega-header">
            <div>
                <h1 class="title">Panel de Bodega</h1>
                <p class="subtitle">Gestión de inventario y ventas</p>
            </div>
            <div class="header-actions">
                <button class="btn btn-primary" type="button" @click="refreshData">
                    <svg style="width: 20px; height: 20px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                    </svg>
                    Actualizar datos
                </button>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card info">
                <div class="stat-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="9" y1="9" x2="15" y2="9"></line>
                        <line x1="9" y1="15" x2="15" y2="15"></line>
                    </svg>
                </div>
                <div class="stat-content">
                    <p class="stat-label">Productos Totales</p>
                    <p class="stat-value">{{ totalProducts }}</p>
                </div>
            </div>

            <div class="stat-card warning">
                <div class="stat-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                    </svg>
                </div>
                <div class="stat-content">
                    <p class="stat-label">Categorías Totales</p>
                    <p class="stat-value">{{ totalCategories }}</p>
                </div>
            </div>
        </div>

        <div class="products-grid">
            <div class="top-products-card">
                <h3>Productos Más Vendidos</h3>
                <div class="top-products-list">
                    <div class="product-item" v-for="(product, index) in topProducts" :key="product.id">
                        <span class="product-rank">{{ index + 1 }}</span>
                        <div class="product-info">
                            <p class="product-name">{{ product.name }}</p>
                            <p class="product-sales">{{ product.sales }} unidades</p>
                        </div>
                        <span class="product-revenue">{{ formatCurrency(product.revenue) }}</span>
                    </div>
                </div>
            </div>

            <div class="low-stock-card">
                <h3>Productos con Stock Bajo</h3>
                <div class="low-stock-list">
                    <div class="low-stock-item" v-for="product in lowStockProducts" :key="product.id"
                        :class="product.status">
                        <div class="stock-info">
                            <p class="product-name">{{ product.name }}</p>
                            <div class="stock-details">
                                <span class="current-stock">Stock actual: {{ product.currentStock }}</span>
                            </div>
                        </div>
                        <div class="stock-status">
                            <span class="status-badge" :class="product.status">
                                {{ product.status === 'critical' ? 'Crítico' : 'Bajo' }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { UserApi } from '@/api/usersApi'
import { ref, onMounted } from 'vue'
import { simpleAlert } from '@/utils/sweetAlert.js'

// Datos del panel
const totalProducts = ref(0)
const totalCategories = ref(0)
const userApi = new UserApi();

const topProducts = ref([])
const lowStockProducts = ref([])

const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(value)
}

const getBodegaData = async () => {
    try {
        const response = await userApi.panelForBodega();
        if (!response.success) {
            dataError();
            return;
        }
        const data = response.infoPanel;

        totalProducts.value = data.cantidad_productos
        totalCategories.value = data.categorias_totales

        topProducts.value = data.mas_vendidos.map((product) => ({
            name: product.nombre,
            sales: parseInt(product.cantidad_vendido),
            revenue: parseFloat(product.total_vendido),
            stock: product.stock
        }))

        lowStockProducts.value = data.stock_bajo.map((product) => ({
            id: product.id,
            name: product.nombre,
            currentStock: product.stock,
            status: product.stock <= 10 ? 'critical' : 'warning'
        }))

    } catch (error) {
        console.error('Error al obtener datos del panel:', error);
        dataError();
    }
}

function dataError() {
    simpleAlert('Error', 'Ocurrio un problema al intentar obtener los datos del panel', 'error');
    totalProducts.value = 0;
    totalCategories.value = 0;
    topProducts.value = [];
    lowStockProducts.value = [];
}

const refreshData = () => {
    getBodegaData()
}

onMounted(() => {
    getBodegaData()
})
</script>

<style scoped>
.bodega-page {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px;
    width: 100%;
    background-color: #F6F6F8;
    font-family: var(--font-sans);
}

.bodega-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    background-color: var(--color-white);
    padding: 24px;
    border-radius: 8px;
    box-shadow: var(--shadow-sm);
}

.title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-primary);
    margin: 0;
}

.subtitle {
    color: var(--color-text-light);
    margin-top: 4px;
}

.header-actions {
    display: flex;
    gap: 8px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
}

.stat-card {
    background: var(--color-white);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    box-shadow: var(--shadow-sm);
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.stat-card.info .stat-icon {
    background: rgba(52, 152, 219, 0.1);
    color: var(--color-info);
}

.stat-card.warning .stat-icon {
    background: rgba(243, 156, 18, 0.1);
    color: var(--color-warning);
}

.stat-icon svg {
    width: 24px;
    height: 24px;
}

.stat-content {
    flex: 1;
}

.stat-label {
    font-size: 0.875rem;
    color: var(--color-text-light);
    margin-bottom: 4px;
}

.stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: 4px;
}

.products-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.top-products-card,
.low-stock-card {
    background: var(--color-white);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    box-shadow: var(--shadow-sm);
    padding: 20px;
}

.top-products-card h3,
.low-stock-card h3 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0 0 16px 0;
}

.top-products-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.product-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: var(--color-background);
    border-radius: 8px;
}

.product-rank {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--color-accent);
    color: var(--color-white);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    flex-shrink: 0;
}

.product-info {
    flex: 1;
}

.product-name {
    font-size: 0.875rem;
    color: var(--color-text);
    margin: 0;
}

.product-sales {
    font-size: 0.75rem;
    color: var(--color-text-light);
    margin: 2px 0 0 0;
}

.product-revenue {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-success);
}

.low-stock-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.low-stock-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: var(--color-background);
    border-radius: 8px;
    transition: all 0.2s ease;
}

.low-stock-item.critical {
    background: rgba(231, 76, 60, 0.05);
}

.low-stock-item.warning {
    background: rgba(243, 156, 18, 0.05);
}

.stock-info {
    flex: 1;
}

.stock-details {
    display: flex;
    gap: 16px;
    margin-top: 4px;
}

.current-stock {
    font-size: 0.75rem;
    color: var(--color-text-light);
}

.current-stock {
    font-weight: 600;
    color: var(--color-text);
}

.status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.status-badge.critical {
    background: var(--color-error);
    color: var(--color-white);
}

.status-badge.warning {
    background: var(--color-warning);
    color: var(--color-white);
}

.btn-primary {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background-color: var(--color-accent);
    color: var(--color-white);
    border: none;
    border-radius: 6px;
    font-weight: 500;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
    background: var(--color-accent-dark);
    border-color: var(--color-accent-dark);
}

@media (max-width: 1024px) {
    .products-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
}

@media (max-width: 768px) {
    .bodega-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }
}
</style>
