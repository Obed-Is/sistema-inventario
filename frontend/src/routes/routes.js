import { createWebHistory, createRouter } from 'vue-router';
import { UserApi } from '@/api/usersApi.js'
import { useUserStore } from '@/utils/UserStore.js';
//rutas
import LoginView from '@/views/LoginView.vue';
import DashboardLayout from '@/views/DashboardLayout.vue';
import InicioView from '@/views/InicioView.vue';
import UsuariosView from '@/views/UsuariosView.vue';

const userApi = new UserApi();

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginView },
    {
        path: '/panel', component: DashboardLayout,
        meta: { requiresAuth: true },
        children: [
            { path: '', component: InicioView, meta: { roles: ['administrador', 'bodega', 'cajero'] } },
            { path: 'usuarios', component: UsuariosView, meta: { roles: ['administrador'] } },
            { path: 'productos', component: UsuariosView, meta: { roles: ['administrador', 'bodega'] } },
            { path: 'categorias', component: UsuariosView, meta: { roles: ['administrador', 'bodega'] } },
            { path: 'proveedores', component: UsuariosView, meta: { roles: ['administrador', 'bodega'] } },
            { path: 'movimientos', component: UsuariosView, meta: { roles: ['administrador', 'cajero'] } },
            { path: 'reportes', component: UsuariosView, meta: { roles: ['administrador'] } },
        ]
    },
    // { path: '/:pathMatch(.   *)*', redirect: '/login' }, // Captura cualquier ruta no definida
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})
const userSesion = async () => await userApi.sessionStatus();

router.beforeEach(async (to, from, next) => {
    let activo = await userSesion();
    const userStore = useUserStore();
    userStore.restore();

    if (to.meta.requiresAuth && !activo.logIn) {
        userStore.logout();
        return next('/login');
    } else if (to.path === '/login' && activo.logIn) {
        return next('/panel');
    }

    next();
})

export default router;