# 🚂 Deploy en Railway con pnpm

## 📋 Archivos de Configuración

Se han creado los siguientes archivos para que Railway use **pnpm** en lugar de npm:

### 1. `nixpacks.toml`
Configuración principal de Nixpacks (el builder de Railway):
```toml
[phases.setup]
nixPkgs = ['nodejs_22', 'pnpm']

[phases.install]
cmds = ['pnpm install --frozen-lockfile']

[phases.build]
cmds = [
  'pnpm prisma:generate',
  'pnpm build'
]

[start]
cmd = 'pnpm run start:prod'
```

### 2. `railway.json`
Configuración específica de Railway:
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm prisma:generate && pnpm build"
  },
  "deploy": {
    "startCommand": "pnpm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 3. `.npmrc`
Configuración de pnpm:
```
engine-strict=true
auto-install-peers=true
strict-peer-dependencies=false
```

---

## 🔧 Variables de Entorno en Railway

Asegúrate de configurar estas variables en Railway:

### Variables Requeridas
```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database?schema=public

# App
NODE_ENV=production
PORT=3000

# JWT
JWT_SECRET=tu-super-secreto-jwt-en-produccion
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=https://tu-frontend.com

# Swagger
SWAGGER_ENABLED=true
SWAGGER_PASSWORD=password-para-swagger-en-produccion
```

---

## 📦 Pasos para Deploy

### 1. Conectar el Repositorio
1. Ve a [Railway](https://railway.app)
2. Crea un nuevo proyecto
3. Conecta tu repositorio de GitHub

### 2. Configurar el Servicio
Railway detectará automáticamente `nixpacks.toml` y usará pnpm.

### 3. Agregar Base de Datos
1. Click en "New Service"
2. Selecciona "Database" → "PostgreSQL"
3. Railway creará automáticamente la variable `DATABASE_URL`

### 4. Configurar Variables de Entorno
1. Ve a tu servicio → "Variables"
2. Agrega todas las variables listadas arriba
3. Railway provee `DATABASE_URL` automáticamente

### 5. Deploy
1. Haz commit de los archivos de configuración:
```bash
git add nixpacks.toml railway.json .npmrc .gitignore
git commit -m "Configure Railway with pnpm"
git push
```

2. Railway desplegará automáticamente

---

## 🔍 Verificar el Deploy

### Logs
Railway mostrará logs similares a:
```
↳ Detected Node
↳ Using pnpm package manager

Packages
──────────
node  │  22.21.1
pnpm  │  latest

Steps
──────────
▸ install
$ pnpm install --frozen-lockfile

▸ build
$ pnpm prisma:generate
$ pnpm build

Deploy
──────────
$ pnpm run start:prod
```

### Endpoints
Una vez desplegado, prueba:
```bash
# Health check
curl https://tu-app.railway.app

# API Docs (si SWAGGER_ENABLED=true)
https://tu-app.railway.app/api/docs
```

---

## 🐛 Troubleshooting

### Error: "Module not found"
**Solución:** Verifica que `pnpm-lock.yaml` esté commiteado:
```bash
git add pnpm-lock.yaml
git commit -m "Add pnpm lockfile"
git push
```

### Error: "Prisma Client not generated"
**Solución:** Asegúrate que el build command incluya `pnpm prisma:generate`:
```bash
# En nixpacks.toml o railway.json
buildCommand = "pnpm prisma:generate && pnpm build"
```

### Error: "Database connection failed"
**Solución:** Verifica `DATABASE_URL` en las variables:
1. Railway → Variables → DATABASE_URL
2. Debe tener formato: `postgresql://user:password@host:port/database?schema=public`

### Error: "Port already in use"
**Solución:** Railway asigna el puerto automáticamente. No uses un puerto fijo en `.env`:
```typescript
// En main.ts (ya configurado)
const port = configService.get<number>('port') || process.env.PORT || 3000;
await app.listen(port);
```

---

## 📊 Migraciones de Base de Datos

### Primera vez (Deploy inicial)
Railway ejecutará automáticamente las migraciones si tienes configurado:
```json
// package.json
{
  "scripts": {
    "build": "nest build",
    "start:prod": "node dist/main"
  }
}
```

### Migraciones subsecuentes
Debes ejecutar migraciones manualmente:

**Opción 1: Desde Railway CLI**
```bash
railway run pnpm prisma:migrate:prod
```

**Opción 2: Desde el Dashboard**
1. Railway → Service → Settings
2. Custom Build Command:
```bash
pnpm prisma:migrate:prod && pnpm prisma:generate && pnpm build
```

---

## 🔐 Seguridad

### Variables Sensibles
Nunca hagas commit de:
- `.env` (ya en `.gitignore`)
- Secrets de JWT
- Passwords de bases de datos

### Swagger en Producción
Si `SWAGGER_ENABLED=true`:
- Protegido con password (configurado en `SWAGGER_PASSWORD`)
- Solo habilitar si es necesario
- Mejor dejarlo en `false` en producción

---

## 🚀 Optimizaciones

### Caché de Dependencias
Railway cachea `node_modules` automáticamente con pnpm.

### Build Speed
Con pnpm, el build es ~30% más rápido que npm.

### Disk Space
pnpm usa enlaces simbólicos, ahorrando espacio en disco.

---

## 📚 Referencias

- [Railway Docs](https://docs.railway.app)
- [Nixpacks](https://nixpacks.com)
- [pnpm Docs](https://pnpm.io)
- [NestJS Production](https://docs.nestjs.com/faq/serverless)

---

**Última actualización:** 2025-11-03  
**Versión:** 1.0.0

