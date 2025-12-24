import { createWebHistory, createRouter } from 'vue-router';
import { UserApi } from '@/api/usersApi.js'
//rutas
import LoginView from '@/views/LoginView.vue';
import LockIcon from '@/assets/icons/LockIcon.vue';
import DashboardView from '@/views/DashboardView.vue';

const userApi = new UserApi();

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginView },
    { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
    // { path: '/:pathMatch(.   *)*', redirect: '/login' }, // Captura cualquier ruta no definida
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})
const userSesion = async () => await userApi.sessionStatus();

router.beforeEach(async (to, from, next) => {
    let activo = await userSesion();
    console.log(activo)
    if (to.meta.requiresAuth && !activo.logIn) {
        return next('/login');
    } else if (to.path === '/login' && activo.logIn) {
        return next('/dashboard');
    }

    next();
})

export default router;