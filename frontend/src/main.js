import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/routes/routes.js'
import { createPinia } from 'pinia'
import { useUserStore } from '@/utils/UserStore.js'

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

const userStore = useUserStore();
userStore.restore();

app.use(router);
app.mount('#app');