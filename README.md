# Pokédex Full Stack

Una aplicación web completa que permite explorar, buscar y gestionar Pokémon. Combina una interfaz React moderna con una API REST construida en NestJS, autenticación JWT y una capa de caché en MongoDB para optimizar las consultas a la PokeAPI.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=flat&logo=nestjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=flat&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=flat&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/Licencia-MIT-green?style=flat)

---

## Demo visual

![Demo](./docs/demo.gif)

> Agrega aquí un GIF o screenshot de la app

---

## Características

### Frontend
- Exploración paginada de la Pokédex con carga incremental ("Cargar más")
- Búsqueda en tiempo real con debounce de 300 ms por nombre o número de Pokémon
- Filtrado por tipo de Pokémon (fuego, agua, planta, etc.)
- Modal de detalle con estadísticas base, tipos, habilidades y sprites
- Sistema de favoritos por usuario con vista dedicada
- Gestión de equipos: crear, editar y eliminar equipos de hasta 6 Pokémon
- Autenticación completa con formularios de registro e inicio de sesión
- Sesión persistente mediante token almacenado en `localStorage`
- Diseño responsivo con CSS Modules y variables de tipo

### Backend
- API REST modular construida con NestJS y arquitectura orientada a módulos
- Autenticación mediante JWT firmado con `@nestjs/jwt` y Passport
- Contraseñas hasheadas con bcrypt (salt factor 10) antes de persistirlas
- Validación de entrada con `class-validator` y DTOs estrictos
- Caché de Pokémon individuales en MongoDB para reducir llamadas externas
- Proxy a la PokeAPI con manejo de errores y `upsert` concurrente seguro
- Prefijo global `/api` y CORS configurado para el cliente de desarrollo
- Pipe global de validación con `whitelist` y `forbidNonWhitelisted`

---

## Tecnologías

| Capa | Tecnologías |
|---|---|
| **Frontend** | React 19, Vite 8, JavaScript (ES2022), CSS Modules |
| **Backend** | NestJS, TypeScript, Passport JWT, bcrypt, class-validator, Axios |
| **Base de datos** | MongoDB 7, Mongoose (ODM), esquemas tipados con decoradores |
| **Herramientas** | oxlint, Node.js 18+ |

---

## Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                   Navegador (React)                  │
│  AuthContext · PokedexContext · Custom Hooks         │
│  Componentes: Navbar, PokemonCard, PokemonModal      │
│  SearchBar, TypeFilter, AuthModal                    │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP / Bearer JWT
                       │ (VITE_API_URL → /api)
┌──────────────────────▼──────────────────────────────┐
│              NestJS API  (puerto 3000)               │
│                                                      │
│  /api/auth      → AuthModule   (register, login)     │
│  /api/users     → UsersModule  (me, favorites)       │
│  /api/teams     → TeamsModule  (CRUD de equipos)     │
│  /api/pokemon   → PokemonModule (lista, detalle)     │
└──────────┬──────────────────────────┬───────────────┘
           │ Mongoose ODM             │ HTTP (Axios)
┌──────────▼──────────┐   ┌──────────▼───────────────┐
│      MongoDB         │   │         PokeAPI           │
│  users · teams       │   │  pokeapi.co/api/v2        │
│  pokemon_caches      │   │  (resultados cacheados)   │
└──────────────────────┘   └──────────────────────────┘
```

---

## Requisitos previos

- **Node.js** 18 o superior
- **npm** 9 o superior
- **MongoDB** local (puerto 27017) o una cadena de conexión a MongoDB Atlas

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/[tu-usuario]/pokedex.git
cd pokedex
```

### 2. Configurar y ejecutar el backend

```bash
cd server
npm install
```

Copia el archivo de variables de entorno y ajusta los valores:

```bash
cp .env.example .env
```

