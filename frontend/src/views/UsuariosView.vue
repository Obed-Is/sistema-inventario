<template>
    <div class="usuarios-container">
        <div class="header">
            <div class="header-content">
                <h1 class="page-title">Gestion de Usuarios</h1>
                <p class="page-subtitle">Administra los usuarios del sistema</p>
            </div>
            <button class="btn-primary" @click="openModal('create')">
                <PlusIcon style="width: 20px; height: 20px;" />
                Nuevo Usuario
            </button>
        </div>

        <!-- <div class="filters-section">
            <div class="search-box">
                <SearchIcon class="search-icon" style="width: 18px; height: 18px;" />
                <input type="text" v-model="searchQuery" placeholder="Buscar por nombre o email..." class="search-input"
                    @input="handleSearch" />
            </div>
            <div class="filter-group">
                <select v-model="filterRole" @change="applyFilters" class="filter-select">
                    <option value="">Todos los roles</option>
                    <option value="administrador">Administrador</option>
                    <option value="bodega">Bodega</option>
                    <option value="ventas">Ventas</option>
                </select>
                <select v-model="filterStatus" @change="applyFilters" class="filter-select">
                    <option value="">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                </select>
            </div>
        </div> -->

        <div class="table-container">
            <table class="users-table">
                <thead>
                    <tr>
                        <th>Nombre Completo</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Fecha de creación</th>
                        <th>Última Actualización</th>
                        <th class="actions-column">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="paginatedUsers.length === 0">
                        <td colspan="8" class="empty-state">
                            <p>No se encontraron usuarios</p>
                        </td>
                    </tr>
                    <tr v-for="user in paginatedUsers" :key="user.id" class="table-row">
                        <td class="name-cell">
                            <span>{{ user.nombre }}</span>
                        </td>
                        <td>{{ user.correo }}</td>
                        <td>{{ user.telefono || 'N/A' }}</td>
                        <td>
                            <span :class="['role-badge', `role-${(user.nombre_rol || '').toLowerCase()}`]">
                                {{ user.nombre_rol || 'N/A' }}
                            </span>
                        </td>
                        <td>
                            <span
                                :class="['status-badge', (user.estado === 1 || user.estado === '1') ? 'status-active' : 'status-inactive']">
                                {{ (user.estado === 1 || user.estado === '1') ? 'Activo' : 'Inactivo' }}
                            </span>
                        </td>
                        <td>{{ formatDate(user.create_at) }}</td>
                        <td>{{ formatDate(user.update_at) }}</td>
                        <td class="actions-cell">
                            <button class="btn-action btn-edit" @click="openModal('edit', user)" title="Editar">
                                <EditIcon style="width: 16px; height: 16px;" />
                            </button>
                            <button class="btn-action btn-delete" @click="confirmDelete(user)" title="Eliminar">
                                <TrashIcon style="width: 16px; height: 16px;" />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="pagination-container">
            <div class="pagination-info">
                Página {{ currentPage }} - Mostrando {{ users.length }} usuario{{ users.length !== 1 ? 's' : '' }}
            </div>
            <div class="pagination-controls">
                <button class="btn-pagination" @click="changePage(currentPage - 1)"
                    :disabled="currentPage === 1 || loading">
                    <ChevronLeftIcon style="width: 16px; height: 16px;" />
                    Anterior
                </button>
                <div class="page-numbers">
                    <button :class="['page-number', { active: true }]">
                        {{ currentPage }}
                    </button>
                </div>
                <button class="btn-pagination" @click="changePage(currentPage + 1)" :disabled="!hasMoreData || loading">
                    Siguiente
                    <ChevronRightIcon style="width: 16px; height: 16px;" />
                </button>
            </div>
        </div>

        <UsuarioModal :show="showModal" :mode="modalMode" :user="selectedUser" @close="closeModal"
            @submit="handleSubmit" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { questionAlert, simpleAlert } from '@/utils/sweetAlert';
import PlusIcon from '@/assets/icons/PlusIcon.vue';
import SearchIcon from '@/assets/icons/SearchIcon.vue';
import EditIcon from '@/assets/icons/EditIcon.vue';
import TrashIcon from '@/assets/icons/TrashIcon.vue';
import ChevronLeftIcon from '@/assets/icons/ChevronLeftIcon.vue';
import ChevronRightIcon from '@/assets/icons/ChevronRightIcon.vue';
import UsuarioModal from '@/components/UsuarioModal.vue';
import { UserApi } from '@/api/usersApi';


