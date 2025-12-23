<template>
    <div class="layout">
        <div class="container">
            <section class="sect-header">
                <LockIcon class="lock-icon" />
                <div class="info-header">
                    <h2>Sistema de <span>inventario</span></h2>
                    <p class="data-header">Ingresa tus credenciales</p>
                </div>
            </section>
            <section class="sect-content">
                <div>
                    <InputComponent :lbl="'Usuario'" v-model="correoInput" :type="'email'" :name="'correo'"
                        :id="'correo'" :placeholder="'usuario@gmail.com'" :error="errores.correo">
                        <UserIcon class="input-icon" />
                    </InputComponent>
                    <InputComponent :lbl="'Contraseña'" v-model="contrasenaInput" :type="'password'"
                        :name="'contrasena'" :id="'contrasena'" :placeholder="'Ingresa tu contraseña'"
                        :error="errores.contrasena">
                        <LockIcon @click="togglePass" class="input-icon input-lock" />
                    </InputComponent>
                </div>
            </section>

            <button @click="validacionCampos" class="btn-log">Iniciar sesion</button>
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

const userApi = new UserApi();
const router = useRouter();

let loaderInterval;

const correoInput = ref('');
const contrasenaInput = ref('');
let errores = reactive({
    correo: '',
    contrasena: ''
});

async function validacionCampos() {
    const btnLog = document.querySelector('.btn-log');

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
                return router.push('/dashboard');
            } else if (!response.success) {
                btnLog.style.pointerEvents = 'all';
                btnLog.textContent = "Iniciar sesion";

                return simpleAlert(
                    'No se pudo completar la solicitud',
                    response.message ?? 'Ha ocurrido un error inesperado, intenta de nuevo o comunicate con el equipo de soporte',
                    'warning');
            }
        } catch (error) {
            clearInterval(loaderInterval);
            btnLog.textContent = "Iniciar sesion";

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
.layout {
    background-color: #e5f6e5;
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    width: 500px;
    height: 520px;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    margin: 10px auto;
    border: none;
    border-radius: var(--card-radius);
    box-shadow: var(--card-shadow);
}

.sect-header {
    margin: 20px auto;
    width: 350px;
    text-align: center;
    align-items: center;
    gap: 10px;
}

.lock-icon {
    width: 55px;
    height: 55px;
    border-radius: 100%;
    padding: 7px;
    color: white;
    background-color: var(--color-main);
}

h2 {
    font-size: 1.7em;
    color: #161616;

    span {
        color: var(--color-main);
    }
}

.data-header {
    color: var(--muted-text);
}

.sect-content {
    margin: 30px auto;
    width: 400px;

    div {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
}

label {
    position: relative;
    display: flex;
    flex-direction: column;
    color: #161616;
    font-size: 16px;

    input {
        outline: none;
        margin-top: 3px;
        padding: 7px 3px 7px 30px;
        background-color: #fffdfd;
        border: 1px solid var(--border-color);
        border-radius: 5px;
    }

    .input-lock {
        cursor: pointer;
    }

    .input-icon {
        position: absolute;
        width: 20px;
        height: 20px;
        top: 31px;
        left: 5px;
        color: var(--muted-text);
    }
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