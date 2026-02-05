<template>
    <div class="dashboard-page">
        <div class="dashboard-header">
            <div>
                <h1 class="title">Panel de Administración</h1>
                <p class="subtitle">Vista general del sistema y métricas clave</p>
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
            <div class="stat-card primary">
                <div class="stat-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"></path>
                    </svg>
                </div>
                <div class="stat-content">
                    <p class="stat-label">Valor Total del Inventario</p>
                    <p class="stat-value">{{ formatCurrency(parseFloat(totalInventoryValue)) }}</p>
                </div>
            </div>

            <div class="stat-card success">
                <div class="stat-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
                <div class="stat-content">
                    <p class="stat-label">Usuarios Totales</p>
                    <p class="stat-value">{{ totalUsers }}</p>
                </div>
            </div>

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

        <!-- Estadísticas de ventas -->
        <div class="sales-section">
            <div class="section-header">
                <h2 class="section-title">Estadísticas de Ventas</h2>
            </div>

            <div class="unified-sales-card">
                <div class="sales-grid-unified">
                    <div class="sales-column">
                        <h3>Ventas Semanales</h3>
                        <div class="sales-amount">{{ formatCurrency(parseFloat(weeklySales)) }}</div>
                        <div class="sales-details">
                            <div class="sales-item">
                                <span class="label">Transacciones totales</span>
                                <span class="value">{{ weeklyTransactions }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="sales-divider"></div>

                    <div class="sales-column">
                        <h3>Ventas Mensuales</h3>
                        <div class="sales-amount">{{ formatCurrency(parseFloat(monthlySales)) }}</div>
                        <div class="sales-details">
                            <div class="sales-item">
                                <span class="label">Transacciones totales</span>
                                <span class="value">{{ monthlyTransactions }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bottom-grid">
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
const totalInventoryValue = ref(0)
const totalUsers = ref(0)
const totalProducts = ref(0)
const totalCategories = ref(0)
const userApi = new UserApi();

const weeklySales = ref(0)
const monthlySales = ref(0)
const weeklyTransactions = ref(0)
const monthlyTransactions = ref(0)

const topProducts = ref([])
const lowStockProducts = ref([])

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(value)
}

const getPanelData = async () => {
    try {
        const response = await userApi.panelForAdmin();
        if (!response.success) {
            dataError();
            return;
        }
        const data = response.infoPanel;
        totalInventoryValue.value = parseFloat(data.general_producto.total_inventario)
        totalProducts.value = data.general_producto.cantidad_productos
        totalUsers.value = data.usuarios_totales
        totalCategories.value = data.categorias_totales

        weeklySales.value = parseFloat(data.reporte_semana.ventas_semana)
        weeklyTransactions.value = data.reporte_semana.ventas_totales_semana

        monthlySales.value = parseFloat(data.reporte_mes.ventas_mes)
        monthlyTransactions.value = data.reporte_mes.ventas_totales_mes

        topProducts.value = data.mas_vendidos.map((product) => ({
            id: product.id,
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
    totalInventoryValue.value = 0;
    totalProducts.value = 0;
    totalUsers.value = 0;
    totalCategories.value = 0;

    weeklySales.value = 0;
    weeklyTransactions.value = 0;

    monthlySales.value = 0;
    monthlyTransactions.value = 0;
}

const refreshData = () => {
    getPanelData()
}

onMounted(() => {
    getPanelData()
})
</script>

<style scoped>
.dashboard-page {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px;
    width: 100%;
    background-color: #F6F6F8;
    font-family: var(--font-sans);
}

.dashboard-header {
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

.stat-card.primary .stat-icon {
    background: rgba(44, 62, 80, 0.1);
    color: var(--color-primary);
}

.stat-card.success .stat-icon {
    background: rgba(46, 204, 113, 0.1);
    color: var(--color-success);
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

.stat-change {
    font-size: 0.75rem;
    font-weight: 500;
}

.stat-change.positive {
    color: var(--color-success);
}

.stat-change.negative {
    color: var(--color-error);
}

.stat-change.neutral {
    color: var(--color-text-light);
}

.sales-section {
    background: var(--color-white);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    box-shadow: var(--shadow-sm);
    padding: 24px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-primary);
}

.unified-sales-card {
    background: var(--color-background);
    border-radius: 8px;
    padding: 24px;
}

.sales-grid-unified {
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    gap: 32px;
    align-items: stretch;
}

.sales-column {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.sales-column h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
}

.sales-divider {
    width: 1px;
    background: var(--color-border);
    align-self: stretch;
}

.sales-amount {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-success);
}

.sales-details {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.sales-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.sales-item .label {
    font-size: 0.875rem;
    color: var(--color-text-light);
}

.sales-item .value {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text);
}

.bottom-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.activity-card,
.top-products-card,
.low-stock-card {
    background: var(--color-white);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    box-shadow: var(--shadow-sm);
    padding: 20px;
}

.activity-card h3,
.top-products-card h3,
.low-stock-card h3 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0 0 16px 0;
}

.activity-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.activity-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: var(--color-background);
    border-radius: 8px;
}

.activity-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.activity-icon.user {
    background: rgba(52, 152, 219, 0.1);
    color: var(--color-info);
}

.activity-icon.product {
    background: rgba(46, 204, 113, 0.1);
    color: var(--color-success);
}

.activity-icon.sale {
    background: rgba(44, 62, 80, 0.1);
    color: var(--color-primary);
}

.activity-icon.category {
    background: rgba(243, 156, 18, 0.1);
    color: var(--color-warning);
}

.activity-icon.warning {
    background: rgba(231, 76, 60, 0.1);
    color: var(--color-error);
}

.activity-icon svg {
    width: 16px;
    height: 16px;
}

.activity-content {
    flex: 1;
}

.activity-title {
    font-size: 0.875rem;
    color: var(--color-text);
    margin: 0;
}

.activity-time {
    font-size: 0.75rem;
    color: var(--color-text-light);
    margin: 2px 0 0 0;
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

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 40px;
    padding: 0 14px;
    border-radius: 8px;
    border: 1px solid var(--color-border);
    background: var(--color-white);
    color: var(--color-text);
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn:hover {
    background: var(--color-background);
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
    border-left-color: var(--color-error);
    background: rgba(231, 76, 60, 0.05);
}

.low-stock-item.warning {
    border-left-color: var(--color-warning);
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

.current-stock,
.min-stock {
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

@media (max-width: 1024px) {
    .sales-grid-unified {
        grid-template-columns: 1fr;
        gap: 24px;
    }

    .sales-divider {
        display: none;
    }

    .bottom-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .dashboard-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }

    .section-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }
}
</style>
