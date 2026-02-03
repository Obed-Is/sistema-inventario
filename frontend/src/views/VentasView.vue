<template>
    <div class="sales-page">
        <div class="sales-header">
            <div>
                <h1 class="title">Ventas</h1>
                <p class="subtitle">Realiza ventas de productos del inventario</p>
            </div>
        </div>

        <div class="sales-content">
            <!-- PRODUCTOS -->
            <div class="card search-section">
                <h2 class="section-title">Buscar productos</h2>
                <div class="search-bar">
                    <div class="field with-icon">
                        <input class="input" type="text" v-model="searchInput"
                            placeholder="Buscar por nombre o código (Enter para buscar)" @keypress="onSearchKeypress" />
                        <svg class="field-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                    <button v-if="searchInput" class="btn btn-secondary btn-sm" @click="clearSearch">Limpiar</button>
                </div>

                <div class="products-list">
                    <div v-if="loading" class="loading">
                        <div class="spinner"></div>
                        <p>Cargando productos...</p>
                    </div>

                    <div v-else-if="products.length === 0" class="empty">
                        <p class="empty-text">No se encontraron productos</p>
                        <p class="empty-subtitle">Intenta con otra búsqueda o recarga la página</p>
                    </div>

                    <div v-else class="products-grid">
                        <div class="product-card" v-for="product in products" :key="product.id">
                            <div class="product-info">
                                <h3 class="product-name">{{ product.nombre }}</h3>
                                <p class="product-code">Código: {{ product.codigo }}</p>
                                <p class="product-price">Precio: ${{ Number(product.precio_venta).toFixed(2) }}</p>
                                <p class="product-stock" :class="{ 'low-stock': product.stock <= 5 }">Stock: {{
                                    product.stock }} - {{ product.medida_unidad }} (s)</p>
                            </div>
                            <div class="product-actions">
                                <div class="quantity-control">
                                    <button class="btn-quantity" @click="decrementQuantity(product)"
                                        :disabled="product.quantity <= 1">-</button>
                                    <input type="number" class="quantity-input" v-model.number="product.quantity"
                                        min="1" :max="product.stock" />
                                    <button class="btn-quantity" @click="incrementQuantity(product)"
                                        :disabled="product.quantity >= product.stock">+</button>
                                </div>
                                <button class="btn btn-primary btn-sm" @click="addToCart(product)"
                                    :disabled="product.quantity > product.stock">
                                    Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- VENTA -->
            <div class="card cart-section">
                <h2 class="section-title">Carrito de venta</h2>

                <div class="sale-details">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Descripción (opcional)</label>
                            <textarea class="input" v-model="saleDescription"
                                placeholder="Ingrese una descripción para esta venta..." rows="3"></textarea>
                        </div>
                    </div>
                </div>

                <div class="cart-table" v-if="cartItems.length">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio unitario</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in cartItems" :key="item.id">
                                <td>
                                    <div>
                                        <strong>{{ item.nombre }}</strong>
                                        <br>
                                        <small class="text-muted">Código: {{ item.codigo }}</small>
                                    </div>
                                </td>
                                <td>${{ Number(item.precio_venta).toFixed(2) }}</td>
                                <td>
                                    <div class="quantity-control">
                                        <button class="btn-quantity" @click="decrementCartItem(item)">-</button>
                                        <input type="number" class="quantity-input" v-model.number="item.cantidad"
                                            min="1" :max="item.stock" @input="updateCartItemSubtotal(item)" />
                                        <button class="btn-quantity" @click="incrementCartItem(item)">+</button>
                                    </div>
                                </td>
                                <td>${{ Number(item.subtotal).toFixed(2) }}</td>
                                <td>
                                    <button class="btn-action btn-delete" @click="removeFromCart(item)"
                                        title="Eliminar">
                                        <TrashIcon style="width: 16px; height: 16px;" />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="empty-cart" v-else>
                    <p class="empty-text">No hay productos en el carrito</p>
                    <p class="empty-subtitle">Busca productos para agregar a la venta</p>
                </div>

                <div class="cart-footer" v-if="cartItems.length">
                    <div class="totals">
                        <div class="total-row">
                            <span class="total-label">Subtotal:</span>
                            <span class="total-value">${{ Number(subtotal).toFixed(2) }}</span>
                        </div>
                        <div class="total-row">
                            <span class="total-label">Total:</span>
                            <span class="total-value total-main">${{ Number(total).toFixed(2) }}</span>
                        </div>
                    </div>
                    <div class="cart-actions">
                        <button class="btn btn-secondary" @click="clearCart">Vaciar carrito</button>
                        <button class="btn btn-primary" @click="processSale" :disabled="!canProcessSale">
                            Procesar venta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import TrashIcon from '@/assets/icons/TrashIcon.vue'
