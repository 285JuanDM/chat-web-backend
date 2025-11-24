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

## ⚡ Pruebas de Carga y Rendimiento

Para validar que el backend cumple con los requisitos del proyecto en cuanto a:

- Concurrencia: soportar decenas de usuarios simultáneos en el Proof of Concept
- Latencia: entregar mensajes en < 850 ms en condiciones normales

Hemos preparado un script automático de pruebas, escrito en Python, que simula usuarios concurrentes enviando mensajes mediante WebSockets.

### 📈 ¿Qué prueba este script?
El script verifica:

#### Concurrencia
Simula entre 20–200 usuarios simultáneos, cada uno:

- registrándose o iniciando sesión
- conectándose vía WebSocket
- uniéndose a una sala
- enviando múltiples mensajes en paralelo

#### Latencia
Calcula:

- tiempo mínimo
- tiempo promedio
- tiempo máximo
- desviación estándar
- porcentaje de mensajes entregados con < 850 ms

#### Throughput
Mensajes por segundo que el servidor es capaz de procesar.

### ▶ Cómo ejecutar las pruebas de carga
**1. Asegúrate de que el backend está funcionando**
Si no lo está, actívalo así:

```bash
docker compose up --build -d
```

O si ya lo levantaste previamente:

```bash
docker compose start
```

**2. Instalar dependencias del script (solo la primera vez)**

```bash
pip install websockets requests
```

**3. Ejecutar el script de pruebas**

Ejecutar el archivo ```load-test-script.py```

El script comenzará a simular usuarios concurrentes y mostrará métricas como:

- latencias individuales y promedio
- usuarios que completaron la prueba
- mensajes enviados vs recibidos
- porcentaje que cumple < 850ms
- throughput total
