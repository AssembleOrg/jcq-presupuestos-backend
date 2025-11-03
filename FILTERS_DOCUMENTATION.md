# 🔍 Sistema de Filtros

## ✅ Implementado

Todos los endpoints (paginados y no paginados) ahora soportan filtros avanzados.

## 📋 Filtros Disponibles

### **Users** (`/api/users` y `/api/users/pagination`)

| Filtro | Tipo | Búsqueda | Descripción |
|--------|------|----------|-------------|
| `email` | String | Parcial | Busca en email (case insensitive) |
| `firstName` | String | Parcial | Busca en nombre (case insensitive) |
| `lastName` | String | Parcial | Busca en apellido (case insensitive) |
| `role` | Enum | Exacta | Filtra por rol (ADMIN, SUBADMIN, MANAGER) |
| `isActive` | Boolean | Exacta | Filtra por estado activo (true/false) |

**Ejemplos:**
```bash
# Buscar usuarios con "juan" en el nombre
GET /api/users?firstName=juan

# Buscar admins activos
GET /api/users?role=ADMIN&isActive=true

# Paginado: buscar por email que contenga "gmail"
GET /api/users/pagination?page=1&limit=10&email=gmail
```

---

### **Clients** (`/api/clients` y `/api/clients/pagination`)

| Filtro | Tipo | Búsqueda | Descripción |
|--------|------|----------|-------------|
| `fullname` | String | Parcial | Busca en nombre completo (case insensitive) |
| `phone` | String | Parcial | Busca en teléfono (case insensitive) |
| `cuit` | String | Exacta | Filtra por CUIT exacto |
| `dni` | String | Exacta | Filtra por DNI exacto |

**Ejemplos:**
```bash
# Buscar clientes con "Constructora" en el nombre
GET /api/clients?fullname=Constructora

# Buscar por teléfono parcial
GET /api/clients?phone=11 1234

# Buscar por CUIT exacto
GET /api/clients?cuit=20123456789

# Paginado: buscar constructoras
GET /api/clients/pagination?page=1&limit=10&fullname=Constructora
```

---

### **Projects** (`/api/projects` y `/api/projects/pagination`)

| Filtro | Tipo | Búsqueda | Descripción |
|--------|------|----------|-------------|
| `clientId` | String | Exacta | Filtra por ID de cliente |
| `status` | Enum | Exacta | Filtra por estado (BUDGET, ACTIVE, IN_PROCESS, FINISHED, DELETED) |
| `locationAddress` | String | Parcial | Busca en dirección (case insensitive) |
| `workersMin` | Number | Rango | Cantidad mínima de trabajadores |
| `workersMax` | Number | Rango | Cantidad máxima de trabajadores |
| `dateInitFrom` | Date | Rango | Fecha de inicio desde |
| `dateInitTo` | Date | Rango | Fecha de inicio hasta |
| `amountMin` | Number | Rango | Monto mínimo |
| `amountMax` | Number | Rango | Monto máximo |

**Ejemplos:**
```bash
# Proyectos activos
GET /api/projects?status=ACTIVE

# Proyectos en Buenos Aires
GET /api/projects?locationAddress=Buenos Aires

# Proyectos con 10-20 trabajadores
GET /api/projects?workersMin=10&workersMax=20

# Proyectos entre $100k y $500k
GET /api/projects?amountMin=100000&amountMax=500000

# Proyectos que inician en enero 2025
GET /api/projects?dateInitFrom=2025-01-01&dateInitTo=2025-01-31

# Paginado: proyectos activos de un cliente
GET /api/projects/pagination?page=1&limit=10&clientId=uuid&status=ACTIVE
```

---

### **Paids** (`/api/paids` y `/api/paids/pagination`)

| Filtro | Tipo | Búsqueda | Descripción |
|--------|------|----------|-------------|
| `projectId` | String | Exacta | Filtra por ID de proyecto |
| `bill` | String | Parcial | Busca en código de factura (case insensitive) |
| `amountMin` | Number | Rango | Monto mínimo |
| `amountMax` | Number | Rango | Monto máximo |
| `dateFrom` | Date | Rango | Fecha de pago desde |
| `dateTo` | Date | Rango | Fecha de pago hasta |

