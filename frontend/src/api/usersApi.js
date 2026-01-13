export class UserApi {
    async loginUser(data) {
        try {
            const request = await fetch('/api/user/login', {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                method: 'POST',
                body: JSON.stringify(data),
            })

            return await request.json();
        } catch (error) {
            console.log('Error en el fetch de inicio de sesion: ', error)
            return { success: false };
        }
    }

    async sessionStatus() {
        try {
            const response = await fetch('/api/user/auth/session', {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Error en el fetch de comprobar la sesion: ', error)
            return false;
        }
    }

    async logoutUser() {
        try {
            const response = await fetch('/api/user/logout', {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                credentials: "include",
            });
            //se recibe pero no se usa, la sesion siempre se cierra a menos q se capture un error
            const data = await response.json();

            return true;
        } catch (error) {
            console.log('Error al cerrar la sesion del usuario: ', error);
            return false;
        }
    }

    async createUserApi(data) {
        if (!data) {
            return false;
        }

        console.log(data)
        try {
            const response = await fetch('/api/user/create', {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                credentials: "include",
                body : JSON.stringify(data)
            });

            return await response.json();
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getUsersApi(page){
        try {
            const response = await fetch(`/api/user?page=${page}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
                credentials: "include",
            });

            const data = await response.json();
            
            // Si la respuesta es 403 o contiene mensaje de acceso denegado, lanzar error
            if (response.status === 403 || (data && (data.message === 'Acceso denegado' || data.message?.toLowerCase().includes('acceso denegado')))) {
                return { 
                    success: false, 
                    message: 'Acceso denegado',
                    accessDenied: true 
                };
            }
            
            return data;
        } catch (error) {
            console.log(error)
            return { success: false, error: error.message };
        }
    }
}