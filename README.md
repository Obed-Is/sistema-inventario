#  Sistema de Control de Inventario y Ventas

Sistema de inventario y ventas orientado a **pequeñas y medianas empresas**, diseñado para facilitar y agilizar las operaciones diarias de gestión de productos y ventas, con control de usuarios y roles.

El sistema permite administrar **usuarios, productos, categorías y ventas**, incorporando un sistema de roles donde el **administrador** tiene control total del sistema y el rol **bodega** cuenta con permisos limitados según su función operativa.

Este proyecto fue desarrollado como práctica y demostración de habilidades en **desarrollo Backend**, aplicando buenas prácticas de arquitectura, seguridad y diseño de software.

---

## Objetivo del proyecto

Poner en práctica conocimientos y habilidades en:

- Desarrollo de APIs REST con **Node.js y Express**
- Seguridad y manejo de sesiones con **JWT**
- Diseño y gestión de **bases de datos relacionales**
- Aplicación del **patrón MVC** con una capa adicional de servicios
- Separación correcta de responsabilidades
- Protección de rutas y control de acceso por roles
- Manejo adecuado de códigos de estado HTTP
- Validaciones y manejo centralizado de errores

---

##  Tecnologías utilizadas

| Tecnología | Descripción |
|---------|------------|
| JavaScript | Lenguaje de programación |
| Node.js (ESM) | Entorno de ejecución |
| Express.js | Framework Backend |
| MySQL | Base de datos relacional |
| JWT (JSON Web Tokens) | Autenticación y manejo de sesiones |
| Git / GitHub | Control de versiones |

---

## Arquitectura del proyecto

El proyecto sigue el patrón **MVC (Model–View–Controller)** complementado con una **capa de servicios** para una mejor organización de la lógica de negocio.

### Capas del sistema

- **Routes**  
  Define los endpoints del sistema y delega la petición al controlador correspondiente.

- **Controllers**  
  Reciben las peticiones HTTP (`req`, `res`, `next`), validan datos básicos y llaman a la capa de servicios.

- **Services**  
  Contienen la **lógica de negocio**: validaciones, reglas, flujo de datos y decisiones del sistema.  
  No conocen de HTTP ni de SQL.

- **Models**  
  Capa de acceso a datos.  
  Se encarga exclusivamente de ejecutar consultas SQL y comunicarse con la base de datos.

- **Middleware**  
  Manejo de autenticación, autorización, validaciones y protección de rutas.

---

## Estructura del proyecto

```text
src/
├── controllers/
├── errors/
├── middleware/
├── models/
├── routes/
├── services/
└── app.js
```

# Instalacion y configuracion

Aqui se describen los pasos necesarios para instalar y ejecutar el proyecto **Sistema de Control de Inventario y Ventas** en un entorno local.

- Copiar el repositorio y acceder a la carpeta del proyecto
```bash
git clone https://github.com/Obed-Is/sistema-inventario.git
cd sistema_inventario
```


- Ejecutar el archivo sistema_inventario.sql en MySQL(MySQL Workbench, phpMyAdmin u otro) para crear la base de datos

- Dentro de la carpeta Backend, configurar el archivo .env con las siguientes variables
```env
# PUERTO DEL SERVIDOR
SERVER_PORT=3000

# CONEXIÓN A LA BASE DE DATOS (MySQL)
DB_USER=
DB_PASSW=
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sistema_inventario

# CONFIGURACIÓN DE BCRYPT
# Número de rondas para el hash (2ⁿ). Se recomienda usar 10 según el estándar
SALT_ROUND_HASH=10

# CONFIGURACIÓN JWT
SECRET_KEY_JWT=
```
## Instalacion de dependencias
- Acceder a la carpeta **Backend** y ejectutar los siguientes comandos para instalar e inicializar el servidor
```bash
cd Backend
npm install
npm run dev
```
- Acceder a la carpeta **Frontend** y ejecutar los siguientes comandos para instalar e inicializar el frontend
```bash
cd Frontend
npm install
npm run dev
```

- Una vez iniciados el backend y el frontend, acceder a la aplicación desde el navegador
```text
http://localhost:5173/login
```

## Credenciales de acceso
El sistema incluye usuarios de prueba preconfigurados para acceder a todas sus funcionalidades

- Administrador
```text
Correo: admin@gmail.com
Contraseña: 123123
```

- Bodega
```text
Correo: bodega@gmail.com
Contraseña: 123123
```