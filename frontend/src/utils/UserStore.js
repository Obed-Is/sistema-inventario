import { defineStore } from "pinia";

//CONFIGURACION DE PINIA PARA EL MANEJO DE LOS DATOS DEL USUARIO
export const useUserStore = defineStore('user', {
    state: () => ({
        usuario: null,
        correo: null,
        rol: null,
    }),

    actions: {
        loginStore(data) {
            this.usuario = data.nombre;
            this.correo = data.correo;
            this.rol = data.nombre_rol;

            localStorage.setItem('usuarioLog', JSON.stringify(data));
        },
        restore() {
            const data = localStorage.getItem('usuarioLog');
            if (!data) {
                //AQUI SE DEBERIA 1 CERRAR LA SESION O SOLICITAR LOS DATOS NUEVAMENTE AL BACKEND
                return null
            } else {
                const { nombre_rol, nombre, correo } = JSON.parse(data);
                this.usuario = nombre;
                this.correo = correo;
                this.rol = nombre_rol;
            }
        },
        logout() {
            // ESTO SE LLAMARIA SOLO AL CERRAR LA SESION(CREO)
            localStorage.removeItem('usuarioLog');
        }
    }
})