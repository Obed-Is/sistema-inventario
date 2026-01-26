<template>
    <div v-if="show" class="modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <h2>{{ mode === 'create' ? 'Nueva Categoría' : 'Editar Categoría' }}</h2>
                <button class="btn-close" @click="handleClose" aria-label="Cerrar">
                    <XIcon />
                </button>
            </div>

            <form @submit.prevent="handleSubmit" class="modal-form">
                <div class="form-row">
                    <div class="form-group full">
                        <label>Nombre *</label>
                        <input type="text" v-model.trim="formData.nombre" required placeholder="Ej: Bebidas"
                            class="form-input" />
                        <span v-if="errors.nombre" class="error-message">{{ errors.nombre }}</span>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group full">
                        <label>Descripción *</label>
                        <input type="text" v-model.trim="formData.descripcion" required
                            placeholder="Ej: Productos líquidos y refrescos" class="form-input" />
                        <span v-if="errors.descripcion" class="error-message">{{ errors.descripcion }}</span>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" @click="handleClose">Cancelar</button>
                    <button type="submit" class="btn-primary">{{ mode === 'create' ? 'Crear Categoría' : 'Guardar Cambios' }}</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import XIcon from '@/assets/icons/XIcon.vue'

const props = defineProps({
    show: { type: Boolean, default: false },
    mode: { type: String, default: 'create', validator: (v) => ['create', 'edit'].includes(v) },
    category: { type: Object, default: null }
})

const emit = defineEmits(['close', 'submit'])

const formData = reactive({ id: null, nombre: '', descripcion: '' })
const errors = reactive({ nombre: '', descripcion: '' })

watch([() => props.show, () => props.mode, () => props.category], () => {
    if (!props.show) return
    if (props.mode === 'edit' && props.category) {
        formData.id = props.category.id ?? null
        formData.nombre = props.category.nombre ?? ''
        formData.descripcion = props.category.descripcion ?? ''
    } else {
        formData.id = null
        formData.nombre = ''
        formData.descripcion = ''
    }
    errors.nombre = ''
    errors.descripcion = ''
}, { immediate: true })

const validate = () => {
    let ok = true
    errors.nombre = ''
    errors.descripcion = ''
    if (!formData.nombre || formData.nombre.length < 3) {
        errors.nombre = 'Debe tener al menos 3 caracteres'
        ok = false
    }
    if (!formData.descripcion || formData.descripcion.length < 5) {
        errors.descripcion = 'Debe tener al menos 5 caracteres'
        ok = false
    }
    return ok
}

const handleSubmit = () => {
    if (!validate()) return;
    emit('submit', { ...formData })
}

const handleClose = () => emit('close')
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

.modal-content {
    background-color: var(--color-white);
    border-radius: 12px;
    box-shadow: var(--shadow-md);
    width: 100%;
    max-width: 680px;
    max-height: 90vh;
    overflow-y: auto;
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

.modal-form {
    padding: 24px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group.full {
    grid-column: 1 / -1;
}

.form-group label {
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--color-text);
    margin-bottom: 8px;
}

.form-input {
    padding: 10px 12px;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 0.9375rem;
    background: var(--color-white);
    color: var(--color-text);
    outline: none;
    transition: all 0.2s ease;
}

.form-input:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.error-message {
    font-size: 0.8125rem;
    color: var(--color-error);
    margin-top: 4px;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 8px;
    padding-top: 16px;
    border-top: 1px solid var(--color-border);
}

.btn-secondary {
    padding: 12px 24px;
    border: 1px solid var(--color-border);
    background: var(--color-white);
    color: var(--color-text);
    border-radius: 6px;
    font-weight: 500;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all .2s ease;
}

.btn-secondary:hover {
    background: var(--color-background);
    border-color: var(--color-text-light);
}

.btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: var(--color-accent);
    color: var(--color-white);
    border: none;
    border-radius: 6px;
    font-weight: 500;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all .2s ease;
    box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
    background: var(--color-accent-dark);
}

@media (max-width: 768px) {
    .form-row {
        grid-template-columns: 1fr;
    }
}
</style>
