# 💬 Backend de la Aplicación de Chats

Este repositorio contiene el código fuente del **Backend** de nuestra aplicación de chats, desarrollado para gestionar la autenticación, salas (rooms) y mensajes entre usuarios.

## 👥 Grupo
- **Juan David Moreno Suarez**
- **Oscar Vergara Moreno** 
- **Sofia Vargas Garzon**

## 🛠️ Cómo Ejecutar el Proyecto

La aplicación está diseñada para ser desplegada usando **Docker Compose**, lo que simplifica la configuración de dependencias.

1.  Asegúrate de tener **Docker** y **Docker Compose** instalados en tu sistema.
2.  Clona este repositorio
3.  Ejecuta el siguiente comando en la terminal para construir las imágenes y levantar los contenedores:
   
    ```bash
    docker compose up --build -d
    ```

## 🚀 Endpoints de la API 

Aquí se detalla la estructura de los endpoints disponibles en el backend.

### 🔐 Módulo de Autenticación (`/auth`)

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Crea un nuevo usuario. |
| `POST` | `/auth/login` | Inicia sesión y devuelve un token de autenticación. |

### 🏠 Módulo de Salas/Conversaciones (`/rooms`)

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/rooms` | Obtiene una lista de todas las salas. |
| `POST` | `/rooms` | Crea una nueva sala. |
| `POST` | `/rooms/:id/join` | El usuario se una a una sala. |
| `POST` | `/rooms/:id/leave` | El usario de va de la sala. |

### 📧 Módulo de Mensajes (`/messages`)

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/messages/:id/history` | Obtiene todos los mensajes del usuario. |

## 🧪 Colección de Postman

Utiliza nuestra colección de Postman para probar rápidamente todos los endpoints y ver ejemplos de las peticiones (request) y respuestas (response).

* **Enlace de la Colección:** [Backend Chats Collection](https://web.postman.co/workspace/a2c3cfc9-6b0a-4960-815d-7b1cec500dbd)
* prueba workflow
