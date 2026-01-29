<template>
    <div class="products-page">
        <div class="products-header">
            <div>
                <h1 class="title">Productos</h1>
                <p class="subtitle">Administra los productos del inventario</p>
            </div>
            <div class="header-actions">
                <button class="btn btn-primary" type="button" @click="openCreate">
                    <PlusIcon style="width: 20px; height: 20px;" />Nuevo producto
                </button>
                <button class="btn btn-secondary" type="button" @click="openUnidades">
                    Gestionar unidades
                </button>
            </div>
        </div>

        <div class="card toolbar">
            <div class="toolbar-left">
                <div class="field with-icon">
                    <input
                        class="input"
                        type="text"
                        v-model="searchInput"
                        placeholder="Buscar por nombre o código"
                        @keypress="onSearchKeypress"
                    />
                    <svg
                        class="field-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>

                <select class="select" v-model="selectedCategory" @change="applyFilters">
                    <option value="">Todas las categorías</option>
                    <option v-for="c in categories" :key="c.id" :value="String(c.id)">{{ c.nombre }}</option>
                </select>

                <select class="select" v-model="selectedStatus" @change="applyFilters">
                    <option value="">Todos</option>
                    <option value="1">Activos</option>
                    <option value="0">Inactivos</option>
                </select>
            </div>
        </div>

        <div class="table-container">
            <div class="table-wrapper">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Stock</th>
                            <th>Stock límite</th>
                            <th>Categoría</th>
                            <th>Estado</th>
                            <th>Cambiar</th>
                            <th class="th-actions">Acciones</th>
                        </tr>
                    </thead>

                    <tbody v-if="filteredProducts.length">
                        <tr v-for="p in filteredProducts" :key="p.id">
                            <td>
                                <span class="pill pill-primary">{{ p.codigo }}</span>
                            </td>
                            <td class="name-cell">{{ p.nombre }}</td>
                            <td>
                                <span class="pill" :class="stockClass(p)">{{ p.stock }}</span>
                            </td>
                            <td>
                                <span class="pill pill-muted">{{ p.stock_limite }}</span>
                            </td>
                            <td class="muted">{{ p.nombre_categoria }}</td>
                            <td>
                                <span class="pill" :class="statusClass(p.estado)">{{ p.estado === 1 ? 'Activo' : 'Inactivo' }}</span>
                            </td>
                            <td>
                                <label class="switch">
                                    <input type="checkbox" :checked="Number(p.estado) === 1" @click.prevent="changeStatus(p)" />
                                    <span class="slider"></span>
                                </label>
                            </td>
                            <td class="row-actions">
                                <button class="btn-action btn-edit" @click="openEdit(p)" title="Editar">
                                    <EditIcon style="width: 16px; height: 16px;" />
                                </button>
                                <button class="btn-action btn-delete" @click="confirmDelete(p)" title="Eliminar">
                                    <TrashIcon style="width: 16px; height: 16px;" />
                                </button>
                            </td>
                        </tr>
                    </tbody>

                    <tbody v-else>
                        <tr>
                            <td colspan="8">
                                <div class="empty">
                                    <p class="empty-title">Sin resultados</p>
                                    <p class="empty-text">Prueba ajustando los filtros</p>
                                    <button class="btn btn-secondary" type="button" @click="resetFilters">Limpiar filtros</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="pagination-container">
                <div class="pagination-info">
                    Página {{ currentPage }} - Mostrando {{ filteredProducts.length }} producto{{ filteredProducts.length !== 1 ? 's' : '' }}
                </div>
                <div class="pagination-controls">
                    <button
                        class="btn-pagination"
                        type="button"
                        @click="changePage(currentPage - 1)"
                        :disabled="currentPage === 1"
                    >
                        <ChevronLeftIcon style="width: 16px; height: 16px;" />
                        Anterior
                    </button>
                    <div class="page-numbers">
                        <button :class="['page-number', { active: true }]" type="button">
                            {{ currentPage }}
                        </button>
                    </div>
                    <button
                        class="btn-pagination"
                        type="button"
                        @click="changePage(currentPage + 1)"
                        :disabled="!hasMoreData"
                    >
                        Siguiente
                        <ChevronRightIcon style="width: 16px; height: 16px;" />
                    </button>
                </div>
            </div>
        </div>

        <ProductModal
            :show="showModal"
            :mode="isEditing ? 'edit' : 'create'"
            :product="selectedProduct"
            :categories="categories"
            :units="units"
            @close="closeModal"
            @submit="handleProductSubmit"
        />

        <UnidadModal
            :show="showUnidadesModal"
            :units="units"
            @close="closeUnidades"
            @create="handleCreateUnidad"
            @delete="handleDeleteUnidad"
        />
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import EditIcon from '@/assets/icons/EditIcon.vue'
import TrashIcon from '@/assets/icons/TrashIcon.vue'
import PlusIcon from '@/assets/icons/PlusIcon.vue'
import ChevronLeftIcon from '@/assets/icons/ChevronLeftIcon.vue'
import ChevronRightIcon from '@/assets/icons/ChevronRightIcon.vue'
import ProductModal from '@/components/ProductModal.vue'
import UnidadModal from '@/components/UnidadModal.vue'
import { questionAlert, simpleAlert } from '@/utils/sweetAlert'
import { ProductosApi } from '@/api/productosApi.js'
import { CategoryApi } from '@/api/categoryApi.js'

