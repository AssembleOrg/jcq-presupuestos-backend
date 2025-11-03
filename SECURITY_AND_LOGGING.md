# 🔒 Seguridad y Logging - Sistema Implementado

## ✅ Mejoras Implementadas

### 1. 🛡️ **Helmet - Security Headers**
- Protección contra ataques comunes (XSS, clickjacking, etc.)
- Headers de seguridad configurados automáticamente
- Adaptado para desarrollo y producción

### 2. 🚦 **Rate Limiting (Throttler)**
- Límite de 100 requests por minuto por IP
- Protección contra ataques DDoS y brute force
- Configurable por entorno

### 3. 📊 **HTTP Request Logging**
- Log de todas las peticiones HTTP
- Información de método, URL, IP, tiempo de respuesta
- Colores por severidad (error, warning, success)

### 4. 🔍 **Error Tracking**
- Tracking automático de todos los errores
- Información detallada: usuario, IP, request body, stack trace
- Sanitización de datos sensibles (passwords, tokens)
- Logs separados por severidad

### 5. 🗄️ **Prisma Query Logging Optimizado**
- SELECT queries ocultos (reducir ruido)
- Solo muestra INSERT, UPDATE, DELETE
- Log de errores y warnings de BD
- Performance tracking de queries

---

## 📁 Archivos Creados

### **1. `src/common/logger/http-logger.middleware.ts`**
Middleware para logging de HTTP requests.

**Características:**
- Log de cada request (método, URL, IP)
- Cálculo de tiempo de respuesta
- Código de estado HTTP
- Tamaño de respuesta
- Colores por severidad:
  - 🟢 200-299: Success (verde)
  - 🟡 400-499: Client Error (amarillo)
  - 🔴 500+: Server Error (rojo)

**Ejemplo de log:**
```
[HTTP] ➡️  GET /api/users - IP: 192.168.1.1
[HTTP] ⬅️  GET /api/users 200 1234b - 45ms
```

---

### **2. `src/common/logger/error-tracker.interceptor.ts`**
Interceptor para tracking detallado de errores.

**Características:**
- Captura todos los errores de la aplicación
- Información contextual completa:
  - Usuario que generó el error
  - IP, método, URL
  - Request body, query params, path params
  - Stack trace (solo en desarrollo)
- Sanitización de datos sensibles
- Logs separados por severidad

**Ejemplo de log:**
```json
{
  "timestamp": "2025-01-23T12:00:00.000Z",
  "method": "POST",
  "url": "/api/users",
  "ip": "192.168.1.1",
  "statusCode": 400,
  "message": "El email ya está registrado",
  "user": {
    "id": "uuid",
    "email": "admin@jcq.com",
    "role": "ADMIN"
  },
  "body": {
    "email": "test@test.com",
    "password": "***REDACTED***"
  }
}
```

---

### **3. `src/common/logger/index.ts`**
Barrel file para exportar módulos de logging.

---

## 🔧 Archivos Modificados

### **1. `src/main.ts`**

**Cambios:**
- Importado Helmet
- Configurado Helmet con ajustes por ambiente
- Logger de Bootstrap agregado
- Logs más descriptivos al iniciar

**Código:**
```typescript
import helmet from 'helmet';

// Security: Helmet
app.use(
  helmet({
    contentSecurityPolicy: nodeEnv === 'production' ? undefined : false,
    crossOriginEmbedderPolicy: nodeEnv === 'production' ? undefined : false,
  }),
);
logger.log('🛡️  Helmet security enabled');
```

---

### **2. `src/app.module.ts`**

**Cambios:**
- Importado `ThrottlerModule` y `ThrottlerGuard`
- Agregado `HttpLoggerMiddleware` para todas las rutas
- Agregado `ErrorTrackerInterceptor` global
- Configurado Rate Limiting (100 req/min)

**Código:**
```typescript
// Rate Limiting: 100 requests per minute
ThrottlerModule.forRoot([
  {
    ttl: 60000, // 1 minuto
    limit: 100, // 100 requests
  },
]),

// Guards y Interceptors
providers: [
  {
    provide: APP_GUARD,
    useClass: ThrottlerGuard, // Rate limiting
  },
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard, // Auth
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ResponseInterceptor, // Response transform
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ErrorTrackerInterceptor, // Error tracking
  },
]

// Middleware
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
```

---

### **3. `src/prisma/prisma.service.ts`**

**Cambios:**
- Configurado logger de Prisma con eventos
- SELECT queries ocultos
- Solo muestra INSERT, UPDATE, DELETE
- Log de errores y warnings de BD