Edita `server/.env` con tus valores (ver sección [Variables de entorno](#variables-de-entorno)).

Inicia el servidor en modo desarrollo:

```bash
npm run start:dev
```

El backend quedará disponible en `http://localhost:3000/api`.

### 3. Configurar y ejecutar el frontend

Desde la raíz del proyecto (en una terminal nueva):

```bash
cd ..
npm install
```

Crea el archivo de variables de entorno del frontend:

```bash
echo "VITE_API_URL=http://localhost:3000" > .env.local
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## Variables de entorno

### Backend — `server/.env`

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb://localhost:27017/pokedex` |
| `JWT_SECRET` | Clave secreta para firmar los tokens JWT | `change-me-in-production` |
| `PORT` | Puerto en el que escucha la API | `3000` |

> **Importante:** Cambia `JWT_SECRET` por una cadena aleatoria y segura antes de cualquier despliegue en producción.

### Frontend — `.env.local` (raíz del proyecto)

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_API_URL` | URL base de la API REST | `http://localhost:3000` |

---

## Endpoints de la API

Todos los endpoints tienen el prefijo `/api`. Los endpoints marcados como **Sí** en la columna Auth requieren el header `Authorization: Bearer <token>`.

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Registra un nuevo usuario y devuelve un JWT | No |
| `POST` | `/api/auth/login` | Autentica credenciales y devuelve un JWT | No |
| `GET` | `/api/users/me` | Devuelve el perfil y favoritos del usuario autenticado | Sí |
| `POST` | `/api/users/favorites/:pokemonId` | Añade un Pokémon a la lista de favoritos | Sí |
| `DELETE` | `/api/users/favorites/:pokemonId` | Elimina un Pokémon de la lista de favoritos | Sí |
| `GET` | `/api/teams` | Lista todos los equipos del usuario autenticado | Sí |
| `POST` | `/api/teams` | Crea un nuevo equipo (máx. 6 miembros) | Sí |
| `PATCH` | `/api/teams/:id` | Actualiza el nombre o los miembros de un equipo | Sí |
| `DELETE` | `/api/teams/:id` | Elimina un equipo por su ID | Sí |
| `GET` | `/api/pokemon` | Lista Pokémon con paginación (`?limit=20&offset=0`) | No |
| `GET` | `/api/pokemon/:id` | Devuelve el detalle de un Pokémon (con caché en BD) | No |

### Ejemplo: registro de usuario

**Request**
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "ash",
  "email": "ash@kanto.com",
  "password": "pikachu123"
}
```

**Response `201 Created`**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6683a4f2b3c1d2e4f5a6b7c8",
    "username": "ash",
    "email": "ash@kanto.com"
  }
}
```

---

## Estructura del proyecto

```
pokedex/
├── package.json                  # Dependencias y scripts del frontend
├── vite.config.js                # Configuración de Vite
├── .env.local                    # Variables de entorno del frontend (no committear)
│
├── src/                          # Código fuente del frontend (React)
│   ├── main.jsx                  # Punto de entrada de React
│   ├── App.jsx                   # Árbol raíz: providers + layout
│   ├── App.css / index.css       # Estilos globales
│   │
│   ├── context/
│   │   ├── AuthContext.jsx       # Estado global de autenticación y sesión
│   │   └── PokedexContext.jsx    # Estado global de la Pokédex (filtros, modal)
│   │
│   ├── hooks/
│   │   ├── useDebounce.js        # Debounce genérico para búsqueda
│   │   ├── usePokemonList.js     # Carga paginada, filtrado y búsqueda
│   │   └── usePokemonDetail.js   # Carga del detalle de un Pokémon
│   │
│   ├── services/
│   │   ├── api.js                # Cliente HTTP hacia la API propia (REST)
│   │   └── pokeapi.js            # Cliente HTTP hacia la PokeAPI pública
│   │
│   ├── components/               # Componentes reutilizables
│   │   ├── Navbar/
│   │   ├── PokemonCard/
│   │   ├── PokemonBadge/
│   │   ├── SearchBar/
│   │   ├── TypeFilter/
│   │   ├── AuthModal/
│   │   ├── LoadingSpinner/
│   │   └── ErrorMessage/
│   │
│   ├── features/                 # Módulos de funcionalidad por dominio
│   │   ├── pokedex/
│   │   │   └── PokedexPage.jsx   # Página principal con grid de Pokémon
│   │   └── pokemon/
│   │       └── PokemonModal.jsx  # Modal de detalle de un Pokémon
│   │
│   └── utils/
│       ├── typeColors.js         # Mapa de colores por tipo de Pokémon
│       └── helpers.js            # Funciones utilitarias (ej. extraer ID de URL)
│
└── server/                       # Código fuente del backend (NestJS)
    ├── package.json
    ├── tsconfig.json
    ├── nest-cli.json
    ├── .env.example              # Plantilla de variables de entorno
    │
    └── src/
        ├── main.ts               # Bootstrap de NestJS (CORS, pipes, prefijo global)
        ├── app.module.ts         # Módulo raíz con MongoDB y módulos de dominio
        │
        ├── auth/                 # Módulo de autenticación
        │   ├── auth.controller.ts
        │   ├── auth.service.ts
        │   ├── auth.module.ts
        │   ├── jwt.strategy.ts
        │   ├── jwt-auth.guard.ts
        │   └── dto/
        │       ├── register.dto.ts
        │       └── login.dto.ts
        │
        ├── users/                # Módulo de usuarios y favoritos
        │   ├── users.controller.ts
        │   ├── users.service.ts
        │   ├── users.module.ts
        │   └── schemas/
        │       └── user.schema.ts
        │
        ├── teams/                # Módulo de equipos
        │   ├── teams.controller.ts
        │   ├── teams.service.ts
        │   ├── teams.module.ts
        │   ├── dto/
        │   │   ├── create-team.dto.ts
        │   │   └── update-team.dto.ts
        │   └── schemas/
        │       └── team.schema.ts
        │
        └── pokemon/              # Módulo proxy + caché de PokeAPI
            ├── pokemon.controller.ts
            ├── pokemon.service.ts
            ├── pokemon.module.ts
            └── schemas/
                └── pokemon-cache.schema.ts
```

---

## Highlights técnicos

Este proyecto fue construido como ejercicio fullstack con el objetivo de demostrar decisiones de diseño reales, no solo la integración de tecnologías.

**Caché de Pokémon en MongoDB**
El servicio `PokemonService` actúa como proxy inteligente: consulta MongoDB antes de llamar a la PokeAPI. Si el documento no existe, lo obtiene y lo persiste con `findOneAndUpdate` + `upsert: true`, lo que garantiza la correcta gestión de peticiones concurrentes sin duplicados.

**Separación de contextos en el frontend**
Se utilizaron dos contextos independientes: `AuthContext` gestiona exclusivamente el estado de sesión (token, usuario, login/logout), mientras que `PokedexContext` gestiona el estado de la UI (filtros, Pokémon seleccionado, vista de favoritos). Esta separación evita re-renders innecesarios y mantiene cada contexto con una responsabilidad única.

**Custom hook `usePokemonList`**
Centraliza la lógica de carga paginada, filtrado por tipo y búsqueda por nombre. Usa refs estables (`offsetRef`, `loadingRef`) para evitar que los callbacks `loadMore` y `retry` se recreen en cada render, garantizando que los event listeners siempre lean el estado más reciente.

**Autenticación JWT sin estado**
El backend no mantiene sesiones en base de datos. El token JWT contiene `userId`, `username` y `email` en el payload. El guard `JwtAuthGuard` valida la firma en cada petición y adjunta el usuario al objeto `Request`, sin necesidad de consultas adicionales a la base de datos.

**Validación con DTOs estrictos**
El pipe global de NestJS (`whitelist: true`, `forbidNonWhitelisted: true`) rechaza cualquier campo no declarado en los DTOs. Esto protege contra inyección de propiedades inesperadas y hace explícito el contrato de cada endpoint.

**Reglas de negocio en el esquema**
Las restricciones de dominio (máximo 100 favoritos por usuario, máximo 6 Pokémon por equipo, username entre 3 y 20 caracteres) se definen directamente en los esquemas de Mongoose con validadores declarativos, manteniendo la lógica de negocio cerca del modelo de datos.

---

## Contribuir

1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad: `git checkout -b feature/nombre-de-la-feature`.
3. Realiza tus cambios y haz commit: `git commit -m "feat: descripción del cambio"`.
4. Sube tu rama: `git push origin feature/nombre-de-la-feature`.
5. Abre un Pull Request describiendo el cambio y su motivación.

---

## Licencia

Distribuido bajo la licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.

---

## Autor

**[Tu nombre]**

- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [linkedin.com/in/tu-perfil](https://linkedin.com/in/tu-perfil)
