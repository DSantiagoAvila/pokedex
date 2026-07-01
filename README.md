# Pokédex

Una Pokédex que construí para practicar desarrollo fullstack. El frontend consume la PokeAPI directamente y el backend maneja autenticación, favoritos y equipos con su propia base de datos en MySQL.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=flat&logo=nestjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=flat&logo=mysql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)

---

## ¿Qué hace?

- Muestra los Pokémon en tarjetas con imagen oficial, nombre, número y tipos en español
- Búsqueda por nombre con debounce para no spamear la API
- Filtros por tipo (fuego, agua, planta, etc.)
- Modal de detalle con estadísticas, habilidades, cadena de evolución y movimientos
- Sistema de cuentas: registro, inicio de sesión y sesión persistente
- Guardar Pokémon favoritos por usuario
- Crear y gestionar equipos de hasta 6 Pokémon
- Diseño responsive para móvil, tablet y escritorio

---

## Stack

| | Tecnología |
|---|---|
| Frontend | React 19, Vite, JavaScript, CSS Modules |
| Backend | NestJS, TypeScript, TypeORM, Passport JWT |
| Base de datos | MySQL 8 |

---

## Cómo correrlo localmente

### Requisitos
- Node.js 18+
- MySQL 8 corriendo localmente

### 1. Clonar el repo

```bash
git clone https://github.com/tu-usuario/pokedex.git
cd pokedex
```

### 2. Crear la base de datos

En MySQL Workbench o tu terminal de MySQL:

```sql
CREATE DATABASE pokedex CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configurar y levantar el backend

```bash
cd server
npm install
cp .env.example .env
```

Edita `server/.env` con tus credenciales de MySQL:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=tu_contraseña
DB_NAME=pokedex
JWT_SECRET=cambia-esto-en-produccion
PORT=3000
```

```bash
npm run start:dev
```

TypeORM crea las tablas automáticamente al iniciar. El backend queda en `http://localhost:3000/api`.

### 4. Levantar el frontend

En otra terminal, desde la raíz del proyecto:

```bash
npm install
echo "VITE_API_URL=http://localhost:3000" > .env.local
npm run dev
```

Abre `http://localhost:5173`.

---

## Variables de entorno

**`server/.env`**

| Variable | Para qué sirve |
|---|---|
| `DB_HOST` | Host de MySQL (normalmente `localhost`) |
| `DB_PORT` | Puerto de MySQL (por defecto `3306`) |
| `DB_USER` | Usuario de MySQL |
| `DB_PASS` | Contraseña de MySQL |
| `DB_NAME` | Nombre de la base de datos |
| `JWT_SECRET` | Clave para firmar los tokens JWT |
| `PORT` | Puerto del servidor (por defecto `3000`) |

**`.env.local` (raíz)**

| Variable | Para qué sirve |
|---|---|
| `VITE_API_URL` | URL del backend (`http://localhost:3000`) |

---

## API

Todos los endpoints llevan el prefijo `/api`. Los protegidos requieren `Authorization: Bearer <token>`.

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Crear cuenta | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/users/me` | Ver mi perfil y favoritos | Sí |
| POST | `/api/users/favorites/:id` | Agregar favorito | Sí |
| DELETE | `/api/users/favorites/:id` | Quitar favorito | Sí |
| GET | `/api/teams` | Mis equipos | Sí |
| POST | `/api/teams` | Crear equipo | Sí |
| PATCH | `/api/teams/:id` | Editar equipo | Sí |
| DELETE | `/api/teams/:id` | Eliminar equipo | Sí |
| GET | `/api/pokemon` | Lista paginada (proxy PokeAPI) | No |
| GET | `/api/pokemon/:id` | Detalle con caché en BD | No |

---

## Estructura

```
pokedex/
├── src/                        # Frontend React
│   ├── components/             # Navbar, PokemonCard, SearchBar, etc.
│   ├── context/                # AuthContext, PokedexContext
│   ├── features/
│   │   ├── pokedex/            # Página principal con el grid
│   │   └── pokemon/            # Modal de detalle
│   ├── hooks/                  # usePokemonList, usePokemonDetail, useDebounce
│   ├── services/
│   │   ├── api.js              # Llamadas al backend propio
│   │   └── pokeapi.js          # Llamadas a la PokeAPI
│   └── utils/                  # Colores por tipo, helpers
│
└── server/                     # Backend NestJS
    └── src/
        ├── auth/               # Register, login, JWT strategy
        ├── users/              # Perfil y favoritos
        ├── teams/              # CRUD de equipos
        └── pokemon/            # Proxy + caché de PokeAPI
```

---

## Autor

**Daniel Avilar**

- GitHub: [@dan1s](https://github.com/dan1s)
- LinkedIn: [linkedin.com/in/tu-perfil](https://linkedin.com/in/tu-perfil)
