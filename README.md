# JCQ Presupuestos Backend

Sistema de gestión de presupuestos en estructuras construido con NestJS, PostgreSQL y Prisma.

## 🚀 Características

- ✅ **Clean Architecture** - Arquitectura limpia con uso obligatorio de barrels
- ✅ **PostgreSQL + Prisma** - ORM con tipado estricto y migraciones
- ✅ **JWT Authentication** - Autenticación con roles (Admin, Subadmin, Manager)
- ✅ **Auditoría Completa** - Sistema de auditoría con IP real y geolocalización
- ✅ **Swagger UI** - Documentación interactiva con protección por contraseña en producción
- ✅ **Paginación** - Soporte completo de paginación en todos los endpoints CRUD
- ✅ **Soft Delete** - Eliminación lógica con timestamps en GMT-3 (Buenos Aires)
- ✅ **Validación** - Validaciones con mensajes en español
- ✅ **Interceptores** - Response y Audit interceptors
- ✅ **CORS** - Habilitado y configurable

## 📋 Requisitos Previos

- Node.js >= 18
- pnpm >= 8
- PostgreSQL >= 14

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd jcq-presupuestos-backend
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Configurar variables de entorno**

Copiar el archivo `.env.example` y crear `.env`:
```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:
```env
# Environment
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/jcq_presupuestos?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=7d

# Swagger
SWAGGER_ENABLED=true
SWAGGER_PASSWORD=admin123

# Application
PORT=3000
CORS_ORIGIN=*

# Timezone
TZ=America/Argentina/Buenos_Aires
```

4. **Generar cliente de Prisma**
```bash
pnpm prisma:generate
```

5. **Ejecutar migraciones**
```bash
pnpm prisma:migrate
```

6. **Ejecutar seed (crear usuarios iniciales)**
```bash
pnpm prisma:seed
```

## 🏃 Ejecución

### Desarrollo
```bash
pnpm start:dev
```

### Producción
```bash
pnpm build
pnpm start:prod
```

### Debug
```bash
pnpm start:debug
```

## 📚 Usuarios de Prueba

Después de ejecutar el seed, tendrás estos usuarios disponibles:

| Email | Password | Rol |
|-------|----------|-----|
| admin@jcq.com | password123 | ADMIN |
| subadmin@jcq.com | password123 | SUBADMIN |
| manager@jcq.com | password123 | MANAGER |

## 🔐 Autenticación y Autorización

### Roles

- **ADMIN**: Acceso completo a todos los endpoints
- **SUBADMIN**: Puede crear y gestionar usuarios (excepto eliminar)
- **MANAGER**: Solo lectura de usuarios

### Uso de JWT

1. **Login**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@jcq.com",
  "password": "password123"
}
```

2. **Usar el token en requests**
```bash
Authorization: Bearer <token>
```

### Decoradores

- `@Public()` - Para rutas públicas (sin autenticación)
- `@Roles(UserRole.ADMIN, UserRole.SUBADMIN)` - Para proteger rutas por rol
- `@Auditory({ action: 'CREATE', entity: 'User' })` - Para auditar acciones

## 📖 Documentación API (Swagger)

Acceder a la documentación interactiva:

**Desarrollo:**
```
http://localhost:3000/api/docs
```

**Producción:**
```
http://localhost:3000/api/docs
Usuario: admin
Contraseña: <SWAGGER_PASSWORD del .env>
```

## 🗄️ Base de Datos

### Comandos Prisma

```bash
# Generar cliente Prisma
pnpm prisma:generate

# Crear nueva migración
pnpm prisma:migrate

# Ejecutar migraciones en producción
pnpm prisma:migrate:prod

# Ejecutar seed
pnpm prisma:seed

# Abrir Prisma Studio (GUI)
pnpm prisma:studio

# Resetear base de datos (desarrollo)
pnpm db:reset
```

### Modelos

