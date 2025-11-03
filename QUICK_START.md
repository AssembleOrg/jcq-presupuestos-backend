# 🚀 Guía Rápida de Inicio

## Pasos para iniciar el proyecto

### 1️⃣ Configurar Base de Datos

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Copiar desde el ejemplo
cp .env.example .env
```

Edita `.env` y configura tu base de datos PostgreSQL:

```env
DATABASE_URL="postgresql://tu_usuario:tu_password@localhost:5432/jcq_presupuestos?schema=public"
```

### 2️⃣ Ejecutar Migraciones y Seed

```bash
# Generar cliente de Prisma
pnpm prisma:generate

# Ejecutar migraciones (crea las tablas)
pnpm prisma:migrate

# Crear usuarios de prueba
pnpm prisma:seed
```

**Usuarios creados:**
- admin@jcq.com / password123 (ADMIN)
- subadmin@jcq.com / password123 (SUBADMIN)
- manager@jcq.com / password123 (MANAGER)

### 3️⃣ Iniciar el Servidor

```bash
pnpm start:dev
```

El servidor estará disponible en: `http://localhost:3000`

### 4️⃣ Acceder a Swagger

Abre tu navegador en:
```
http://localhost:3000/api/docs
```

### 5️⃣ Probar la API

#### Login (obtener token)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@jcq.com",
    "password": "password123"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "uuid-del-usuario",
    "email": "admin@jcq.com",
    "role": "ADMIN",
    "firstName": "Admin",
    "lastName": "Sistema"
  }
}
```

#### Obtener lista de usuarios

```bash
curl -X GET "http://localhost:3000/api/users" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

#### Obtener usuarios con paginación

```bash
curl -X GET "http://localhost:3000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

#### Crear un nuevo usuario

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@ejemplo.com",
    "password": "password123",
    "firstName": "Nuevo",
    "lastName": "Usuario",
    "role": "MANAGER"
  }'
```

## 📊 Ver la Base de Datos

Para abrir Prisma Studio (interfaz visual):

```bash
pnpm prisma:studio
```

Se abrirá en: `http://localhost:5555`

## 🔍 Comandos Útiles

```bash
# Ver logs de Prisma
pnpm prisma:studio

# Resetear base de datos (¡cuidado! elimina todos los datos)
pnpm db:reset

# Formatear código
pnpm format

# Ejecutar linter
pnpm lint

# Build para producción
pnpm build
```

## ⚠️ Solución de Problemas

### Error de conexión a PostgreSQL

Verifica que:
1. PostgreSQL esté corriendo
2. El `DATABASE_URL` en `.env` sea correcto
3. La base de datos exista (créala si no existe)

```sql
CREATE DATABASE jcq_presupuestos;
```

### Error "JWT_SECRET not defined"

Asegúrate de que el archivo `.env` existe y tiene la variable `JWT_SECRET` configurada.

### Error "prisma generate"

Ejecuta:
```bash
pnpm prisma:generate
```

## 📚 Más Información

- **README.md** - Documentación completa
- **SETUP_COMPLETE.md** - Resumen de lo implementado
- **Swagger UI** - Documentación interactiva en `/api/docs`

## ✨ ¡Listo para desarrollar!

Tu backend está completamente configurado y funcionando. Ahora puedes:

1. Agregar más modelos en `prisma/schema.prisma`
2. Crear nuevos módulos en `src/modules/`
3. Implementar la lógica de negocio para presupuestos

**¡Feliz desarrollo! 🎉**