const products = ref([])

const categories = ref([])
const units = ref([])

const productosApi = new ProductosApi()
const categoryApi = new CategoryApi()

const searchInput = ref('')
const appliedSearch = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')

const currentPage = ref(1)
const hasMoreData = ref(false)

const showModal = ref(false)
const isEditing = ref(false)
const selectedProduct = ref(null)

const showUnidadesModal = ref(false)

const statusClass = (estado) => {
    if (Number(estado) === 1) return 'pill-success'
    return 'pill-warning'
}

const stockClass = (p) => {
    const stock = Number(p.stock ?? 0)
    const limite = Number(p.stock_limite ?? 0)
    if (stock <= limite) return 'pill-warning'
    return 'pill-success'
}

const filteredProducts = computed(() => {
    const term = appliedSearch.value.trim().toLowerCase()
    const selectedCategoryName = selectedCategory.value
        ? categories.value.find((c) => String(c.id) === String(selectedCategory.value))?.nombre
        : ''

    return products.value.filter((p) => {
        const matchSearch = !term
            ? true
            : String(p.nombre ?? '').toLowerCase().includes(term) || String(p.codigo ?? '').toLowerCase().includes(term)

        const matchCategory = !selectedCategoryName ? true : String(p.nombre_categoria ?? '') === String(selectedCategoryName)

        const matchStatus =
            selectedStatus.value === '' ? true : Number(p.estado) === Number(selectedStatus.value)

        return matchSearch && matchCategory && matchStatus
    })
})

const onSearchKeypress = async (event) => {
    if (event.key !== 'Enter') return

    const searchTerm = event.target.value.trim()

    if (!searchTerm) {
        appliedSearch.value = ''
        currentPage.value = 1
        if (String(selectedCategory.value ?? '').trim()) {
            await loadProductsByCategory(1)
            return
        }
        if (String(selectedStatus.value ?? '').trim()) {
            await loadProductsByStatus(1)
            return
        }
        await loadProducts(1)
        return
    }

    const filter = /^\d+$/.test(searchTerm) ? 'codigo' : 'nombre'
    const searchResults = await productosApi.filterProducts(1, filter, searchTerm)

    appliedSearch.value = searchTerm
    products.value = Array.isArray(searchResults?.productos) ? searchResults.productos : []
    currentPage.value = 1
    hasMoreData.value = false
}

const loadProductsByCategory = async (page) => {
    const categoryId = String(selectedCategory.value ?? '').trim()
    if (!categoryId) {
        await loadProducts(page)
        return
    }

    const request = await productosApi.filterProducts(page, 'categoria', categoryId)
    products.value = Array.isArray(request?.productos) ? request.productos : []
    hasMoreData.value = products.value.length >= 10
}

const loadProductsByStatus = async (page) => {
    const statusValue = String(selectedStatus.value ?? '').trim()
    if (statusValue === '') {
        await loadProducts(page)
        return
    }

    const request = await productosApi.filterProducts(page, 'estado', statusValue)
    products.value = Array.isArray(request?.productos) ? request.productos : []
    hasMoreData.value = products.value.length >= 10
}

const applyFilters = async () => {
    currentPage.value = 1
    if (appliedSearch.value?.trim()) return
    if (String(selectedCategory.value ?? '').trim()) {
        await loadProductsByCategory(1)
        return
    }
    if (String(selectedStatus.value ?? '').trim()) {
        await loadProductsByStatus(1)
        return
    }
    await loadProducts(1)
}

const resetFilters = () => {
    searchInput.value = ''
    appliedSearch.value = ''
    selectedCategory.value = ''
    selectedStatus.value = ''
    currentPage.value = 1
    loadProducts(1)
}