import { SalesApi } from '@/api/salesApi.js'
import { ProductosApi } from '@/api/productosApi.js'
import { simpleAlert, questionAlert } from '@/utils/sweetAlert'

const salesApi = new SalesApi()
const productosApi = new ProductosApi()

const searchInput = ref('')
const products = ref([])
const loading = ref(false)
const cartItems = ref([])
const saleDescription = ref('')

const subtotal = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + Number(item.subtotal), 0)
})

const total = computed(() => {
    return subtotal.value
})

const canProcessSale = computed(() => {
    return cartItems.value.length > 0
})

const onSearchKeypress = async (event) => {
    if (event.key !== 'Enter') return

    const searchTerm = searchInput.value.trim()
    if (!searchTerm) {
        await loadInitialProducts()
        return
    }

    loading.value = true
    try {
        const response = await productosApi.findProductForSales(searchTerm)
        if (response.success && Array.isArray(response.productos)) {
            products.value = response.productos.map(product => ({
                ...product,
                quantity: 1
            }))
        } else {
            products.value = []
        }
    } catch (error) {
        console.error('Error searching products:', error)
        products.value = []
    } finally {
        loading.value = false
    }
}

const clearSearch = async () => {
    searchInput.value = ''
    await loadInitialProducts()
}

const loadInitialProducts = async () => {
    loading.value = true
    try {
        const response = await productosApi.getProductsForSales()
        if (response.success && Array.isArray(response.productos)) {
            products.value = response.productos.map(product => ({
                ...product,
                quantity: 1
            }))
        } else {
            products.value = []
        }
    } catch (error) {
        console.error('Error loading products:', error)
        products.value = []
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await loadInitialProducts()
})

const incrementQuantity = (product) => {
    if (product.quantity < product.stock) {
        product.quantity++
    }
}

const decrementQuantity = (product) => {
    if (product.quantity > 1) {
        product.quantity--
    }
}

const addToCart = (product) => {
    if (product.quantity > product.stock) {
        simpleAlert('Error', 'No hay stock suficiente', 'error')
        return
    }

    const existingItem = cartItems.value.find(item => item.id === product.id)

    if (existingItem) {
        const newQuantity = existingItem.cantidad + product.quantity
        if (newQuantity <= product.stock) {
            existingItem.cantidad = newQuantity
            updateCartItemSubtotal(existingItem)
        } else {
            simpleAlert('Error', 'No hay suficiente stock disponible', 'error')
            return
        }
    } else {
        const newItem = {
            id: product.id,
            nombre: product.nombre,
            codigo: product.codigo,
            precio_venta: product.precio_venta,
            cantidad: product.quantity,
            stock: product.stock,
            subtotal: product.quantity * Number(product.precio_venta)
        }
        cartItems.value.push(newItem)
    }

    product.quantity = 1
}

const incrementCartItem = (item) => {
    if (item.cantidad < item.stock) {
        item.cantidad++
        updateCartItemSubtotal(item)
    }
}

const decrementCartItem = (item) => {
    if (item.cantidad > 1) {
        item.cantidad--
        updateCartItemSubtotal(item)
    }
}

const updateCartItemSubtotal = (item) => {
    item.subtotal = item.cantidad * Number(item.precio_venta)
}

const removeFromCart = (item) => {
    const index = cartItems.value.findIndex(cartItem => cartItem.id === item.id)
    if (index > -1) {
        cartItems.value.splice(index, 1)
    }
}

const clearCart = () => {
    cartItems.value = []
    saleDescription.value = ''
}