const userApi = new UserApi();
const router = useRouter();
const searchQuery = ref('');
const filterRole = ref('');
const filterStatus = ref('');
const showModal = ref(false);
const modalMode = ref('create');
const selectedUser = ref(null);
const currentPage = ref(1);
const users = ref([]);
const hasMoreData = ref(true);
const loading = ref(false);

const paginatedUsers = computed(() => {
    return users.value;
});

const handleSearch = () => {
    currentPage.value = 1;
    loadUsers(1);
};

const applyFilters = () => {
    currentPage.value = 1;
    loadUsers(1);
};

const changePage = async (page) => {
    if (page >= 1 && page !== '...' && !loading.value) {
        if (page === currentPage.value) return;
        currentPage.value = page;
        await loadUsers(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const openModal = (mode, user = null) => {
    modalMode.value = mode;
    selectedUser.value = user;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    selectedUser.value = null;
};

const handleSubmit = async (formData) => {
    try {
        if (modalMode.value === 'create') {
            const newUser = {
                nombre: formData.nombre,
                contrasena: formData.password,
                correo: formData.email,
                telefono: formData.telefono,
                rol: formData.rol.charAt(0).toUpperCase() + formData.rol.slice(1),
            };

            const request = await userApi.createUserApi(newUser);
            if (request.success) {
                simpleAlert('Éxito', 'Usuario creado correctamente', 'success').then(() => {
                    currentPage.value = 1;
                    loadUsers(currentPage.value);
                });
            } else {
                if (request.message && request.message.toLowerCase().includes('duplicado')) {
                    simpleAlert('Algo salio mal', 'El correo electronico o telefono del usuario ya estan registrados, ingrese uno diferente', 'error');
                } else {
                    simpleAlert('Algo salio mal', request.message || 'Error al crear usuario', 'error');
                }
            }
        } else {
            const userUpdate = {
                nombre: formData.nombre,
                contrasena: formData.password,
                correo: formData.email,
                telefono: formData.telefono,
                rol: formData.rol.charAt(0).toUpperCase() + formData.rol.slice(1),
                estado: (formData.estado === 'activo') ? 1 : 0
            };
            const response = await userApi.updateUserApi(formData.id, userUpdate);

            if (response && response.accessDenied) {
                await simpleAlert('Acceso Denegado', 'No tienes permisos para acceder a esta sección', 'warning');
                router.push('/panel');
                return;
            }

            if (response.success) {
                simpleAlert('Éxito', 'Usuario actualizado correctamente', 'success').then(() => {
                    loadUsers(1)
                    currentPage.value = 1
                })
            } else {
                if (response.message.toLowerCase() == 'usuario duplicado') {
                    simpleAlert('Algo salio mal', 'El correo electronico o telefono del usuario ya estan registrados, ingrese uno diferente', 'error');
                } else {
                    simpleAlert('Error', 'Ocurrio un problema al actualizar, vuelve a intentarlo de nuevo', 'error');
                }
            }
        }
        closeModal();
    } catch (error) {
        await simpleAlert('Error', 'Ocurrio un error al guardar el usuario', 'error');
    }
};

const confirmDelete = async (user) => {
    const result = await questionAlert(
        'Eliminar Usuario',
        `¿Estás seguro de que deseas eliminar a ${user.nombre}? Esta accion no se puede deshacer.`,
        'warning'
    );
    console.log(user)
    if (result.isConfirmed) {
        const request = await userApi.deleteUserApi(user.id);

        if (request && request.accessDenied) {
            await simpleAlert('Acceso Denegado', 'No tienes permisos para hacer esta accion', 'warning');
            router.push('/panel');
            return;
        }

        if (request.success) {
            simpleAlert('Éxito', 'El usuario fue eliminado correctamente', 'success').then(() => {
                currentPage.value = 1;
                loadUsers(1)
            })
        } else {
            simpleAlert('Error', 'Ocurrio un problema al intentar eliminar el usuario, vuelve a intentarlo de nuevo', 'error');
        }
    }
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return 'N/A';
    }
};

const loadUsers = async (page = 1) => {
    loading.value = true;
    try {
        const response = await userApi.getUsersApi(page);

        // Si hay acceso denegado, redirigir al panel principal
        if (response && response.accessDenied) {
            await simpleAlert('Acceso Denegado', 'No tienes permisos para acceder a esta sección', 'warning');
            router.push('/panel');
            return;
        }

        if (response && response.users) {
            users.value = response.users;
            hasMoreData.value = response.users.length >= 5;
        } else if (response && Array.isArray(response)) {
            users.value = response;
            hasMoreData.value = response.length >= 5;
        } else {
            users.value = [];
            hasMoreData.value = false;
        }
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        users.value = [];
        hasMoreData.value = false;
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    await loadUsers(1);
});
</script>

<style scoped>
.usuarios-container {
    padding: 24px;
    width: 100%;
    background-color: #F6F6F8;
    font-family: var(--font-sans);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    background-color: var(--color-white);
    padding: 24px;
    border-radius: 8px;
    box-shadow: var(--shadow-sm);
}

.header-content {
    flex: 1;
}

.page-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--color-primary);
    margin: 0 0 4px 0;
}

