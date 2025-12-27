<template>
    <div class="login-layout">
        <div class="login-container">
            <div class="login-card">
                <div class="login-header">
                    <div class="login-icon-container">
                        <LockIcon class="login-icon" />
                    </div>
                    <h1 class="login-title">Sistema de <span>inventario</span></h1>
                    <p class="login-subtitle">Ingresa tus credenciales para continuar</p>
                </div>

                <div class="login-form">
                    <InputComponent :lbl="'Correo electrónico'" v-model="correoInput" type="email" name="correo"
                        id="correo" :placeholder="'usuario@ejemplo.com'" :error="errores.correo" class="login-input">
                        <UserIcon class="input-icon" />
                    </InputComponent>

                    <InputComponent :lbl="'Contraseña'" v-model="contrasenaInput" type="password" name="contrasena"
                        id="contrasena" :placeholder="'Ingresa tu contraseña'" :error="errores.contrasena"
                        class="login-input">
                        <LockIcon @click="togglePass" class="input-icon input-lock" />
                    </InputComponent>

                    <button @click="validacionCampos" class="login-button">
                        <span>Iniciar sesión</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import InputComponent from '@/components/InputComponent.vue';
import LockIcon from '@/assets/icons/LockIcon.vue';
import UserIcon from '@/assets/icons/UserIcon.vue';
import { validEmail, validPassword } from '@/utils/validators.js';
import { UserApi } from '@/api/usersApi.js';
import { reactive, ref } from 'vue';
import { simpleAlert } from '@/utils/sweetAlert.js';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/utils/UserStore';

const userApi = new UserApi();
const router = useRouter();
const userStore = useUserStore();

let loaderInterval;

const correoInput = ref('');
const contrasenaInput = ref('');
let errores = reactive({
    correo: '',
    contrasena: ''
});

async function validacionCampos() {
    const btnLog = document.querySelector('.login-button');

    errores.correo = '';
    errores.contrasena = '';

    const correo = correoInput.value.trim();
    const contrasena = contrasenaInput.value;

    errores.correo = validEmail(correo);
    errores.contrasena = validPassword(contrasena);

    if (!errores.correo && !errores.contrasena) {
        btnLog.style.pointerEvents = 'none';
        viewLoader(btnLog);
        try {
            const userData = {
                correo,
                contrasena
            }
            const response = await userApi.loginUser(userData);
            clearInterval(loaderInterval);

            if (response.logIn) {
                console.log(response)
                //uso de pinia para mandar y guardar los datos
                userStore.loginStore(response.userData);
                return router.push('/panel');
            } else if (!response.success) {
                btnLog.style.pointerEvents = 'all';
                btnLog.textContent = "Iniciar sesión";

                return simpleAlert(
                    'No se pudo completar la solicitud',
                    response.message ?? 'Ha ocurrido un error inesperado, intenta de nuevo o comunicate con el equipo de soporte',
                    'warning');
            }
        } catch (error) {
            clearInterval(loaderInterval);
            btnLog.textContent = "Iniciar sesión";
            btnLog.style.pointerEvents = 'all';

            return simpleAlert(
                'Error',
                'Ha ocurrido un error inesperado, intenta de nuevo o comunicate con el equipo de soporte',
                'error');
        }
    }
}

function togglePass(e) {
    const elementContra = document.getElementById('contrasena');
    if (elementContra.type === 'password') {
        elementContra.type = 'text';
    } else {
        elementContra.type = 'password';
    }
}

function viewLoader(btnLog) {
    let palabra = "Ingresando";

    loaderInterval = setInterval(() => {
        if (palabra.includes('...')) {
            palabra = "Ingresando";
        } else {
            palabra += ".";
        }
        btnLog.textContent = palabra;
    }, 500)
}

</script>

<style scoped>
.login-layout {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-background);
    padding: 2rem;
}

.login-container {
    width: 100%;
    max-width: 400px;
}

.login-card {
    background-color: var(--color-white);
    border-radius: 12px;
    box-shadow: var(--shadow);
    overflow: hidden;
    padding: 2.5rem 2rem;
}

.login-header {
    text-align: center;
    margin-bottom: 2rem;
}

.login-icon-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: var(--color-accent);
    margin-bottom: 1.25rem;
}

.login-icon {
    width: 32px;
    height: 32px;
    color: var(--color-white);
}

.login-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--color-primary);
    margin-bottom: 0.5rem;
    line-height: 1.3;
}

.login-title span {
    color: var(--color-accent);
}

.login-subtitle {
    color: var(--color-text-light);
    font-size: 0.9375rem;
    margin: 0;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.login-input {
    width: 100%;
}

.login-button {
    width: 100%;
    padding: 0.875rem 1.5rem;
    background-color: var(--color-accent);
    color: var(--color-white);
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.5rem;
}

.login-button:hover {
    background-color: var(--color-accent-dark);
    transform: translateY(-1px);
    box-shadow: var(--shadow);
}

.login-button:active {
    transform: translateY(0);
}

.input-lock {
    cursor: pointer;
}

.input-icon {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 33px;
    left: 5px;
    color: var(--muted-text);
}

.errores {
    font-size: 0.9em;
    color: var(--muted-text);
}

.btn-log {
    width: 400px;
    margin: 10px auto;
    border: none;
    border-radius: 5px;
    background-color: var(--color-main);
    font-weight: 500;
    font-size: 1em;
    color: #ffffff;
    padding: 10px;
    cursor: pointer;
    transition: .3s all ease-in-out;
}

.btn-log:hover {
    opacity: 0.8;
}
</style>