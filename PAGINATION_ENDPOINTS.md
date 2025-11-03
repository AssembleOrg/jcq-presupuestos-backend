# 📄 Endpoints de Paginación y Filtros

## 📋 Índice

1. [Users](#-users)
2. [Clients](#-clients)
3. [Projects](#-projects)
4. [Paids](#-paids)
5. [Formato de Respuesta](#-formato-de-respuesta)
6. [Ejemplos de Uso](#-ejemplos-de-uso)

---

## 👥 Users

### Endpoint
```
GET /api/users/pagination
```

### Parámetros de Paginación
| Parámetro | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `page` | Number | No | 1 | Número de página |
| `limit` | Number | No | 10 | Registros por página (máx: 100) |

### Filtros Disponibles
| Filtro | Tipo | Búsqueda | Descripción | Ejemplo |
|--------|------|----------|-------------|---------|
| `email` | String | Parcial, case insensitive | Buscar por email | `admin` |
| `firstName` | String | Parcial, case insensitive | Buscar por nombre | `Juan` |
| `lastName` | String | Parcial, case insensitive | Buscar por apellido | `Pérez` |
| `role` | Enum | Exacta | Filtrar por rol | `ADMIN`, `SUBADMIN`, `MANAGER` |
| `isActive` | Boolean | Exacta | Filtrar por estado activo | `true`, `false` |

### Ejemplo de Request
```bash
GET /api/users/pagination?page=1&limit=10&role=ADMIN&isActive=true&firstName=juan

Authorization: Bearer {token}
```

### Ejemplo de Response
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "juan.admin@jcq.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "role": "ADMIN",
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## 🏢 Clients

### Endpoint
```
GET /api/clients/pagination
```

### Parámetros de Paginación
| Parámetro | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `page` | Number | No | 1 | Número de página |
| `limit` | Number | No | 10 | Registros por página (máx: 100) |

### Filtros Disponibles
| Filtro | Tipo | Búsqueda | Descripción | Ejemplo |
|--------|------|----------|-------------|---------|
| `fullname` | String | Parcial, case insensitive | Buscar por nombre completo | `Constructora` |
| `phone` | String | Parcial, case insensitive | Buscar por teléfono | `11 1234` |
| `cuit` | String | **Parcial**, case insensitive | Buscar por CUIT | `2012345` |
| `dni` | String | **Parcial**, case insensitive | Buscar por DNI | `12345` |

**Nota:** Todos los filtros de Clients son búsqueda parcial, incluyendo CUIT y DNI.

### Ejemplo de Request
```bash
GET /api/clients/pagination?page=1&limit=10&fullname=Constructora&cuit=2012

Authorization: Bearer {token}
```

### Ejemplo de Response
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "fullname": "Constructora ABC S.A.",
      "phone": "11 1234-5678",
      "cuit": "20123456789",
      "dni": null,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
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

## 📊 Projects

### Endpoint
```
GET /api/projects/pagination
```

### Parámetros de Paginación
| Parámetro | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `page` | Number | No | 1 | Número de página |
| `limit` | Number | No | 10 | Registros por página (máx: 100) |

### Filtros Disponibles
| Filtro | Tipo | Búsqueda | Descripción | Ejemplo |
|--------|------|----------|-------------|---------|
| `clientId` | String | Exacta | Filtrar por ID de cliente | `uuid-del-cliente` |
| `status` | Enum | Exacta | Filtrar por estado | `BUDGET`, `ACTIVE`, `IN_PROCESS`, `FINISHED`, `DELETED` |
| `workersMin` | Number | Rango (>=) | Cantidad mínima de trabajadores | `10` |
| `workersMax` | Number | Rango (<=) | Cantidad máxima de trabajadores | `20` |
| `dateInitFrom` | String (ISO) | Rango (>=) | Fecha de inicio desde | `2025-01-01` |
| `dateInitTo` | String (ISO) | Rango (<=) | Fecha de inicio hasta | `2025-12-31` |
| `amountMin` | Number | Rango (>=) | Monto mínimo | `100000` |
| `amountMax` | Number | Rango (<=) | Monto máximo | `500000` |

**Nota:** Filtros de location serán agregados más adelante.

### Project Status Values
- `BUDGET` - Borrador/presupuesto
- `ACTIVE` - Proyecto aceptado y activo
- `IN_PROCESS` - En proceso de ejecución
- `FINISHED` - Finalizado
- `DELETED` - Eliminado (soft delete)

### Ejemplo de Request
```bash
GET /api/projects/pagination?page=1&limit=10&status=ACTIVE&workersMin=10&amountMin=100000&amountMax=500000

Authorization: Bearer {token}
```

### Ejemplo de Response
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "amount": 350000,
      "totalPaid": 150000,
      "rest": 200000,
      "status": "ACTIVE",
      "usdPrice": {
        "compra": 1100,
        "venta": 1150,
        "casa": "blue",
        "nombre": "Blue",
        "moneda": "ARS",
        "fechaActualizacion": "2025-01-15T12:00:00.000Z"
      },
      "clientId": "uuid",
      "client": {
        "id": "uuid",
        "fullname": "Constructora ABC S.A.",
        "phone": "11 1234-5678",
        "cuit": "20123456789",
        "dni": null
      },
      "locationAddress": "Av. Corrientes 1234, CABA",
      "locationLat": -34.6037,
      "locationLng": -58.3816,
      "workers": 15,
      "dateInit": "2025-02-01T00:00:00.000Z",
      "dateEnd": "2025-06-30T00:00:00.000Z",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

---

## 💰 Paids

### Endpoint
```
GET /api/paids/pagination
```

### Parámetros de Paginación
| Parámetro | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `page` | Number | No | 1 | Número de página |
| `limit` | Number | No | 10 | Registros por página (máx: 100) |

### Filtros Disponibles
| Filtro | Tipo | Búsqueda | Descripción | Ejemplo |
|--------|------|----------|-------------|---------|
| `projectId` | String | Exacta | Filtrar por ID de proyecto | `uuid-del-proyecto` |
| `bill` | String | Parcial, case insensitive | Buscar por código de factura | `FC-2025` |
| `amountMin` | Number | Rango (>=) | Monto mínimo | `50000` |
| `amountMax` | Number | Rango (<=) | Monto máximo | `100000` |
| `dateFrom` | String (ISO) | Rango (>=) | Fecha de pago desde | `2025-01-01` |
| `dateTo` | String (ISO) | Rango (<=) | Fecha de pago hasta | `2025-12-31` |

### Ejemplo de Request
```bash
GET /api/paids/pagination?page=1&limit=10&projectId=uuid&amountMin=50000&dateFrom=2025-01-01

Authorization: Bearer {token}
```

### Ejemplo de Response
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "amount": 75000,
      "date": "2025-01-15T00:00:00.000Z",
      "bill": "FC-2025-001",
      "projectId": "uuid",
      "project": {
        "id": "uuid",
        "amount": 350000,
        "totalPaid": 150000,
        "rest": 200000,
        "status": "ACTIVE",
        "client": {
          "id": "uuid",
          "fullname": "Constructora ABC S.A.",
          "phone": "11 1234-5678"
        }
      },
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 12,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## 📦 Formato de Respuesta

Todas las respuestas paginadas siguen este formato estándar:

```typescript
{
  "success": true,
  "data": Array<T>,  // Array de registros
  "meta": {
    "page": number,           // Página actual
    "limit": number,          // Registros por página
    "total": number,          // Total de registros
    "totalPages": number,     // Total de páginas
    "hasNextPage": boolean,   // Si hay página siguiente
    "hasPreviousPage": boolean // Si hay página anterior
  }
}
```

### Navegación

```typescript
// Primera página
page=1

// Siguiente página
page=meta.page + 1 (si meta.hasNextPage === true)

// Página anterior
page=meta.page - 1 (si meta.hasPreviousPage === true)

// Última página
page=meta.totalPages
```

---

## 🎯 Ejemplos de Uso

### 1. Búsqueda Simple con Paginación

#### Request
```bash
GET /api/users/pagination?page=1&limit=20&role=ADMIN

Authorization: Bearer {token}
```

#### Response
```json
{
  "success": true,
  "data": [...20 admins...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

### 2. Filtros Múltiples

#### Request
```bash
GET /api/projects/pagination?page=1&limit=10&status=ACTIVE&workersMin=10&workersMax=20&amountMin=100000

Authorization: Bearer {token}
```

#### Response
```json
{
  "success": true,
  "data": [
    // Proyectos ACTIVE con 10-20 trabajadores y monto >= 100000
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

---

### 3. Búsqueda Parcial

#### Request (Buscar clientes con "ABC" en nombre o CUIT)
```bash
GET /api/clients/pagination?page=1&limit=10&fullname=ABC

Authorization: Bearer {token}
```

#### Response
```json
{
  "success": true,
  "data": [
    {
      "fullname": "Constructora ABC S.A.",
      "cuit": "20123456789"
    },
    {
      "fullname": "ABC Ingeniería",
      "cuit": "20987654321"
    }
  ],
  "meta": {...}
}
```

---

### 4. Rango de Fechas

#### Request (Pagos de enero 2025)
```bash
GET /api/paids/pagination?page=1&limit=10&dateFrom=2025-01-01&dateTo=2025-01-31

Authorization: Bearer {token}
```

#### Response
```json
{
  "success": true,
  "data": [
    // Todos los pagos entre 01/01/2025 y 31/01/2025
  ],
  "meta": {...}
}
```

---

### 5. Búsqueda por ID de Relación

#### Request (Pagos de un proyecto específico)
```bash
GET /api/paids/pagination?page=1&limit=10&projectId=550e8400-e29b-41d4-a716-446655440000

Authorization: Bearer {token}
```

#### Response
```json
{
  "success": true,
  "data": [
    // Todos los pagos del proyecto especificado
  ],
  "meta": {...}
}
```

---

## 💡 Tips de Uso

### 1. Combinar Filtros
Puedes combinar cualquier filtro disponible:

```bash
# Proyectos activos de un cliente con 15-25 trabajadores
GET /api/projects/pagination?clientId=uuid&status=ACTIVE&workersMin=15&workersMax=25

# Usuarios admin activos con "juan" en el nombre
GET /api/users/pagination?role=ADMIN&isActive=true&firstName=juan

# Pagos grandes de un proyecto en febrero
GET /api/paids/pagination?projectId=uuid&amountMin=100000&dateFrom=2025-02-01&dateTo=2025-02-28
```

### 2. Búsqueda Parcial vs Exacta

**Búsqueda Parcial** (encuentra coincidencias):
```bash
# Encuentra: "Constructora ABC", "ABC Ingeniería", "XYZ ABC Ltd"
GET /api/clients/pagination?fullname=ABC

# Encuentra: "20123456789", "30123456789", "27123456789"
GET /api/clients/pagination?cuit=12345
```

**Búsqueda Exacta** (debe coincidir completamente):
```bash
# Solo encuentra proyectos con status ACTIVE (exacto)
GET /api/projects/pagination?status=ACTIVE

# Solo encuentra UUID exacto
GET /api/paids/pagination?projectId=550e8400-e29b-41d4-a716-446655440000
```

### 3. Rangos Numéricos
Los rangos son inclusivos (>=, <=):

```bash
# Proyectos con EXACTAMENTE 10-20 trabajadores
GET /api/projects/pagination?workersMin=10&workersMax=20

# Pagos MAYORES O IGUALES a $50k
GET /api/paids/pagination?amountMin=50000

# Pagos MENORES O IGUALES a $100k
GET /api/paids/pagination?amountMax=100000

# Pagos ENTRE $50k y $100k
GET /api/paids/pagination?amountMin=50000&amountMax=100000
```

### 4. Rangos de Fechas
Las fechas deben estar en formato ISO (YYYY-MM-DD):

```bash
# Proyectos que INICIAN en enero 2025
GET /api/projects/pagination?dateInitFrom=2025-01-01&dateInitTo=2025-01-31

# Proyectos que inician DESPUÉS de febrero
GET /api/projects/pagination?dateInitFrom=2025-02-01

# Proyectos que inician ANTES de marzo
GET /api/projects/pagination?dateInitTo=2025-03-01
```

### 5. Paginación Eficiente

```bash
# Página 1 con 50 registros por página (rápido)
GET /api/users/pagination?page=1&limit=50

# Página 1 con 100 registros (máximo permitido)
GET /api/users/pagination?page=1&limit=100

# Si limit > 100, se limita automáticamente a 100
```

---

## 🔍 Frontend Integration

### React Hook Example
```typescript
import { useState, useEffect } from 'react';
import axios from 'axios';

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

function usePagination<T>(endpoint: string, filters: Record<string, any> = {}) {
  const [data, setData] = useState<T[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get<PaginatedResponse<T>>(
          `${endpoint}/pagination`,
          {
            params: { page, limit, ...filters },
          }
        );
        setData(response.data.data);
        setMeta(response.data.meta);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, page, limit, filters]);

  const nextPage = () => {
    if (meta?.hasNextPage) setPage(page + 1);
  };

  const previousPage = () => {
    if (meta?.hasPreviousPage) setPage(page - 1);
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= (meta?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  return {
    data,
    meta,
    loading,
    page,
    nextPage,
    previousPage,
    goToPage,
  };
}

// Uso
function ProjectsList() {
  const { data, meta, loading, nextPage, previousPage } = usePagination(
    '/api/projects',
    { status: 'ACTIVE', workersMin: 10 }
  );

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      {data.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
      
      <Pagination
        current={meta?.page}
        total={meta?.totalPages}
        onNext={nextPage}
        onPrevious={previousPage}
      />
    </div>
  );
}
```

---

## 📚 Documentación Adicional

- **Swagger UI**: `http://localhost:3000/api/docs`
- **Error Codes**: Ver `ERROR_CODES.md`
- **API Context**: Ver `API_FRONTEND_CONTEXT.md`
- **Filters Guide**: Ver `FILTERS_DOCUMENTATION.md`

---

**Última actualización:** 2025-10-23  
**Versión:** 1.0.0