.page-subtitle {
    font-size: 0.9375rem;
    color: var(--color-text-light);
    margin: 0;
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
    background-color: var(--color-accent-dark);
    transform: translateY(-1px);
    box-shadow: var(--shadow);
}

.btn-primary svg {
    stroke: var(--color-white);
}

.filters-section {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    background-color: var(--color-white);
    padding: 20px;
    border-radius: 8px;
    box-shadow: var(--shadow-sm);
    flex-wrap: wrap;
}

.search-box {
    flex: 1;
    min-width: 250px;
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 12px;
    color: var(--color-text-light);
    pointer-events: none;
}

.search-input {
    width: 100%;
    padding: 10px 12px 10px 38px;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 0.9375rem;
    outline: none;
    transition: all 0.2s ease;
    background-color: var(--color-background);
}

.search-input:focus {
    border-color: var(--color-accent);
    background-color: var(--color-white);
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.filter-group {
    display: flex;
    gap: 12px;
}

.filter-select {
    padding: 10px 12px;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 0.9375rem;
    outline: none;
    background-color: var(--color-white);
    color: var(--color-text);
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 150px;
}

.filter-select:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.table-container {
    background-color: var(--color-white);
    border-radius: 8px;
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    margin-bottom: 24px;
    overflow-x: auto;
}

.users-table {
    width: 100%;
    border-collapse: collapse;
}

.users-table thead {
    background-color: var(--color-background);
}

.users-table th {
    padding: 12px;
    text-align: left;
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--color-text);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid var(--color-border);
}

.users-table td {
    padding: 8px 12px;
    border-bottom: 1px solid var(--color-border);
    font-size: 0.9375rem;
    color: var(--color-text);
}

.table-row:hover {
    background-color: var(--color-background);
}

.name-cell {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.name-cell span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
}

.role-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.8125rem;
    font-weight: 500;
    text-transform: capitalize;
}

.role-administrador {
    background-color: rgba(231, 76, 60, 0.1);
    color: #c0392b;
}

.role-bodega {
    background-color: rgba(52, 152, 219, 0.1);
    color: #2980b9;
}

.role-ventas {
    background-color: rgba(46, 204, 113, 0.1);
    color: #27ae60;
}

.status-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.8125rem;
    font-weight: 500;
    text-transform: capitalize;
}

.status-active {
    background-color: rgba(46, 204, 113, 0.1);
    color: #27ae60;
}

.status-inactive {
    background-color: rgba(149, 165, 166, 0.1);
    color: #7f8c8d;
}

.actions-column {
    text-align: center;
    width: 120px;
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

.empty-state {
    text-align: center;
    padding: 48px;
    color: var(--color-text-light);
}

.empty-state p {
    margin: 0;
    font-size: 1rem;
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


@media (max-width: 1024px) {
    .form-row {
        grid-template-columns: 1fr;
    }

    .filters-section {
        flex-direction: column;
    }

    .search-box {
        min-width: 100%;
    }

    .filter-group {
        width: 100%;
    }

    .filter-select {
        flex: 1;
    }
}

@media (max-width: 768px) {
    .usuarios-container {
        padding: 16px;
    }

    .header {
        flex-direction: column;
        gap: 16px;
    }

    .users-table {
        font-size: 0.875rem;
    }

    .users-table th,
    .users-table td {
        padding: 12px 8px;
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