#### User
```prisma
- id: UUID
- email: String (unique)
- password: String (hashed)
- firstName: String
- lastName: String
- role: UserRole (ADMIN, SUBADMIN, MANAGER)
- isActive: Boolean
- createdAt: DateTime
- updatedAt: DateTime
- deletedAt: DateTime? (soft delete)
```

#### AuditLog
```prisma
- id: UUID
- userId: String?
- action: String (CREATE, UPDATE, DELETE, READ)
- entity: String (nombre de la entidad)
- entityId: String
- changes: Json (cambios realizados)
- ip: String (IP real del usuario)
- location: String? (geolocalización)
- userAgent: String?
- createdAt: DateTime
```

## 🏗️ Estructura del Proyecto

```
src/
├── common/                 # Utilidades compartidas
│   ├── decorators/        # @Public, @Auditory, @Roles, @GetUser
│   ├── filters/           # Filtros de excepciones
│   ├── guards/            # JWT y Roles guards
│   ├── interceptors/      # Response y Audit interceptors
│   ├── interfaces/        # Interfaces compartidas
│   ├── pipes/             # Pipes de validación
│   └── utils/             # Utilidades (IP, Location)
├── config/                # Configuración de la aplicación
├── modules/               # Módulos de la aplicación
│   ├── auth/             # Autenticación y JWT
│   └── users/            # Gestión de usuarios
├── prisma/               # Servicio de Prisma
├── app.module.ts
└── main.ts
```

## 📝 Endpoints Principales

### Autenticación

```
POST   /api/auth/login              # Iniciar sesión
```

### Usuarios

```
GET    /api/users                   # Listar usuarios (con/sin paginación)
GET    /api/users/:id               # Obtener usuario por ID
POST   /api/users                   # Crear usuario (Admin/Subadmin)
PATCH  /api/users/:id               # Actualizar usuario (Admin/Subadmin)
DELETE /api/users/:id               # Eliminar usuario (Admin)
```

### Paginación

Para usar paginación, agregar query params:
```
GET /api/users?page=1&limit=10
```

**Respuesta:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## 🔍 Auditoría

Todas las operaciones CRUD están auditadas automáticamente cuando se usa el decorador `@Auditory`:

- **IP Real**: Captura la IP real del usuario (no proxy)
- **Geolocalización**: Ubicación aproximada basada en IP
- **User Agent**: Información del navegador/cliente
- **Cambios**: JSON con los datos modificados

## 🌍 Zona Horaria

El sistema usa **GMT-3 (America/Argentina/Buenos_Aires)** con la librería Luxon para todas las operaciones de fecha/hora.

## 🛡️ Seguridad

- Contraseñas hasheadas con bcrypt (10 rounds)
- JWT con expiración configurable
- Validación de datos con class-validator
- Soft delete para preservar datos
- Swagger protegido con contraseña en producción
- Validación de roles en cada endpoint

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov

# Watch mode
pnpm test:watch
```

## 📦 Scripts Disponibles

```bash
pnpm start              # Iniciar aplicación
pnpm start:dev          # Modo desarrollo con watch
pnpm start:debug        # Modo debug
pnpm start:prod         # Modo producción
pnpm build              # Compilar proyecto
pnpm format             # Formatear código
pnpm lint               # Ejecutar linter
pnpm prisma:generate    # Generar cliente Prisma
pnpm prisma:migrate     # Ejecutar migraciones
pnpm prisma:seed        # Ejecutar seed
pnpm prisma:studio      # Abrir Prisma Studio
pnpm db:reset           # Resetear base de datos
```

## 🚧 Próximos Pasos

Para continuar el desarrollo:

1. Agregar más esquemas según necesidades del negocio
2. Implementar módulos adicionales (Budgets, Projects, etc.)
3. Agregar loggers HTTP avanzados
4. Implementar caché con Redis (opcional)
5. Agregar tests unitarios y e2e
6. Configurar CI/CD

## 📄 Licencia

UNLICENSED - Uso privado

## 👥 Soporte

Para soporte o consultas, contactar al equipo de desarrollo.
