<template>
    <div v-if="show" class="modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <h2>{{ mode === 'create' ? 'Nuevo Producto' : 'Editar Producto' }}</h2>
                <button class="btn-close" @click="handleClose" aria-label="Cerrar">
                    <XIcon />
                </button>
            </div>

            <form @submit.prevent="handleSubmit" class="modal-form">
                <div class="form-row">
                    <div class="form-group">
                        <label>Código *</label>
                        <input type="text" v-model.trim="formData.codigo" required placeholder="Ej: 0001" class="form-input" />
                        <span v-if="errors.codigo" class="error-message">{{ errors.codigo }}</span>
                    </div>

                    <div class="form-group">
                        <label>Nombre *</label>
                        <input type="text" v-model.trim="formData.nombre" required placeholder="Ej: Caja de jabones" class="form-input" />
                        <span v-if="errors.nombre" class="error-message">{{ errors.nombre }}</span>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Costo compra *</label>
                        <input type="number" step="0.01" min="0" v-model="formData.costo_compra" required class="form-input" />
                        <span v-if="errors.costo_compra" class="error-message">{{ errors.costo_compra }}</span>
                    </div>

                    <div class="form-group">
                        <label>Precio venta *</label>
                        <input type="number" step="0.01" min="0" v-model="formData.precio_venta" required class="form-input" />
                        <span v-if="errors.precio_venta" class="error-message">{{ errors.precio_venta }}</span>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Stock *</label>
                        <input type="number" min="0" v-model="formData.stock" required class="form-input" />
                        <span v-if="errors.stock" class="error-message">{{ errors.stock }}</span>
                    </div>

                    <div class="form-group">
                        <label>Stock límite *</label>
                        <input type="number" min="0" v-model="formData.stock_limite" required class="form-input" />
                        <span v-if="errors.stock_limite" class="error-message">{{ errors.stock_limite }}</span>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Categoría *</label>
                        <select v-model="formData.id_categoria" required class="form-input">
                            <option value="" disabled>Selecciona una categoría</option>
                            <option v-for="c in categories" :key="c.id" :value="String(c.id)">{{ c.nombre }}</option>
                        </select>
                        <span v-if="errors.id_categoria" class="error-message">{{ errors.id_categoria }}</span>
                    </div>

                    <div class="form-group">
                        <label>Unidad *</label>
                        <select v-model="formData.id_unidad" required class="form-input">
                            <option value="" disabled>Selecciona una unidad</option>
                            <option v-for="u in units" :key="u.id" :value="String(u.id)">{{ u.nombre }}</option>
                        </select>
                        <span v-if="errors.id_unidad" class="error-message">{{ errors.id_unidad }}</span>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" @click="handleClose">Cancelar</button>
                    <button type="submit" class="btn-primary">{{ mode === 'create' ? 'Crear Producto' : 'Guardar Cambios' }}</button>
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
    product: { type: Object, default: null },
    categories: { type: Array, default: () => [] },
    units: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'submit'])

const formData = reactive({
    id: null,
    codigo: '',
    nombre: '',
    costo_compra: '',
    precio_venta: '',
    stock: 0,
    stock_limite: 0,
    id_categoria: '',
    id_unidad: ''
})

const errors = reactive({
    codigo: '',
    nombre: '',
    costo_compra: '',
    precio_venta: '',
    stock: '',
    stock_limite: '',
    id_categoria: '',
    id_unidad: ''
})

watch([() => props.show, () => props.mode, () => props.product], () => {
    if (!props.show) return

    if (props.mode === 'edit' && props.product) {
        formData.id = props.product.id ?? null
        formData.codigo = String(props.product.codigo ?? '')
        formData.nombre = String(props.product.nombre ?? '')
        formData.costo_compra = String(props.product.costo_compra ?? '')
        formData.precio_venta = String(props.product.precio_venta ?? '')
        formData.stock = Number(props.product.stock ?? 0)
        formData.stock_limite = Number(props.product.stock_limite ?? 0)
        formData.id_categoria = String(props.product.id_categoria ?? '')
        formData.id_unidad = String(props.product.id_unidad ?? '')
    } else {
        formData.id = null
        formData.codigo = ''
        formData.nombre = ''
        formData.costo_compra = ''
        formData.precio_venta = ''
        formData.stock = 0
        formData.stock_limite = 0
        formData.id_categoria = ''
        formData.id_unidad = ''
    }

    errors.codigo = ''
    errors.nombre = ''
    errors.costo_compra = ''
    errors.precio_venta = ''
    errors.stock = ''
    errors.stock_limite = ''
    errors.id_categoria = ''
    errors.id_unidad = ''
}, { immediate: true })

const validate = () => {
    let ok = true

    errors.codigo = ''
    errors.nombre = ''
    errors.costo_compra = ''
    errors.precio_venta = ''
    errors.stock = ''
    errors.stock_limite = ''
    errors.id_categoria = ''
    errors.id_unidad = ''

    const codigo = formData.codigo?.trim() ?? ''
    if (!codigo || codigo.length > 4) {
        errors.codigo = 'Código obligatorio (1 a 4 caracteres)'
        ok = false
    }

    const nombre = formData.nombre?.trim() ?? ''
    if (!nombre || nombre.length < 2) {
        errors.nombre = 'Nombre obligatorio (mínimo 2 caracteres)'
        ok = false
    }

    const costo = Number(formData.costo_compra)
    if (Number.isNaN(costo) || costo <= 0) {
        errors.costo_compra = 'Costo compra obligatorio (mayor a 0)'
        ok = false
    }

    const precio = Number(formData.precio_venta)
    if (Number.isNaN(precio) || precio <= 0) {
        errors.precio_venta = 'Precio venta obligatorio (mayor a 0)'
        ok = false
    }

    const stock = Number(formData.stock)
    if (!Number.isInteger(stock) || stock < 0) {
        errors.stock = 'Stock obligatorio (0 o mayor)'
        ok = false
    }

    const stockLimite = Number(formData.stock_limite)
    if (!Number.isInteger(stockLimite) || stockLimite < 0) {
        errors.stock_limite = 'Stock límite obligatorio (0 o mayor)'
        ok = false
    }

    if (!formData.id_categoria) {
        errors.id_categoria = 'Categoría obligatoria'
        ok = false
    }

    if (!formData.id_unidad) {
        errors.id_unidad = 'Unidad obligatoria'
        ok = false
    }

    return ok
}

const handleSubmit = () => {
    if (!validate()) return

    emit('submit', {
        id: formData.id,
        codigo: formData.codigo.trim(),
        nombre: formData.nombre.trim(),
        costo_compra: String(formData.costo_compra),
        precio_venta: String(formData.precio_venta),
        stock: Number(formData.stock),
        stock_limite: Number(formData.stock_limite),
        id_categoria: Number(formData.id_categoria),
        id_unidad: Number(formData.id_unidad)
    })
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
}

.modal-content {
    background-color: var(--color-white);
    border-radius: 12px;
    box-shadow: var(--shadow-md);
    width: 100%;
    max-width: 760px;
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