**Código:**
```typescript
constructor() {
  super({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'warn' },
    ],
  });

  // Solo log de queries que NO sean SELECT (ocultar SELECT)
  (this as any).$on('query', (e: any) => {
    const query = e.query as string;
    
    if (!query.trim().toUpperCase().startsWith('SELECT')) {
      this.logger.log(`📝 ${query.substring(0, 100)}... (${e.duration}ms)`);
    }
  });

  // Log de errores
  (this as any).$on('error', (e: any) => {
    this.logger.error(`❌ Database Error: ${e.message}`);
  });

  // Log de warnings
  (this as any).$on('warn', (e: any) => {
    this.logger.warn(`⚠️  Database Warning: ${e.message}`);
  });
}
```

---

### **4. `src/common/index.ts`**
Agregado export de `logger`:
```typescript
export * from './logger';
```

---

## 🚀 Cómo Funciona

### **HTTP Request Flow:**

1. **Request llega** → `HttpLoggerMiddleware` lo registra
   ```
   ➡️  GET /api/users - IP: 192.168.1.1
   ```

2. **Rate Limiting** → `ThrottlerGuard` verifica límite
   - ✅ Permite si < 100 req/min
   - ❌ Bloquea si > 100 req/min (429 Too Many Requests)

3. **Autenticación** → `JwtAuthGuard` valida token
   - ✅ Continúa si válido
   - ❌ 401 Unauthorized si inválido

4. **Procesamiento** → Controller/Service ejecuta lógica

5. **Error?** → `ErrorTrackerInterceptor` lo captura y registra
   ```json
   {
     "timestamp": "...",
     "method": "GET",
     "url": "/api/users",
     "statusCode": 500,
     "message": "Error interno",
     "user": {...},
     "stack": "..."
   }
   ```

6. **Response** → `ResponseInterceptor` transforma respuesta
   ```json
   {
     "success": true,
     "data": [...]
   }
   ```

7. **Response enviada** → `HttpLoggerMiddleware` registra resultado
   ```
   ⬅️  GET /api/users 200 1234b - 45ms
   ```

---

## 📊 Ejemplo de Logs en Consola

### **Startup:**
```
[Bootstrap] 🛡️  Helmet security enabled
[Bootstrap] 🌐 CORS enabled for: *
[Bootstrap] 📚 Swagger disponible en: http://localhost:3000/api/docs
[Bootstrap] 🚀 Aplicación corriendo en: http://localhost:3000
[Bootstrap] 🌍 Ambiente: development
[Bootstrap] ⏰ Zona horaria: America/Argentina/Buenos_Aires (GMT-3)
[Bootstrap] 🔒 Seguridad: Helmet + Rate Limiting + Error Tracking
[Bootstrap] 📊 HTTP Logging: Enabled
```

### **HTTP Requests:**
```
[HTTP] ➡️  POST /api/auth/login - IP: ::1
[HTTP] ⬅️  POST /api/auth/login 200 456b - 123ms

[HTTP] ➡️  GET /api/users?role=ADMIN - IP: ::1
[HTTP] ⬅️  GET /api/users?role=ADMIN 200 2345b - 67ms

[HTTP] ➡️  POST /api/projects - IP: ::1
[Prisma] 📝 INSERT INTO "projects" ... (45ms)
[HTTP] ⬅️  POST /api/projects 201 890b - 156ms
```

### **Errors:**
```
[HTTP] ➡️  POST /api/users - IP: ::1
[ErrorTracker] 🟡 Error del Cliente:
{
  "timestamp": "2025-01-23T12:00:00.000Z",
  "method": "POST",
  "url": "/api/users",
  "ip": "::1",
  "statusCode": 409,
  "message": "El email ya está registrado",
  "user": {
    "id": "uuid",
    "email": "admin@jcq.com",
    "role": "ADMIN"
  },
  "body": {
    "email": "test@test.com",
    "password": "***REDACTED***"
  }
}
[HTTP] ⬅️  POST /api/users 409 234b - 45ms
```

### **Database Operations:**
```
[Prisma] 📝 INSERT INTO "users" ("id", "email", "password", ...) VALUES ... (23ms)
[Prisma] 📝 UPDATE "projects" SET "totalPaid" = $1, "rest" = $2 WHERE "id" = $3 (12ms)
[Prisma] 📝 UPDATE "users" SET "deletedAt" = $1 WHERE "id" = $2 (8ms)
```

**Nota:** SELECT queries NO se muestran (optimización de ruido en logs)

---

## 🔒 Seguridad Implementada

