<template>
    <div v-if="loading">Cargando...</div>

    <AdminPanel v-else-if="userRole === 'administrador'" />

    <BodegaPanel v-else-if="userRole === 'bodega'" />

    <div v-else class="unauthorized">
        No autorizado
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import AdminPanel from '@/components/adminPanel.vue'
import BodegaPanel from '@/components/bodegaPanel.vue'
import { useUserStore } from '@/utils/UserStore.js'

const userRole = ref(null)
const loading = ref(true)
const userStore = useUserStore()

const checkUserRole = () => {
    userRole.value = userStore.rol?.toLowerCase() || 'sin rol'
    loading.value = false
}

onMounted(() => {
    checkUserRole()
})
</script>

<style scoped>
.loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #F6F6F8;
}

.loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 32px;
    background: var(--color-white);
    border-radius: 12px;
    box-shadow: var(--shadow-sm);
}

.loading-spinner svg {
    animation: spin 1s linear infinite;
    color: var(--color-primary);
}

.loading-spinner p {
    margin: 0;
    color: var(--color-text-light);
    font-size: 0.875rem;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.unauthorized {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #F6F6F8;
}

.unauthorized-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 32px;
    background: var(--color-white);
    border-radius: 12px;
    box-shadow: var(--shadow-sm);
    text-align: center;
    max-width: 400px;
}

.unauthorized-content svg {
    color: var(--color-warning);
}

.unauthorized-content h3 {
    margin: 0;
    color: var(--color-text);
    font-size: 1.25rem;
    font-weight: 600;
}

.unauthorized-content p {
    margin: 0;
    color: var(--color-text-light);
    font-size: 0.875rem;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 40px;
    padding: 0 16px;
    border-radius: 8px;
    border: 1px solid var(--color-border);
    background: var(--color-white);
    color: var(--color-text);
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
}

.btn:hover {
    background: var(--color-background);
}

.btn-primary {
    background-color: var(--color-accent);
    color: var(--color-white);
    border: none;
}

.btn-primary:hover {
    background: var(--color-accent-dark);
}
</style>