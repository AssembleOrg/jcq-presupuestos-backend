# 📊 Nuevos Módulos - Projects, Clients y Paids

## ✅ Módulos Implementados

Se han agregado 3 nuevos módulos completos para gestión de presupuestos:

### 1. **Clients (Clientes)** 👥

Gestión de clientes con validación de CUIT o DNI obligatorio.

**Modelo:**
```prisma
model Client {
  id        String
  fullname  String      # Nombre completo (empresa o persona)
  phone     String      # Teléfono de contacto
  cuit      String?     # CUIT (opcional si tiene DNI)
  dni       String?     # DNI (opcional si tiene CUIT)
  projects  Project[]   # Proyectos del cliente
  
  createdAt DateTime
  updatedAt DateTime
  deletedAt DateTime?   # Soft delete
}
```

**Endpoints:**
```
POST   /api/clients          # Crear cliente (requiere CUIT o DNI)
GET    /api/clients          # Listar clientes (con paginación opcional)
GET    /api/clients/:id      # Obtener cliente por ID
PATCH  /api/clients/:id      # Actualizar cliente
DELETE /api/clients/:id      # Eliminar cliente (soft delete)
```

**Validaciones:**
- ✅ CUIT o DNI es obligatorio (al menos uno)
- ✅ Todos los campos validados con mensajes en español

---

### 2. **Projects (Proyectos)** 🏗️

Gestión de proyectos con ubicación geográfica (Google Maps/Leaflet).

**Modelo:**
```prisma
model Project {
  id               String
  amount           Float      # Total a pagar
  totalPaid        Float      # Total pagado hasta ahora
  rest             Float      # Restante a pagar (calculado)
  
  clientId         String     # Relación con cliente
  client           Client
  
  locationAddress  String?    # Dirección legible
  locationLat      Float?     # Latitud (para mapas)
  locationLng      Float?     # Longitud (para mapas)
  
  workers          Int        # Cantidad de personal
  dateInit         DateTime   # Fecha de inicio
  dateEnd          DateTime   # Fecha de finalización
  
  paids            Paid[]     # Pagos del proyecto
  
  createdAt        DateTime
  updatedAt        DateTime
  deletedAt        DateTime?  # Soft delete
}
```

**Endpoints:**
```
POST   /api/projects         # Crear proyecto
GET    /api/projects         # Listar proyectos (con paginación opcional)
GET    /api/projects/:id     # Obtener proyecto con pagos
PATCH  /api/projects/:id     # Actualizar proyecto
DELETE /api/projects/:id     # Eliminar proyecto (soft delete)
```

**Características especiales:**
- ✅ **Ubicación geográfica**: Almacena lat/lng + dirección
- ✅ **Compatible con Leaflet y Google Maps**
- ✅ **Cálculo automático** del restante (rest = amount - totalPaid)
- ✅ **Validación de fechas**: dateEnd debe ser posterior a dateInit
- ✅ **Validación de cliente**: Debe existir antes de crear proyecto

**Ejemplo de ubicación:**
```json
{
  "locationAddress": "Av. Corrientes 1234, Buenos Aires",
  "locationLat": -34.603722,
  "locationLng": -58.381592
}
```

---

### 3. **Paids (Pagos)** 💰

Gestión de pagos con actualización automática de totales del proyecto.

**Modelo:**
```prisma
model Paid {
  id          String
  amount      Float      # Monto del pago
  date        DateTime   # Fecha del pago
  
  projectId   String     # Relación con proyecto
  project     Project
  
  createdAt   DateTime
  updatedAt   DateTime
  deletedAt   DateTime?  # Soft delete
}
```

**Endpoints:**
```
POST   /api/paids                    # Registrar pago
GET    /api/paids                    # Listar pagos (con paginación opcional)
GET    /api/paids/project/:projectId # Obtener pagos de un proyecto
GET    /api/paids/:id                # Obtener pago por ID
PATCH  /api/paids/:id                # Actualizar pago
DELETE /api/paids/:id                # Eliminar pago (soft delete)
```

**Características especiales:**
- ✅ **Actualización automática**: Al crear/actualizar/eliminar un pago, se recalculan los totales del proyecto
- ✅ **Validación de montos**: No permite pagos que excedan el restante del proyecto
- ✅ **Cálculos automáticos**: 
  - `totalPaid` = suma de todos los pagos
  - `rest` = amount - totalPaid

---

## 🔄 Relaciones entre Módulos

```
Client (1) ──── (N) Project (1) ──── (N) Paid

- Un Cliente puede tener múltiples Proyectos
- Un Proyecto pertenece a un Cliente
- Un Proyecto puede tener múltiples Pagos
- Un Pago pertenece a un Proyecto
```

---

## 📋 Ejemplos de Uso

### 1. Crear un Cliente

