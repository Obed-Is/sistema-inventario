<template>
    <div v-if="show" class="modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <h2>{{ mode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario' }}</h2>
                <button class="btn-close" @click="handleClose">
                    <XIcon />
                </button>
            </div>
            <form @submit.prevent="handleSubmit" class="modal-form">
                <div class="form-row">
                    <div class="form-group">
                        <label>Nombre Completo *</label>
                        <input type="text" v-model="formData.nombre" required placeholder="Ej: Juan Pérez"
                            class="form-input" />
                        <span v-if="errors.nombre" class="error-message">{{ errors.nombre }}</span>
                    </div>
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" v-model="formData.email" required placeholder="Ej: juan@example.com"
                            class="form-input" />
                        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Teléfono *</label>
                        <input type="tel" v-model="formData.telefono" required placeholder="Ej: 30012345 (8 dígitos)" class="form-input" />
                        <span v-if="errors.telefono" class="error-message">{{ errors.telefono }}</span>
                    </div>
                    <div class="form-group">
                        <label>Rol *</label>
                        <select v-model="formData.rol" required class="form-input">
                            <option value="">Seleccione un rol</option>
                            <option value="administrador">Administrador</option>
                            <option value="bodega">Bodega</option>
                            <option value="ventas">Ventas</option>
                        </select>
                        <span v-if="errors.rol" class="error-message">{{ errors.rol }}</span>
                    </div>
                </div>
                <div class="form-row" v-if="mode !== 'create'">
                    <div class="form-group">
                        <label>Estado *</label>
                        <select v-model="formData.estado" required class="form-input">
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </div>
                </div>
                <div class="form-row" v-if="mode === 'create'">
                    <div class="form-group">
                        <label>Contraseña *</label>
                        <div class="password-input-wrapper">
                            <input :type="showPassword ? 'text' : 'password'" v-model="formData.password"
                                required placeholder="Mínimo 6 caracteres" class="form-input"
                                autocomplete="on" />
                            <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                                <EyeIcon v-if="!showPassword" style="width: 18px; height: 18px;" />
                                <EyeOffIcon v-else style="width: 18px; height: 18px;" />
                            </button>
                        </div>
                        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
                    </div>
                    <div class="form-group">
                        <label>Confirmar Contraseña *</label>
                        <div class="password-input-wrapper">
                            <input :type="showPasswordConfirm ? 'text' : 'password'" v-model="formData.passwordConfirm"
                                required placeholder="Confirme la contraseña" autocomplete="on"
                                class="form-input" />
                            <button type="button" class="password-toggle"
                                @click="showPasswordConfirm = !showPasswordConfirm">
                                <EyeIcon v-if="!showPasswordConfirm" style="width: 18px; height: 18px;" />
                                <EyeOffIcon v-else style="width: 18px; height: 18px;" />
                            </button>
                        </div>
                        <span v-if="errors.passwordConfirm" class="error-message">{{ errors.passwordConfirm }}</span>
                    </div>
                </div>
                <div class="form-row" v-if="mode === 'edit'">
                    <div class="form-group">
                        <label>Nueva Contraseña</label>
                        <div class="password-input-wrapper">
                            <input :type="showPassword ? 'text' : 'password'" v-model="formData.password"
                                placeholder="Deje vacío para mantener la actual" class="form-input"
                                autocomplete="new-password" />
                            <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                                <EyeIcon v-if="!showPassword" style="width: 18px; height: 18px;" />
                                <EyeOffIcon v-else style="width: 18px; height: 18px;" />
                            </button>
                        </div>
                        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
                    </div>
                    <div class="form-group">
                        <label>Confirmar Nueva Contraseña</label>
                        <div class="password-input-wrapper">
                            <input :type="showPasswordConfirm ? 'text' : 'password'" v-model="formData.passwordConfirm"
                                placeholder="Confirme la nueva contraseña" autocomplete="new-password"
                                class="form-input" />
                            <button type="button" class="password-toggle"
                                @click="showPasswordConfirm = !showPasswordConfirm">
                                <EyeIcon v-if="!showPasswordConfirm" style="width: 18px; height: 18px;" />
                                <EyeOffIcon v-else style="width: 18px; height: 18px;" />
                            </button>
                        </div>
                        <span v-if="errors.passwordConfirm" class="error-message">{{ errors.passwordConfirm }}</span>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" @click="handleClose">Cancelar</button>
                    <button type="submit" class="btn-primary">
                        {{ mode === 'create' ? 'Crear Usuario' : 'Guardar Cambios' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import XIcon from '@/assets/icons/XIcon.vue';
import EyeIcon from '@/assets/icons/EyeIcon.vue';
import EyeOffIcon from '@/assets/icons/EyeOffIcon.vue';
import { validateUserForm } from '@/utils/validators';

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    mode: {
        type: String,
        default: 'create',
        validator: (value) => ['create', 'edit'].includes(value)
    },
    user: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['close', 'submit']);

const showPassword = ref(false);
const showPasswordConfirm = ref(false);

const formData = ref({
    id: null,
    nombre: '',
    email: '',
    telefono: '',
    rol: '',
    estado: '',
    password: '',
    passwordConfirm: ''
});

const errors = ref({});

// Inicializar formulario cuando cambia el modo o el usuario
watch([() => props.show, () => props.mode, () => props.user], () => {
    if (props.show) {
        if (props.mode === 'edit' && props.user) {
            try {
                const userRol = (props.user.nombre_rol || props.user.rol || '').toLowerCase();
                const userEstado = props.user.estado === 1 || props.user.estado === '1' || props.user.estado === 'activo' ? 'activo' : 'inactivo';
                
                formData.value = {
                    id: props.user.id || null,
                    nombre: props.user.nombre || '',
                    email: props.user.correo || props.user.email || '',
                    telefono: props.user.telefono || '',
                    rol: userRol,
                    estado: userEstado,
                    password: '',
                    passwordConfirm: ''
                };
            } catch (error) {
                console.error('Error al inicializar formulario de edición:', error);
                formData.value = {
                    id: null,
                    nombre: '',
                    email: '',
                    telefono: '',
                    rol: '',
                    estado: 'activo',
                    password: '',
                    passwordConfirm: ''
                };
            }
        } else {
            formData.value = {
                id: null,
                nombre: '',
                email: '',
                telefono: '',
                rol: '',
                estado: 'activo',
                password: '',
                passwordConfirm: ''
            };
        }
        errors.value = {};
        showPassword.value = false;
        showPasswordConfirm.value = false;
    }
}, { immediate: true });

const validateForm = () => {
    const validation = validateUserForm(formData.value, props.mode);
    errors.value = validation.errors;
    return validation.isValid;
};

const handleSubmit = () => {
    if (!validateForm()) {
        console.log('Validación fallida:', errors.value);
        return;
    }
    emit('submit', { ...formData.value });
};

const handleClose = () => {
    emit('close');
};
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
    max-width: 700px;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid var(--color-border);
}

.modal-header h2 {
    font-size: 1.5rem;
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
    background-color: transparent;
    color: var(--color-text-light);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
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
    gap: 20px;
    margin-bottom: 20px;
}

.form-row:last-of-type {
    margin-bottom: 0;
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
    outline: none;
    transition: all 0.2s ease;
    background-color: var(--color-white);
    color: var(--color-text);
    font-family: var(--font-sans);
}

.form-input:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.password-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.password-input-wrapper .form-input {
    padding-right: 40px;
    width: 100%;
}

.password-toggle {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    color: var(--color-text-light);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    transition: color 0.2s ease;
}

.password-toggle:hover {
    color: var(--color-text);
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
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid var(--color-border);
}

.btn-secondary {
    padding: 12px 24px;
    border: 1px solid var(--color-border);
    background-color: var(--color-white);
    color: var(--color-text);
    border-radius: 6px;
    font-weight: 500;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-secondary:hover {
    background-color: var(--color-background);
    border-color: var(--color-text-light);
}

.btn-primary {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
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

/* Responsive */
@media (max-width: 1024px) {
    .form-row {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .modal-content {
        max-width: 100%;
    }
}
</style>