const changePage = async (page) => {
    if (page < 1) return
    if (page === currentPage.value) return
    currentPage.value = page
    if (appliedSearch.value?.trim()) {
        const term = appliedSearch.value.trim();
        const filter = 'nombre';
        const searchResults = await productosApi.filterProducts(page, filter, term);
        products.value = Array.isArray(searchResults?.productos) ? searchResults.productos : [];
        hasMoreData.value = false;
    } else if (String(selectedCategory.value ?? '').trim()) {
        await loadProductsByCategory(page)
    } else if (String(selectedStatus.value ?? '').trim()) {
        await loadProductsByStatus(page)
    } else {
        await loadProducts(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const openCreate = () => {
    isEditing.value = false
    selectedProduct.value = null
    showModal.value = true
}

const openEdit = (p) => {
    isEditing.value = true

    const catId = categories.value.find((c) => String(c.nombre) === String(p.nombre_categoria))?.id
    const unitId = units.value.find((u) => String(u.nombre) === String(p.unidad_medida))?.id

    selectedProduct.value = {
        ...p,
        id_categoria: catId ?? null,
        id_unidad: unitId ?? null
    }
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
}

const openUnidades = () => {
    showUnidadesModal.value = true
}

const closeUnidades = () => {
    showUnidadesModal.value = false
}

const handleProductSubmit = async (payload) => {
    if (isEditing.value && payload.id != null) {
        const request = await productosApi.updateProduct(payload)
        if (request.success) {
            simpleAlert('Éxito', 'El producto fue actualizado correctamente', 'success').then(async () => {
                currentPage.value = 1
                await loadProducts(1)
            })
        } else {
            simpleAlert('Error', request.message ?? 'Ocurrió un problema al intentar actualizar el producto', 'error')
        }
    } else {
        const createPayload = { ...payload }
        delete createPayload.id

        const request = await productosApi.createProduct(createPayload)
        if (request.success) {
            simpleAlert('Éxito', 'El producto fue creado correctamente', 'success').then(async () => {
                currentPage.value = 1
                await loadProducts(1)
            })
        } else {
            simpleAlert('Error', request.message ?? 'Ocurrió un problema al intentar crear el producto', 'error')
        }
    }

    showModal.value = false
}

const confirmDelete = async (p) => {
    const result = await questionAlert(
        'Eliminar producto',
        `¿Estás seguro de que deseas eliminar el producto ${p.nombre}? Esta acción no se puede deshacer.`,
        'warning'
    )

    if (!result.isConfirmed) return

    const request = await productosApi.deleteProduct(p.id)
    if (request.success) {
        simpleAlert('Éxito', 'El producto fue eliminado correctamente', 'success').then(async () => {
            currentPage.value = 1
            await loadProducts(1)
        })
    } else {
        simpleAlert('Error', request.message ?? 'Ocurrió un problema al intentar eliminar el producto', 'error')
    }
}

const changeStatus = (p) => {
    questionAlert(
        'Cambiar estado',
        `¿Estás seguro de que deseas ${Number(p.estado) === 1 ? 'desactivar' : 'activar'} el producto ${p.nombre}?`,
        'warning'
    ).then(async (result) => {
        if (!result.isConfirmed) return

        const newState = Number(p.estado) === 1 ? 'inactivo' : 'activo'
        const request = await productosApi.changeStatusApi(newState, p.id)

        if (request.success) {
            currentPage.value = 1
            await loadProducts(1)
            return
        }

        return simpleAlert('Error', request.message ?? 'Ocurrió un problema al intentar actualizar el estado', 'error')
    })
}

const loadCategories = async () => {
    const request = await categoryApi.getCategories(1)
    if (!request?.success || !Array.isArray(request?.categorias)) {
        categories.value = []
        return
    }

    categories.value = request.categorias.map((c) => ({ id: c.id, nombre: c.nombre }))
}

const loadUnidades = async () => {
    const request = await productosApi.getUnidades()
    if (!request?.success || !Array.isArray(request?.unidades)) {
        units.value = []
        return
    }

    units.value = request.unidades
}

const handleCreateUnidad = async (nombreUnidad) => {
    const request = await productosApi.createUnidad(nombreUnidad)

    if (request.success) {
        await loadUnidades()
        return simpleAlert('Éxito', 'Unidad creada', 'success')
    }

    return simpleAlert('Error', request.message ?? 'Ocurrió un problema al crear la unidad', 'error')
}

const handleDeleteUnidad = async (unidad) => {
    const result = await questionAlert(
        'Eliminar unidad',
        `¿Estás seguro de que deseas eliminar la unidad ${unidad.nombre}? Esta acción no se puede deshacer.`,
        'warning'
    )

    if (!result.isConfirmed) return

    const request = await productosApi.deleteUnidad(unidad.id)

    if (request.success) {
        await loadUnidades()
        return simpleAlert('Éxito', 'Unidad eliminada', 'success')
    }

    return simpleAlert('Error', request.message ?? 'Ocurrió un problema al eliminar la unidad', 'error')
}

const loadProducts = async (pagina) => {
    const request = await productosApi.getProducts(pagina)

    if (!request?.success || !Array.isArray(request?.productos)) {
        products.value = []
        hasMoreData.value = false
        return
    }

    products.value = request.productos
    hasMoreData.value = request.productos.length >= 10
}

onMounted(async () => {
    await loadCategories()
    await loadUnidades()
    await loadProducts(1)
})
</script>

<style scoped>
.products-page {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 24px;
    width: 100%;
    background-color: #F6F6F8;
    font-family: var(--font-sans);
}

.products-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
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

.card {
    background-color: var(--color-white);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    box-shadow: var(--shadow-sm);
}

.toolbar {
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.toolbar-left {
    display: grid;
    grid-template-columns: 1fr 220px 160px;
    gap: 12px;
    align-items: center;
    flex: 1;
}

.field {
    position: relative;
}

.field.with-icon .input {
    padding-left: 40px;
}

.field-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: var(--color-text-light);
}

.table-container {
    background-color: var(--color-white);
    border-radius: 8px;
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    text-align: center;
    margin-bottom: 24px;
    overflow-x: auto;
}

.table-wrapper {
    width: 100%;
    border-collapse: collapse;
}

.table {
    width: 100%;
    text-align: center;
    border-collapse: collapse;
}

.table th,
.table td {
    padding: 12px;
    border-bottom: 1px solid var(--color-border);
    color: var(--color-text);
    text-align: center;
}

.table thead th {
    font-size: 0.875rem;
    font-weight: 600;
    background-color: var(--color-background);
    color: var(--color-text);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.table tbody tr:hover {
    background: var(--color-background);
}

.th-actions {
    width: 120px;
}

.row-actions {
    display: flex;
    gap: 8px;
    justify-content: center;
}

.name-cell {
    text-align: left;
}

.muted {
    color: var(--color-text-light);
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.pill {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 0.75rem;
    color: var(--color-text);
    background: var(--color-background);
}

.pill-primary {
    background: rgba(52, 152, 219, 0.15);
    color: var(--color-accent-dark);
}

.pill-muted {
    background-color: rgba(149, 165, 166, 0.1);
    color: #7f8c8d;
    font-weight: 600;
}

.pill-success {
    background: rgba(46, 204, 113, 0.15);
    color: #1e8e3e;
    font-weight: 600;
}

.pill-warning {
    background-color: rgba(149, 165, 166, 0.1);
    font-weight: 600;
    color: #7f8c8d;
}

.switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background: var(--color-border);
    transition: .2s;
    border-radius: 999px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    top: 3px;
    background: var(--color-white);
    transition: .2s;
    border-radius: 50%;
    box-shadow: var(--shadow-sm);
}

.switch input:checked + .slider {
    background: var(--color-accent);
}

.switch input:checked + .slider:before {
    transform: translateX(20px);
}

.empty {
    padding: 18px;
    text-align: center;
}

.empty-title {
    font-weight: 700;
    color: var(--color-primary);
}

.empty-text {
    margin-top: 6px;
    color: var(--color-text-light);
    margin-bottom: 10px;
}

.pagination-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--color-white);
    padding: 20px 24px;
    border-radius: 8px;
    box-shadow: var(--shadow-sm);
    flex-wrap: wrap;
    gap: 16px;
}

.pagination-info {
    font-size: 0.9375rem;
    color: var(--color-text-light);
}

.pagination-controls {
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-pagination {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border: 1px solid var(--color-border);
    background-color: var(--color-white);
    color: var(--color-text);
    border-radius: 6px;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-pagination:hover:not(:disabled) {
    background-color: var(--color-background);
    border-color: var(--color-accent);
}

.btn-pagination:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-numbers {
    display: flex;
    gap: 4px;
}

.page-number {
    min-width: 40px;
    height: 40px;
    padding: 0 12px;
    border: 1px solid var(--color-border);
    background-color: var(--color-white);
    color: var(--color-text);
    border-radius: 6px;
    font-size: 0.9375rem;
    cursor: pointer;
}

.page-number.active {
    background-color: var(--color-accent);
    color: var(--color-white);
    border-color: var(--color-accent);
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

.btn-secondary {
    padding: 12px 24px;
    border: 1px solid var(--color-border);
    background-color: var(--color-white);
    color: var(--color-text);
    border-radius: 6px;
    font-weight: 500;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-secondary:hover {
    background-color: var(--color-background);
    border-color: var(--color-text-light);
}

.btn-action {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: transparent;
}

.btn-edit {
    color: var(--color-accent);
}

.btn-edit:hover {
    background-color: rgba(52, 152, 219, 0.1);
}

.btn-delete {
    color: var(--color-error);
}

.btn-delete:hover {
    background-color: rgba(231, 76, 60, 0.1);
}

.input,
.select {
    width: 100%;
    height: 40px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 8px 12px;
    background: var(--color-white);
    color: var(--color-text);
    outline: none;
}

.select {
    cursor: pointer;
}

@media (max-width: 920px) {
    .toolbar-left {
        grid-template-columns: 1fr;
    }
}
</style>