```bash
POST /api/auth/login
# Obtener token primero

POST /api/clients
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullname": "Constructora ABC S.A.",
  "phone": "+54 11 1234-5678",
  "cuit": "20123456789"
}
```

### 2. Crear un Proyecto

```bash
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 500000,
  "clientId": "uuid-del-cliente",
  "locationAddress": "Av. Corrientes 1234, Buenos Aires",
  "locationLat": -34.603722,
  "locationLng": -58.381592,
  "workers": 15,
  "dateInit": "2025-01-15T10:00:00Z",
  "dateEnd": "2025-03-15T10:00:00Z"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-del-proyecto",
    "amount": 500000,
    "totalPaid": 0,
    "rest": 500000,
    "client": {
      "id": "uuid-del-cliente",
      "fullname": "Constructora ABC S.A.",
      ...
    },
    ...
  }
}
```

### 3. Registrar un Pago

```bash
POST /api/paids
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 100000,
  "date": "2025-02-01T10:00:00Z",
  "projectId": "uuid-del-proyecto"
}
```

**Resultado automático:**
- Se crea el pago
- Se actualiza `totalPaid` del proyecto: 100000
- Se actualiza `rest` del proyecto: 400000

### 4. Obtener Proyectos con Paginación

```bash
GET /api/projects?page=1&limit=10
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "amount": 500000,
      "totalPaid": 100000,
      "rest": 400000,
      "client": {...},
      "locationLat": -34.603722,
      "locationLng": -58.381592,
      ...
    }
  ],
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

### 5. Obtener Pagos de un Proyecto

```bash
GET /api/paids/project/{projectId}
Authorization: Bearer <token>
```

---

## 🗺️ Integración con Mapas

### Para Google Maps:

```javascript
const project = {
  locationLat: -34.603722,
  locationLng: -58.381592,
  locationAddress: "Av. Corrientes 1234, Buenos Aires"
};

// Crear marcador
const marker = new google.maps.Marker({
  position: { lat: project.locationLat, lng: project.locationLng },
  map: map,
  title: project.locationAddress
});
```

### Para Leaflet:

```javascript
const project = {
  locationLat: -34.603722,
  locationLng: -58.381592,
  locationAddress: "Av. Corrientes 1234, Buenos Aires"
};

// Crear marcador
L.marker([project.locationLat, project.locationLng])
  .addTo(map)
  .bindPopup(project.locationAddress);
```

---

## 🔐 Permisos por Rol

| Acción | Admin | Subadmin | Manager |
|--------|-------|----------|---------|
| **Clientes** |
| Crear | ✅ | ✅ | ✅ |
| Listar | ✅ | ✅ | ✅ |
| Ver | ✅ | ✅ | ✅ |
| Editar | ✅ | ✅ | ✅ |
| Eliminar | ✅ | ✅ | ❌ |
| **Proyectos** |
| Crear | ✅ | ✅ | ✅ |
| Listar | ✅ | ✅ | ✅ |
| Ver | ✅ | ✅ | ✅ |
| Editar | ✅ | ✅ | ✅ |
| Eliminar | ✅ | ✅ | ❌ |
| **Pagos** |
| Crear | ✅ | ✅ | ✅ |
| Listar | ✅ | ✅ | ✅ |
| Ver | ✅ | ✅ | ✅ |
| Editar | ✅ | ✅ | ✅ |
| Eliminar | ✅ | ✅ | ❌ |

---

## 📊 Swagger

Todos los endpoints están completamente documentados en Swagger:

```
http://localhost:3000/api/docs
```

Categorías agregadas:
- 📋 **Clientes** - Gestión de clientes
- 🏗️ **Proyectos** - Gestión de proyectos con ubicación geográfica
- 💰 **Pagos** - Gestión de pagos de proyectos

---

## ✨ Características Implementadas

### Para todos los módulos:
- ✅ CRUD completo
- ✅ Paginación opcional
- ✅ Soft delete
- ✅ Timestamps en GMT-3 (Buenos Aires)
- ✅ Validación completa en español
- ✅ Auditoría automática (IP real + geolocalización)
- ✅ Documentación Swagger completa
- ✅ Tipado estricto (sin `any`)
- ✅ Clean Architecture con barrels

### Específicas de Projects:
- ✅ Ubicación geográfica (lat/lng + dirección)
- ✅ Compatible con Google Maps y Leaflet
- ✅ Cálculo automático de restantes
- ✅ Validación de fechas

### Específicas de Paids:
- ✅ Actualización automática de totales del proyecto
- ✅ Validación de montos vs restante
- ✅ Recalculo automático al eliminar pagos

---

## 🚀 Siguiente Paso

Ejecutar la migración para crear las tablas:

```bash
pnpm prisma:migrate
```

Y comenzar a usar los nuevos endpoints! 🎉

