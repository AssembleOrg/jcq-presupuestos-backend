# 🐳 Deploy con Docker (Metal Build Environment)

## ✨ Ventajas del Metal Build Environment

- ✅ **Más rápido** que Nixpacks/Railpack
- ✅ **Usa pnpm** nativamente con Corepack
- ✅ **Multi-stage build** optimizado
- ✅ **Imagen pequeña** (~200MB vs ~500MB)
- ✅ **Caché de capas** eficiente
- ✅ **Healthcheck** incluido
- ✅ **Usuario non-root** (seguridad)

---

## 📦 Estructura del Dockerfile

### Stage 1: Dependencies
```dockerfile
FROM node:22-alpine AS deps
# Instala SOLO las dependencias con pnpm
```

### Stage 2: Builder
```dockerfile
FROM node:22-alpine AS builder
# Genera Prisma Client
# Compila TypeScript → JavaScript
# Elimina dev dependencies
```

### Stage 3: Runner
```dockerfile
FROM node:22-alpine AS runner
# Imagen final ultra-ligera
# Solo contiene: código compilado + node_modules de prod
```

---

## 🚀 Uso en Railway

### 1. Configuración Automática
Railway detectará automáticamente el `Dockerfile` y lo usará.

### 2. Variables de Entorno (Railway Dashboard)
```env
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=production
PORT=3000
JWT_SECRET=tu-secreto-super-seguro
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://tu-frontend.com
SWAGGER_ENABLED=true
SWAGGER_PASSWORD=password-seguro
```

### 3. Deploy
```bash
git add .
git commit -m "feat: Add Docker support for Metal Build Environment"
git push
```

Railway automáticamente:
1. ✅ Detectará `Dockerfile`
2. ✅ Ejecutará multi-stage build
3. ✅ Usará pnpm (via Corepack)
4. ✅ Generará Prisma Client
5. ✅ Compilará la aplicación
6. ✅ Creará imagen optimizada
7. ✅ Desplegará en producción

---

## 🧪 Prueba Local (Opcional)

### Build
```bash
docker build -t jcq-backend .
```

### Run (con .env)
```bash
docker run -p 3000:3000 --env-file .env jcq-backend
```

### Run (con variables manuales)
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="secret" \
  -e NODE_ENV="production" \
  jcq-backend
```

### Verificar
```bash
curl http://localhost:3000
curl http://localhost:3000/api/docs
```

---

## 📊 Tamaños de Imagen

| Stage | Tamaño | Contenido |
|-------|--------|-----------|
| deps | ~800MB | Node + dependencies |
| builder | ~1.2GB | deps + build tools |
| **runner** | **~200MB** | Node + app + prod deps |

Solo la imagen **runner** se despliega en producción.

---

## 🔧 Optimizaciones Incluidas

### 1. **Multi-stage Build**
Solo la imagen final contiene lo necesario para producción.

### 2. **pnpm con Corepack**
```dockerfile
RUN corepack enable && corepack prepare pnpm@latest --activate
```
No necesita instalar pnpm manualmente.

### 3. **Caché de Capas**
```dockerfile
# Primero copia package.json (cambia poco)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Luego copia código (cambia mucho)
COPY . .
RUN pnpm build
```
Docker cachea la instalación de dependencias.

### 4. **Alpine Linux**
```dockerfile
FROM node:22-alpine
```
Imagen base ultra-ligera (~5MB vs ~200MB de Ubuntu).

### 5. **Prisma Optimizado**
```dockerfile
RUN apk add --no-cache openssl libc6-compat
```
Dependencias necesarias para Prisma en Alpine.

### 6. **Usuario Non-root**
```dockerfile
USER nestjs
```
Mejora de seguridad (no ejecuta como root).

### 7. **dumb-init**
```dockerfile
ENTRYPOINT ["dumb-init", "--"]
```
Maneja señales de sistema correctamente (SIGTERM, etc).

### 8. **Healthcheck**
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s
```
Railway puede verificar que la app está saludable.

---

## 🔍 Troubleshooting

### Error: "pnpm: not found"
**Causa:** Corepack no activado correctamente.
**Solución:** Ya está en el Dockerfile:
```dockerfile
RUN corepack enable && corepack prepare pnpm@latest --activate
```

### Error: "Prisma Client not generated"
**Causa:** Prisma no se generó antes del build.
**Solución:** Ya está en el Dockerfile:
```dockerfile
RUN pnpm prisma:generate
RUN pnpm build
```

### Error: "Cannot connect to database"
**Causa:** Variable `DATABASE_URL` no configurada.
**Solución:** Configura en Railway Dashboard → Variables.

### Build muy lento
**Causa:** No usa caché de Docker.
**Solución:** Railway cachea automáticamente. Localmente:
```bash
docker build --cache-from jcq-backend:latest -t jcq-backend .
```

---

## 📈 Comparación: Metal vs Nixpacks vs Railpack

| Feature | Railpack | Nixpacks | **Docker (Metal)** |
|---------|----------|----------|-------------------|
| pnpm support | ❌ No | ⚠️ Deprecated | ✅ Sí (Corepack) |
| Build speed | 🐢 Lento | 🐇 Rápido | 🚀 Muy rápido |
| Caché | ⚠️ Limitado | ✅ Bueno | ✅ Excelente |
| Tamaño imagen | ~500MB | ~400MB | **~200MB** |
| Control | ❌ Bajo | ⚠️ Medio | ✅ Total |
| Customización | ❌ Mínima | ⚠️ Media | ✅ Completa |
| Futuro | ⚠️ Legacy | ⚠️ Deprecated | ✅ Recomendado |

---

## 🎯 Recomendación

**Usa Docker (Metal Build Environment)** porque:
- ✅ Es el futuro de Railway
- ✅ Más rápido y eficiente
- ✅ Mejor control y customización
- ✅ Funciona con pnpm sin problemas
- ✅ Imagen más pequeña = deploys más rápidos

---

## 📚 Referencias

- [Railway Docker Guide](https://docs.railway.app/guides/dockerfiles)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Corepack](https://nodejs.org/api/corepack.html)

---

**Última actualización:** 2025-11-03  
**Versión:** 1.0.0

