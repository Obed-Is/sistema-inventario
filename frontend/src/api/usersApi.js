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
}