const processSale = async () => {
    const result = await questionAlert(
        'Confirmar venta',
        `¿Estás seguro de que deseas procesar esta venta por un total de $${Number(total.value).toFixed(2)}?`,
        'warning'
    )

    if (!result.isConfirmed) return

    const venta = {
        total_venta: total.value,
        descripcion: saleDescription.value.trim() || 'Venta desde panel',
        productos: cartItems.value.map(item => ({
            id: item.id,
            cantidad: item.cantidad,
            subtotal: item.subtotal,
            nombre: item.nombre
        }))
    }

    const response = await salesApi.createSale(venta)

    if (response.success) {
        simpleAlert('Éxito', 'Venta procesada correctamente', 'success')
        clearCart()
        await loadInitialProducts();
    } else {
        simpleAlert('Error', response.message || 'Ocurrió un error al procesar la venta', 'error')
    }
}
</script>

<style scoped>
.sales-page {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 24px;
    width: 100%;
    background-color: #F6F6F8;
    font-family: var(--font-sans);
}

.sales-header {
    margin-bottom: 20px;
    background-color: #FFF;
    padding: 18px;
    border-radius: 6px;
}

.title {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 8px;
}

.subtitle {
    font-size: 16px;
    color: #6b7280;
    margin: 0;
}

.sales-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.search-section,
.cart-section {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 16px;
}

.search-bar {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    align-items: center;
}

.field.with-icon {
    position: relative;
    flex: 1;
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: #6b7280;
}

.spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e5e7eb;
    border-top: 3px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.empty {
    text-align: center;
    padding: 40px;
    color: #6b7280;
}

.products-list {
    max-height: 500px;
    overflow-y: auto;
}

.low-stock {
    color: #dc2626;
    font-weight: 600;
}

.field-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: #6b7280;
}

.input {
    width: 100%;
    padding: 10px 40px 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;
}

.input:focus {
    outline: none;
    border-color: #3b82f6;
}

.results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.results-count {
    font-size: 14px;
    color: #6b7280;
}

.products-grid {
    display: grid;
    gap: 12px;
    max-height: 400px;
    overflow-y: auto;
}

.product-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background: #f9fafb;
}

.product-info {
    flex: 1;
}

.product-name {
    font-weight: 600;
    font-size: 14px;
    margin: 0 0 4px 0;
}

.product-code,
.product-price,
.product-stock {
    font-size: 12px;
    color: #6b7280;
    margin: 2px 0;
}

.product-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.quantity-control {
    display: flex;
    align-items: center;
    gap: 4px;
}

.btn-quantity {
    width: 28px;
    height: 28px;
    border: 1px solid #d1d5db;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    transition: background-color 0.2s;
}

.btn-quantity:hover {
    background-color: #f3f4f6;
}

.quantity-input {
    width: 50px;
    height: 28px;
    text-align: center;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 12px;
}

.sale-details {
    margin-bottom: 20px;
}

.form-row {
    margin-bottom: 16px;
}

.form-group {
    flex: 1;
}

.form-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 6px;
}

.cart-table {
    margin-bottom: 20px;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table th,
.table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
}

.table th {
    font-weight: 600;
    font-size: 14px;
    color: #374151;
    background: #f9fafb;
}

.table td {
    font-size: 14px;
}

.text-muted {
    color: #6b7280;
}

.empty-cart {
    text-align: center;
    padding: 40px 20px;
    color: #6b7280;
}

.empty-text {
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 8px 0;
}

.empty-subtitle {
    font-size: 14px;
    margin: 0;
}

.cart-footer {
    border-top: 1px solid #e5e7eb;
    padding-top: 20px;
}

.totals {
    margin-bottom: 16px;
}

.total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.total-label {
    font-size: 14px;
    color: #374151;
}

.total-value {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
}

.total-main {
    font-size: 18px;
    font-weight: 700;
    color: #1a1a1a;
}

.cart-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-primary {
    background: #3b82f6;
    color: white;
}

.btn-primary:hover {
    background: #2563eb;
}

.btn-primary:disabled {
    background: #9ca3af;
    cursor: not-allowed;
}

.btn-secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
}

.btn-secondary:hover {
    background: #e5e7eb;
}

.btn-sm {
    padding: 6px 12px;
    font-size: 12px;
}

.btn-action {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.btn-action:hover {
    background: #f3f4f6;
}

.btn-delete {
    color: #ef4444;
}

.btn-delete:hover {
    background: #fef2f2;
}

@media (max-width: 1024px) {
    .sales-content {
        grid-template-columns: 1fr;
    }
}
</style>
