<template>
    <div v-if="show" class="modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Gestionar unidades</h2>
                <button class="btn-close" @click="handleClose" aria-label="Cerrar">
                    <XIcon />
                </button>
            </div>

            <div class="modal-body">
                <form class="create-form" @submit.prevent="handleCreate">
                    <div class="field">
                        <label>Nueva unidad</label>
                        <input class="input" type="text" v-model.trim="nombreUnidad" placeholder="Ej: Kilogramo" />
                        <span v-if="error" class="error-message">{{ error }}</span>
                    </div>
                    <button class="btn-primary" type="submit">Agregar</button>
                </form>

                <div class="divider"></div>

                <div class="units-list">
                    <div class="list-header">
                        <p class="list-title">Unidades activas</p>
                        <p class="list-subtitle">{{ units.length }} unidad{{ units.length !== 1 ? 'es' : '' }}</p>
                    </div>

                    <div v-if="units.length" class="list">
                        <div v-for="u in units" :key="u.id" class="list-item">
                            <div class="item-info">
                                <p class="item-name">{{ u.nombre }}</p>
                            </div>
                            <button class="btn-action btn-delete" type="button" @click="handleDelete(u)">
                                <TrashIcon style="width: 16px; height: 16px;" />
                            </button>
                        </div>
                    </div>

                    <div v-else class="empty">
                        <p class="empty-title">Sin unidades</p>
                        <p class="empty-text">Agrega una unidad para poder asignarla a productos</p>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn-secondary" type="button" @click="handleClose">Cerrar</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import XIcon from '@/assets/icons/XIcon.vue'
import TrashIcon from '@/assets/icons/TrashIcon.vue'

const props = defineProps({
    show: { type: Boolean, default: false },
    units: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'create', 'delete'])

const nombreUnidad = ref('')
const error = ref('')

watch(() => props.show, (open) => {
    if (!open) return
    nombreUnidad.value = ''
    error.value = ''
})

const handleClose = () => emit('close')

const handleCreate = () => {
    error.value = ''
    const name = nombreUnidad.value.trim()

    if (!name || name.length < 2) {
        error.value = 'Nombre obligatorio (mínimo 2 caracteres)'
        return
    }

    emit('create', name)
    nombreUnidad.value = ''
}

const handleDelete = (u) => emit('delete', u)
</script>

<style scoped>
.modal-overlay {
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
}

.modal-content {
    background-color: var(--color-white);
    border-radius: 12px;
    box-shadow: var(--shadow-md);
    width: 100%;
    max-width: 640px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid var(--color-border);
}

.modal-header h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-primary);
    margin: 0;
}

.btn-close {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--color-text-light);
    border-radius: 6px;
    cursor: pointer;
}

.btn-close:hover {
    background-color: var(--color-background);
    color: var(--color-text);
}

.modal-body {
    padding: 18px 24px;
    overflow-y: auto;
}

.create-form {
    display: flex;
    gap: 12px;
    align-items: flex-end;
}

.field {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.field label {
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--color-text);
    margin-bottom: 8px;
}

.input {
    height: 40px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 8px 12px;
    background: var(--color-white);
    color: var(--color-text);
    outline: none;
}

.error-message {
    font-size: 0.8125rem;
    color: var(--color-error);
    margin-top: 4px;
}

.divider {
    height: 1px;
    background: var(--color-border);
    margin: 16px 0;
}

.units-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.list-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}

.list-title {
    font-weight: 700;
    color: var(--color-primary);
    margin: 0;
}

.list-subtitle {
    color: var(--color-text-light);
    margin: 0;
}

.list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border: 1px solid var(--color-border);
    border-radius: 10px;
    background: var(--color-white);
}

.item-name {
    margin: 0;
    font-weight: 600;
    color: var(--color-text);
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

.btn-delete {
    color: var(--color-error);
}

.btn-delete:hover {
    background-color: rgba(231, 76, 60, 0.1);
}

.empty {
    padding: 10px;
    text-align: center;
}

.empty-title {
    font-weight: 700;
    color: var(--color-primary);
    margin: 0;
}

.empty-text {
    margin-top: 6px;
    color: var(--color-text-light);
    margin-bottom: 10px;
}

.modal-footer {
    padding: 16px 24px;
    border-top: 1px solid var(--color-border);
    display: flex;
    justify-content: flex-end;
}

.btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 40px;
    padding: 0 14px;
    background-color: var(--color-accent);
    color: var(--color-white);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
    background: var(--color-accent-dark);
}

.btn-secondary {
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

.btn-secondary:hover {
    background: var(--color-background);
}

@media (max-width: 640px) {
    .create-form {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>
