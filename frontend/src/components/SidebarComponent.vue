<template>
    <div class="sidebar">
        <div class="sidebar-content">
            <div>
                <h2 class="title">Panel administrativo</h2>
                <p class="sub-title">Sistema de Inventario</p>
            </div>
            <div class="container-link">
                <!-- ESTO DE ROUTERLINK ES PARA MANEAR EL ESTADO DEL BOTON Q VUE LO MANEJA SOLO YA EL ACTIVO/INACTIVO SOLO CON LA CLASE -->
                <RouterLink to="/panel" exact-active-class="activo">
                    <ButtonSidebarComponent titulo="Inicio">
                        <DashboardIcon class="icon" />
                    </ButtonSidebarComponent>
                </RouterLink>

                <RouterLink v-if="userStore.rol.toLowerCase() === 'administrador'" to="/panel/usuarios" active-class="activo">
                    <ButtonSidebarComponent titulo="Usuarios">
                        <UsersIcon class="icon" />
                    </ButtonSidebarComponent>
                </RouterLink>

                <RouterLink v-if="userStore.rol.toLowerCase() === 'administrador' || userStore.rol.toLowerCase() === 'bodega'" to="/panel/productos" active-class="activo">
                    <ButtonSidebarComponent titulo="Productos">
                        <ProductIcon class="icon" />
                    </ButtonSidebarComponent>
                </RouterLink>

                <RouterLink v-if="userStore.rol.toLowerCase() === 'administrador' || userStore.rol.toLowerCase() === 'bodega'" to="/panel/categorias" active-class="activo">
                    <ButtonSidebarComponent titulo="Categorias">
                        <CategoryIcon class="icon" />
                    </ButtonSidebarComponent>
                </RouterLink>

                <RouterLink v-if="userStore.rol.toLowerCase() === 'administrador' || userStore.rol.toLowerCase() === 'bodega'" to="/panel/proveedores" active-class="activo">
                    <ButtonSidebarComponent titulo="Proveedores">
                        <ProveedorIcon class="icon" />
                    </ButtonSidebarComponent>
                </RouterLink>

                <RouterLink v-if="userStore.rol.toLowerCase() === 'administrador' || userStore.rol.toLowerCase() === 'cajero'"  to="/panel/movimientos" active-class="activo">
                    <ButtonSidebarComponent titulo="Movimientos">
                        <MovIcon class="icon" />
                    </ButtonSidebarComponent>
                </RouterLink>

                <RouterLink v-if="userStore.rol.toLowerCase() === 'administrador'"  to="/panel/reportes" active-class="activo">
                    <ButtonSidebarComponent titulo="Reportes">
                        <ReportIcon class="icon" />
                    </ButtonSidebarComponent>
                </RouterLink>
            </div>
        </div>

        <div class="user-section">
            <div class="user-info">
                <div class="user-details">
                    <p class="user-name">{{ userStore.usuario }}</p>
                    <p class="user-email">{{ userStore.correo }}</p>
                    <span class="user-role">{{ userStore.rol }}</span>
                </div>
            </div>
            <button class="logout-button" @click="logout">
                <span>Cerrar sesion</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
            </button>
        </div>
    </div>
</template>
<script setup>
import DashboardIcon from '@/assets/icons/DashboardIcon.vue';
import UsersIcon from '@/assets/icons/UsersIcon.vue';
import CategoryIcon from '@/assets/icons/CategoryIcon.vue';
import ProductIcon from '@/assets/icons/ProductIcon.vue';
import ButtonSidebarComponent from '@/components/ButtonSidebarComponent.vue';
import ProveedorIcon from '@/assets/icons/ProveedorIcon.vue';
import MovIcon from '@/assets/icons/MovIcon.vue';
import ReportIcon from '@/assets/icons/ReportIcon.vue';
import { RouterLink, useRouter } from 'vue-router';
import { useUserStore } from '@/utils/UserStore';
import { UserApi } from '@/api/usersApi';
import { questionAlert, simpleAlert } from '@/utils/sweetAlert';

const userStore = useUserStore();
const router = useRouter();
const userApi = new UserApi();

const logout = () => {
    questionAlert('Cerrar sesion', '¿Estas seguro de que deseas cerrar la sesion?', 'question')
        .then(async (result) => {
            if (!result.isConfirmed) return;
            const response = await userApi.logoutUser();

            if (response) {
                return router.push('/login');
            }
            return simpleAlert('Informacion', 'Parece que ocurrio un error al intentar cerrar la sesion, intenta de nuevo', 'warning')
        })
        .catch(() => simpleAlert('Informacion', 'Parece que ocurrio un error al intentar cerrar la sesion, intenta de nuevo', 'warning'))
}
</script>

<style scoped>
.sidebar {
    width: 100%;
    height: 100vh;
    padding: 24px 16px;
    background-color: var(--color-white);
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    font-family: var(--font-sans);
    overflow-y: auto;
}

.sidebar-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
    overflow-y: auto;
    padding-right: 8px;
}

.title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-primary);
    margin-bottom: 4px;
}

.sub-title {
    font-size: 0.875rem;
    color: var(--color-text-light);
    font-weight: 400;
}

.container-link {
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-top: 1px solid var(--color-border);
    padding-top: 16px;
    margin-top: 8px;
}

.container-link a {
    text-decoration: none;
    color: var(--color-text);
    transition: all 0.2s ease;
    border-radius: 6px;
    padding: 0 8px;
}

.container-link a:hover {
    background-color: var(--color-background);
}

.activo {
    color: var(--color-accent-dark) !important;
    background-color: rgba(52, 152, 219, 0.1) !important;
}

.icon {
    pointer-events: none;
}

.user-section {
    padding: 16px 8px;
    background-color: var(--color-white);
    border-top: 1px solid var(--color-border);
    margin-top: auto;
    width: 100%;
}

.user-info {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    padding: 0 8px;
}

.user-details {
    flex: 1;
    overflow: hidden;
    min-width: 0;
}

.user-name {
    font-weight: 600;
    font-size: 0.9375rem;
    margin: 0 0 2px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--color-text);
}

.user-email {
    margin: 0 0 4px 0;
    font-size: 0.8125rem;
    color: var(--color-text-light);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.user-role {
    display: inline-block;
    background-color: var(--color-info);
    color: var(--color-white);
    font-size: 0.6875rem;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 4px;
    letter-spacing: 0.3px;
}

.logout-button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 12px;
    background-color: var(--color-accent);
    border: 1px solid var(--color-accent);
    border-radius: 6px;
    color: var(--color-white);
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: var(--shadow-sm);
}

.logout-button:hover {
    background-color: var(--color-accent-dark);
    border-color: var(--color-accent-dark);
    transform: translateY(-1px);
    box-shadow: var(--shadow);
}

.logout-button svg {
    stroke: var(--color-white);
    width: 16px;
    height: 16px;
}
</style>