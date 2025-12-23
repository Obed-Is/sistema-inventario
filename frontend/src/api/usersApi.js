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
}