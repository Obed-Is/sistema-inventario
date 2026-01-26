<template>
    <div class="categories-page">
        <div class="categories-header">
            <div>
                <h1 class="title">Categorías</h1>
                <p class="subtitle">Administra las categorías para organizar tus productos</p>
            </div>
            <div class="header-actions">
                <button class="btn btn-primary" type="button" @click="openCreate">
                    <PlusIcon style="width: 20px; height: 20px;" />Nueva categoría
                </button>
            </div>
        </div>

        <div class="stats">
            <div class="stat-card">
                <p class="stat-label">Categorias totales</p>
                <p class="stat-value">{{ categoriesCount }}</p>
            </div>
            <div class="stat-card">
                <p class="stat-label">Categorias activas</p>
                <p class="stat-value">{{ categoriesActives }}</p>
            </div>
            <div class="stat-card">
                <p class="stat-label">Categorias inactivas</p>
                <p class="stat-value">{{ categoriesInactives }}</p>
            </div>
        </div>

        <div class="card toolbar">
            <div class="toolbar-left">
                <div class="field with-icon">
                    <input class="input" type="text" v-model="filterInput" placeholder="Buscar por nombre" @keypress="filterCategory" />
                    <svg class="field-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>

            </div>
        </div>

        <div class="table-container">
            <div class="table-wrapper">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Categoría</th>
                            <th>Descripción</th>
                            <th>Productos</th>
                            <th></th>
                            <th>Cambiar estado</th>
                            <th class="th-actions">Acciones</th>
                        </tr>
                    </thead>

                    <tbody v-if="categories.length">
                        <tr v-for="c in categories" :key="c.id">
                            <td>
                                <div class="category-cell">
                                    <div class="category-meta">
                                        <p class="category-name">{{ c.nombre }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="muted">{{ c.descripcion }}</td>
                            <td>
                                <span class="pill pill-primary">{{ c.total_productos }}</span>
                            </td>
                            <td>
                                <span class="pill" :class="statusClass(c.estado)">{{ c.estado }}</span>
                            </td>
                            <td>
                                <!-- Switch demo para cambiar estado -->
                                <label class="switch">
                                    <input type="checkbox" :checked="c.estado.toLowerCase() === 'activa'"
                                        @click.prevent="changeStatus(c)" />
                                    <span class="slider"></span>
                                </label>
                            </td>
                            <td class="row-actions">
                                <button class="btn-action btn-edit" @click="openEdit(c)" title="Editar">
                                    <EditIcon style="width: 16px; height: 16px;" />
                                </button>
                                <button class="btn-action btn-delete" @click="confirmDelete(c)" title="Eliminar">
                                    <TrashIcon style="width: 16px; height: 16px;" />
                                </button>
                            </td>
                        </tr>
                    </tbody>

                    <tbody v-else>
                        <tr>
                            <td colspan="6">
                                <div class="empty">
                                    <p class="empty-title">Sin resultados</p>
                                    <p class="empty-text">Prueba ajustando la búsqueda</p>
                                    <button class="btn btn-secondary" type="button" @click="resetFilters">Limpiar
                                        filtros</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="pagination-container">
                <div class="pagination-info">
                    Página {{ currentPage }} - Mostrando {{ categories.length }} categoría{{
                        categories.length !== 1 ? 's' : '' }}
                </div>
                <div class="pagination-controls">
                    <button class="btn-pagination" type="button" @click="changePage(currentPage - 1)"
                        :disabled="currentPage === 1">
                        <ChevronLeftIcon style="width: 16px; height: 16px;" />
                        Anterior
                    </button>
                    <div class="page-numbers">
                        <button :class="['page-number', { active: true }]" type="button">
                            {{ currentPage }}
                        </button>
                    </div>
                    <button class="btn-pagination" type="button" @click="changePage(currentPage + 1)"
                        :disabled="!hasMoreData">
                        Siguiente
                        <ChevronRightIcon style="width: 16px; height: 16px;" />
                    </button>
                </div>
            </div>
        </div>

        <CategoryModal :show="showModal" :mode="isEditing ? 'edit' : 'create'" :category="selectedCategory"
            @close="closeModal" @submit="handleCategorySubmit" />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import EditIcon from '@/assets/icons/EditIcon.vue';
import TrashIcon from '@/assets/icons/TrashIcon.vue';
import PlusIcon from '@/assets/icons/PlusIcon.vue';
import ChevronLeftIcon from '@/assets/icons/ChevronLeftIcon.vue';
import ChevronRightIcon from '@/assets/icons/ChevronRightIcon.vue';
import CategoryModal from '@/components/CategoryModal.vue';
import { questionAlert, simpleAlert } from '@/utils/sweetAlert';
import { CategoryApi } from '@/api/categoryApi.js';
import { useRouter } from 'vue-router';

const categories = ref([])
const categoriesCount = ref(0);
const categoriesActives = ref(0);
const categoriesInactives = ref(0);
const currentPage = ref(1);
const hasMoreData = ref(false);
const categoryApi = new CategoryApi();
const router = useRouter();
const filterInput = ref();

const resetFilters = async () => {
    currentPage.value = 1;
    filterInput.value = '';
    await loadCategories(currentPage.value);
}

const changePage = async (page) => {
    if (page >= 1 && page !== '...') {
        if (page === currentPage.value) return;
        currentPage.value = page;
        await loadCategories(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

const statusClass = (status) => {
    if (status.toLowerCase() === 'activa') return 'pill-success'
    if (status.toLowerCase() === 'inactiva') return 'pill-warning'
    return ''
}

const showModal = ref(false)
const isEditing = ref(false)
const selectedCategory = ref(null)

const openCreate = () => {
    isEditing.value = false
    selectedCategory.value = null
    showModal.value = true
}

const openEdit = (c) => {
    isEditing.value = true
    selectedCategory.value = { ...c }
    showModal.value = true
}

const closeModal = () => { showModal.value = false }

const confirmDelete = async (categoria) => {
    const result = await questionAlert(
        'Eliminar categoria',
        `¿Estás seguro de que deseas eliminar la categoria ${categoria.nombre}? Esta accion no se puede deshacer.`,
        'warning'
    );

    if (result.isConfirmed) {
        const request = await categoryApi.deleteCategory(categoria.id);

        if (request && request.accessDenied) {
            await simpleAlert('Acceso Denegado', 'No tienes permisos para hacer esta accion', 'warning');
            router.push('/panel');
            return;
        }

        if (request.success) {
            simpleAlert('Éxito', 'La categoria fue eliminada correctamente', 'success').then(() => {
                currentPage.value = 1;
                loadCategories(1);
            })
        } else {
            simpleAlert('Error', 'Ocurrio un problema al intentar eliminar la categoria, vuelve a intentarlo de nuevo', 'error');
        }
    }
};

const changeStatus = (categoria) => {
    questionAlert('Cambiar estado', `¿Estás seguro de que deseas cambiar el estado de la categoria ${categoria.nombre}?`, 'warning')
        .then(async (result) => {
            if (result.isConfirmed) {
                const newState = categoria.estado.toLowerCase() === 'activa' ? 'inactivo' : 'activo';
                const request = await categoryApi.changeStatusApi(newState, categoria.id);

                if (request.success) {
                    currentPage.value = 1;
                    await loadCategories(1);
                    return;
                }

                return simpleAlert('Error', 'Ocurrio un problema al intentar actualizar el estado, intenta de nuevo', 'error')
            }
        });
}

const filterCategory = async (event) => {
    if (event.key === 'Enter') {
        const searchTerm = event.target.value.trim();

        if (!searchTerm) {
            currentPage.value = 1;
            await loadCategories(1);
            return;
        }

        const searchResults = await categoryApi.searchCategoryApi(searchTerm);
        categories.value = Array.isArray(searchResults.categorias) ? normalizeFromApi(searchResults.categorias) : [];

        currentPage.value = 1;
        hasMoreData.value = false;
    }
}

const handleCategorySubmit = async (payload) => {
    if (isEditing.value && payload.id != null) {
        const request = await categoryApi.updateCategory(payload);

        if (request.success) {
            simpleAlert('Éxito', 'La categoria fue actualizada correctamente', 'success').then(() => {
                currentPage.value = 1;
                loadCategories(1);
            })
        } else if (request.message.toLowerCase() == 'categoria duplicada') {
            simpleAlert('Advertencia', 'El nombre de esta categoria ya existe, vuelve a ingresar uno diferente', 'warning');
        } else {
            simpleAlert('Error', 'Ocurrio un problema al intentar actualizar la categoria, vuelve a intentarlo de nuevo', 'error');
        }
    } else {
        delete payload.id;
        const request = await categoryApi.cretateCategory(payload);

        if (request.success) {
            simpleAlert('Éxito', 'La categoria fue creada correctamente', 'success').then(() => {
                currentPage.value = 1;
                loadCategories(1);
            })
        } else if (request.message.toLowerCase() == 'categoria duplicada') {
            simpleAlert('Advertencia', 'Esta categoria ya existe, vuelve a ingresar una diferente', 'warning');
        } else if (request.message.toLowerCase() == 'Campos incompletos o invalidos') {
            simpleAlert('Error', 'Los valores ingresados no son validos, intenta nuevamente', 'error');
        } else {
            simpleAlert('Error', 'Ocurrio un problema al intentar crear la categoria, vuelve a intentarlo de nuevo', 'error');
        }
    }

    showModal.value = false
}

const normalizeFromApi = (rows) =>
    rows.map((r) => ({
        id: r.id,
        nombre: r.nombre,
        descripcion: r.descripcion,
        total_productos: Number(r.total_productos ?? 0),
        estado: String(r.estado) === '1' ? 'Activa' : 'Inactiva'
    }))

const loadCategories = async (pagina) => {
    try {
        const request = await categoryApi.getCategories(pagina);
        hasMoreData.value = request.categorias.length >= 5;

        if (!request?.success || !Array.isArray(request?.categorias)) return;

        categories.value = normalizeFromApi(request.categorias);
        categoriesActives.value = request.activas;
        categoriesInactives.value = request.inactivas;
        categoriesCount.value = request.total;
        return categories.value
    } catch (err) {
        console.log(err);
        return;
    }
}

onMounted(() => {
    loadCategories(1)
})
</script>

<style scoped>
.categories-page {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 24px;
    width: 100%;
    background-color: #F6F6F8;
    font-family: var(--font-sans);
}

.categories-header {
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

.stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
}

.stat-card {
    background: var(--color-white);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    box-shadow: var(--shadow-sm);
    padding: 12px 14px;
}

.stat-label {
    font-size: 0.8rem;
    color: var(--color-text-light);
}

.stat-value {
    margin-top: 6px;
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--color-text);
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
    grid-template-columns: 1fr 200px 160px;
    gap: 12px;
    align-items: center;
    flex: 1;
}

.toolbar-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    flex-wrap: wrap;
}

.results {
    font-size: 0.9rem;
    color: var(--color-text-light);
}

.card {
    background-color: var(--color-white);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    box-shadow: var(--shadow-sm);
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

.table-card {
    padding: 12px;
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
    text-align: left;
    padding: 12px;
    border-bottom: 1px solid var(--color-border);
    color: var(--color-text);
    text-align: center;
}

.table thead th {
    font-size: 0.875rem;
    text-align: left;
    font-weight: 600;
    background-color: var(--color-background);
    color: var(--color-text);
    text-transform: uppercase;
    text-align: center;
    letter-spacing: 0.5px;
}

.table tbody tr:hover {
    text-align: center;
    background: var(--color-background);
}


.row-actions {
    display: flex;
    gap: 8px;
}


.category-hint {
    font-size: 0.8rem;
    color: var(--color-text-light);
}

.muted {
    color: var(--color-text-light);
     max-width: 250px;
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

.empty {
    padding: 18px;
    text-align: center;
}


.table-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 4px 0;
}

.footer-text {
    color: var(--color-text-light);
    font-size: 0.9rem;
}

.pagination {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: flex-end;
    padding: 12px 4px 4px;
}

.page-btn,
.page-number {
    height: 34px;
    min-width: 34px;
    padding: 0 10px;
    background: var(--color-white);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    color: var(--color-text);
    cursor: pointer;
}

.page-number.active {
    background: var(--color-accent);
    color: var(--color-white);
    border-color: var(--color-accent);
}

/* Switch (demo) */
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

.switch input:checked+.slider {
    background: var(--color-accent);
}

.switch input:checked+.slider:before {
    transform: translateX(20px);
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
    transition: all 0.2s ease;
}

.page-number:hover:not(.active) {
    background-color: var(--color-background);
    border-color: var(--color-accent);
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


.input,
.select {
    width: 100%;
    height: 40px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 8px 12px;
    background: var(--color-white);
    color: var(--color-text);
}

.field {
    position: relative;
}

.with-icon .input {
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

.icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 8px;
    border: 1px solid var(--color-border);
    background: var(--color-white);
    color: var(--color-text);
    cursor: pointer;
}

.icon-button:hover {
    background: var(--color-background);
}

.icon-button.danger {
    color: var(--color-error);
    border-color: var(--color-error);
    background: rgba(231, 76, 60, 0.08);
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 24px;
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.modal {
    width: 95vw;
    max-width: 680px;
    background: var(--color-white);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    box-shadow: var(--shadow);
    overflow: hidden;
}

.modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 16px 16px 8px;
    border-bottom: 1px solid var(--color-border);
}

.modal-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-primary);
}

.modal-subtitle {
    margin-top: 4px;
    color: var(--color-text-light);
    font-size: 0.9rem;
}

.modal-body {
    padding: 16px;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.form-field.full {
    grid-column: 1 / -1;
}

.form-field .label {
    display: inline-block;
    margin-bottom: 6px;
    color: var(--color-text);
    font-size: 0.9rem;
}

.modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid var(--color-border);
}

@media (max-width: 720px) {
    .stats {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .toolbar {
        flex-direction: column;
        align-items: stretch;
    }

    .toolbar-left {
        grid-template-columns: 1fr;
    }

    .form-grid {
        grid-template-columns: 1fr;
    }

    .form-field.full {
        grid-column: auto;
    }

    .pagination-container {
        flex-direction: column;
        align-items: stretch;
    }

    .pagination-controls {
        justify-content: center;
        flex-wrap: wrap;
    }
}
</style>
