import { createWebHistory, createRouter } from 'vue-router';

//rutas
import LoginView from '@/views/LoginView.vue';
import LockIcon from '@/assets/icons/LockIcon.vue';
import DashboardView from '@/views/DashboardView.vue';

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginView },
    { path: '/dashboard', component: DashboardView },
    // { path: '/:pathMatch(.*)*', redirect: '/login' }, // Captura cualquier ruta no definida
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})