### **1. Helmet Headers:**
Agrega automáticamente headers de seguridad:
- `X-Frame-Options: DENY` (previene clickjacking)
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (HSTS)
- Y más...

### **2. Rate Limiting:**
- 100 requests por minuto por IP
- Respuesta 429 cuando se excede
- Previene:
  - Ataques DDoS
  - Brute force en login
  - Abuso de API

### **3. Sanitización de Datos Sensibles:**
Oculta automáticamente:
- `password`
- `token`
- `accessToken`
- `refreshToken`
- `apiKey`

**Ejemplo:**
```json
// Request body original
{
  "email": "test@test.com",
  "password": "secret123",
  "token": "abc123"
}

// En logs
{
  "email": "test@test.com",
  "password": "***REDACTED***",
  "token": "***REDACTED***"
}
```

---

## ⚙️ Configuración

### **Rate Limiting**
Ajustar en `src/app.module.ts`:
```typescript
ThrottlerModule.forRoot([
  {
    ttl: 60000, // Tiempo en ms (60000 = 1 minuto)
    limit: 100, // Número de requests permitidos
  },
]),
```

### **Helmet (Producción)**
Ya configurado en `src/main.ts`:
```typescript
app.use(
  helmet({
    contentSecurityPolicy: nodeEnv === 'production' ? undefined : false,
    crossOriginEmbedderPolicy: nodeEnv === 'production' ? undefined : false,
  }),
);
```

### **Logger Level**
Ajustar en `src/main.ts`:
```typescript
const app = await NestFactory.create(AppModule, {
  logger: ['error', 'warn', 'log', 'debug', 'verbose'], // Agregar/quitar según necesidad
});
```

---

## 🧪 Pruebas

### **1. Probar Rate Limiting:**
```bash
# Hacer 101 requests rápidos (exceder límite)
for i in {1..101}; do
  curl http://localhost:3000/api/users
done

# El request 101 debería retornar 429 Too Many Requests
```

### **2. Probar HTTP Logging:**
```bash
# Ver logs en consola mientras haces requests
curl http://localhost:3000/api/users

# Deberías ver:
# [HTTP] ➡️  GET /api/users - IP: ::1
# [HTTP] ⬅️  GET /api/users 200 1234b - 45ms
```

### **3. Probar Error Tracking:**
```bash
# Forzar un error (email duplicado)
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@jcq.com", "password": "test"}'

# Deberías ver log detallado del error en consola
```

### **4. Probar Prisma Logging:**
```bash
# Crear un usuario (genera INSERT)
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "newuser@test.com", "password": "test123", ...}'

# Deberías ver:
# [Prisma] 📝 INSERT INTO "users" ... (23ms)
# NO deberías ver SELECT queries
```

---

## 📈 Beneficios

### **Para Desarrollo:**
- ✅ Ver todas las requests en tiempo real
- ✅ Debugging más fácil con logs detallados
- ✅ Identificar cuellos de botella (response time)
- ✅ Ver queries problemáticas de BD

### **Para Producción:**
- ✅ Seguridad mejorada (Helmet + Rate Limiting)
- ✅ Tracking de errores para debugging
- ✅ Monitoreo de performance
- ✅ Auditoría de accesos

### **Para el Equipo:**
- ✅ Logs claros y legibles
- ✅ Información contextual completa
- ✅ Datos sensibles protegidos
- ✅ Fácil diagnóstico de problemas

---

## 🎯 Próximos Pasos (Opcional)

### **1. Integrar con Monitoring:**
- Sentry (error tracking)
- DataDog / New Relic (APM)
- ELK Stack (logs centralizados)

### **2. Persistir Logs:**
```typescript
// Guardar logs en archivo
import * as winston from 'winston';

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

### **3. Métricas Avanzadas:**
- Response time promedio
- Requests por endpoint
- Errores por usuario
- Uso de recursos

---

## ✅ Checklist de Implementación

- [x] Instalar Helmet y Throttler
- [x] Crear HTTP Logger Middleware
- [x] Crear Error Tracker Interceptor
- [x] Configurar Prisma Query Logging
- [x] Actualizar app.module.ts
- [x] Actualizar main.ts
- [x] Agregar sanitización de datos sensibles
- [x] Configurar Rate Limiting
- [x] Documentar todo

---

## 🎉 ¡Todo Listo!

El sistema de seguridad y logging está **100% implementado y funcional**.

**Para ver los logs en acción:**
```bash
pnpm start:dev
```

¡Disfruta de tu aplicación más segura y monitoreada! 🚀