**Ejemplos:**
```bash
# Pagos de un proyecto
GET /api/paids?projectId=uuid-del-proyecto

# Pagos con factura que contenga "FC-2025"
GET /api/paids?bill=FC-2025

# Pagos entre $50k y $100k
GET /api/paids?amountMin=50000&amountMax=100000

# Pagos de febrero 2025
GET /api/paids?dateFrom=2025-02-01&dateTo=2025-02-28

# Paginado: pagos grandes de un proyecto
GET /api/paids/pagination?page=1&limit=10&projectId=uuid&amountMin=100000
```

---

## 🔧 Cómo Usar los Filtros

### 1. **Sin Paginación**

Obtiene TODOS los registros que coinciden con los filtros:

```bash
GET /api/users?role=ADMIN&isActive=true
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    // Todos los admins activos
  ]
}
```

### 2. **Con Paginación**

Obtiene registros paginados que coinciden con los filtros:

```bash
GET /api/users/pagination?page=1&limit=10&role=ADMIN&isActive=true
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    // Primeros 10 admins activos
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## 💡 Búsquedas Parciales vs Exactas

### **Búsqueda Parcial** (case insensitive)

Encuentra cualquier coincidencia dentro del texto:

```bash
# Busca "Constructora ABC", "ABC Constructora", "abc"
GET /api/clients?fullname=abc

# Busca "Juan", "juan pérez", "JUAN CARLOS"
GET /api/users?firstName=juan
```

### **Búsqueda Exacta**

Coincidencia exacta del valor:

```bash
# Solo CUIT exactamente igual
GET /api/clients?cuit=20123456789

# Solo rol ADMIN
GET /api/users?role=ADMIN
```

---

## 🎯 Combinando Filtros

Puedes combinar múltiples filtros:

```bash
# Usuarios admin activos con "juan" en el nombre
GET /api/users?role=ADMIN&isActive=true&firstName=juan

# Proyectos activos en Buenos Aires con 10-20 trabajadores
GET /api/projects?status=ACTIVE&locationAddress=Buenos&workersMin=10&workersMax=20

# Pagos del proyecto X en febrero con monto > $50k
GET /api/paids?projectId=uuid&dateFrom=2025-02-01&dateTo=2025-02-28&amountMin=50000
```

---

## 📊 En Swagger

Todos los filtros están documentados en Swagger:

```
http://localhost:3000/api/docs
```

Cada endpoint muestra:
- ✅ Descripción de filtros disponibles
- ✅ Tipo de cada filtro
- ✅ Ejemplos de uso
- ✅ Búsqueda parcial vs exacta

---

## ✨ Ventajas

### **Para el Frontend:**
- 🎯 Búsquedas potentes sin backend adicional
- 📊 Filtros combinables
- 🚀 Performance optimizada
- 💾 Menos datos transferidos

### **Para el Backend:**
- ✅ Filtros a nivel de base de datos (eficiente)
- 🔍 Búsquedas case insensitive
- 📈 Escalable
- 🛡️ Validación automática de parámetros

---

## 🔄 Ejemplos de Frontend

### React/Next.js

```typescript
// Buscar clientes
const { data } = await axios.get('/api/clients', {
  params: {
    fullname: searchTerm,
    page: 1,
    limit: 10
  }
});

// Filtrar proyectos activos
const { data } = await axios.get('/api/projects', {
  params: {
    status: 'ACTIVE',
    locationAddress: city,
    workersMin: 10
  }
});
```

### Vue

```typescript
// Buscar usuarios
async function searchUsers(filters) {
  const response = await fetch(
    `/api/users?${new URLSearchParams(filters)}`
  );
  return response.json();
}

// Uso
const users = await searchUsers({
  role: 'ADMIN',
  isActive: true,
  firstName: 'juan'
});
```

---

## 🎨 UI Sugeridas

### Autocomplete
```bash
GET /api/clients?fullname=${userInput}
# Mostrar coincidencias mientras escribe
```

### Filtros Avanzados
```bash
GET /api/projects?status=${status}&workersMin=${min}&workersMax=${max}
# Sidebar con múltiples filtros
```

### Búsqueda Global
```bash
GET /api/users?firstName=${term}&lastName=${term}&email=${term}
# Buscar en múltiples campos
```

---

¡Sistema de filtros completamente funcional! 🎉

