# 🎯 API Context - Frontend Integration Guide

## 🔗 Base URL

```
Development: http://localhost:3000
Production: [TU_URL_PRODUCCION]
```

---

## 🔐 Authentication

### Login
```typescript
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "admin@example.com",
  "password": "admin123"
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "admin@example.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "ADMIN",
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

### Register (Protected - Only ADMIN/SUBADMIN)
```typescript
POST /api/auth/register
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "MANAGER" // Optional: ADMIN, SUBADMIN, MANAGER
}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "MANAGER",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

## 👥 Users API

### Get All Users (No Pagination)
```typescript
GET /api/users?email={email}&firstName={firstName}&lastName={lastName}&role={role}&isActive={isActive}
Authorization: Bearer {token}

Query Parameters:
- email?: string (partial search)
- firstName?: string (partial search)
- lastName?: string (partial search)
- role?: "ADMIN" | "SUBADMIN" | "MANAGER"
- isActive?: boolean

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "admin@example.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "ADMIN",
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Users (Paginated)
```typescript
GET /api/users/pagination?page={page}&limit={limit}&email={email}&firstName={firstName}&lastName={lastName}&role={role}&isActive={isActive}
Authorization: Bearer {token}

Query Parameters:
- page?: number (default: 1)
- limit?: number (default: 10)
- email?: string
- firstName?: string
- lastName?: string
- role?: "ADMIN" | "SUBADMIN" | "MANAGER"
- isActive?: boolean

Response:
{
  "success": true,
  "data": [...users],
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

### Get User by ID
```typescript
GET /api/users/{id}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Create User
```typescript
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "New",
  "lastName": "User",
  "role": "MANAGER" // Optional
}

Response: Same as Get User by ID
```

### Update User
```typescript
PATCH /api/users/{id}
Authorization: Bearer {token}
Content-Type: application/json

Body (all optional):
{
  "email": "updated@example.com",
  "firstName": "Updated",
  "lastName": "Name",
  "role": "ADMIN",
  "isActive": false
}

Response: Same as Get User by ID
```

### Delete User (Soft Delete)
```typescript
DELETE /api/users/{id}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "message": "Usuario eliminado exitosamente"
  }
}
```

---

## 🏢 Clients API

### Get All Clients (No Pagination)
```typescript
GET /api/clients?fullname={fullname}&phone={phone}&cuit={cuit}&dni={dni}
Authorization: Bearer {token}

Query Parameters:
- fullname?: string (partial search)
- phone?: string (partial search)
- cuit?: string (exact match)
- dni?: string (exact match)

Response:
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
  ]
}
```

### Get Clients (Paginated)
```typescript
GET /api/clients/pagination?page={page}&limit={limit}&fullname={fullname}&phone={phone}&cuit={cuit}&dni={dni}
Authorization: Bearer {token}

Query Parameters:
- page?: number (default: 1)
- limit?: number (default: 10)
- fullname?: string
- phone?: string
- cuit?: string
- dni?: string

Response: Same structure with meta
```

### Get Client by ID
```typescript
GET /api/clients/{id}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "fullname": "Constructora ABC S.A.",
    "phone": "11 1234-5678",
    "cuit": "20123456789",
    "dni": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Create Client
```typescript
POST /api/clients
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "fullname": "Constructora ABC S.A.",
  "phone": "11 1234-5678",
  "cuit": "20123456789", // Required if dni not provided
  "dni": "12345678" // Required if cuit not provided
}

Note: At least one of cuit or dni is required

Response: Same as Get Client by ID
```

### Update Client
```typescript
PATCH /api/clients/{id}
Authorization: Bearer {token}
Content-Type: application/json

Body (all optional):
{
  "fullname": "Updated Name",
  "phone": "11 9999-9999",
  "cuit": "20999999999",
  "dni": "99999999"
}

Response: Same as Get Client by ID
```

### Delete Client (Soft Delete)
```typescript
DELETE /api/clients/{id}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "message": "Cliente eliminado exitosamente"
  }
}
```

---

## 📊 Projects API

### Project Status Enum
```typescript
enum ProjectStatus {
  BUDGET = "BUDGET",         // Borrador/presupuesto
  ACTIVE = "ACTIVE",         // Proyecto aceptado
  IN_PROCESS = "IN_PROCESS", // En proceso
  FINISHED = "FINISHED",     // Finalizado
  DELETED = "DELETED"        // Eliminado
}
```

### Status Transition Rules
```
BUDGET → ACTIVE
ACTIVE → IN_PROCESS, DELETED
IN_PROCESS → FINISHED, DELETED
FINISHED → (no changes allowed)
DELETED → ACTIVE (restore)
```

### Get All Projects (No Pagination)
```typescript
GET /api/projects?clientId={clientId}&status={status}&locationAddress={locationAddress}&workersMin={workersMin}&workersMax={workersMax}&dateInitFrom={dateInitFrom}&dateInitTo={dateInitTo}&amountMin={amountMin}&amountMax={amountMax}
Authorization: Bearer {token}

Query Parameters:
- clientId?: string (exact match)
- status?: "BUDGET" | "ACTIVE" | "IN_PROCESS" | "FINISHED" | "DELETED"
- locationAddress?: string (partial search)
- workersMin?: number (range min)
- workersMax?: number (range max)
- dateInitFrom?: string (ISO date, range start)
- dateInitTo?: string (ISO date, range end)
- amountMin?: number (range min)
- amountMax?: number (range max)

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "amount": 500000,
      "totalPaid": 200000,
      "rest": 300000,
      "status": "ACTIVE",
      "usdPrice": {
        "compra": 1100,
        "venta": 1150,
        "casa": "blue",
        "nombre": "Blue",
        "moneda": "ARS",
        "fechaActualizacion": "2025-01-01T00:00:00.000Z"
      },
      "clientId": "uuid",
      "client": {
        "id": "uuid",
        "fullname": "Constructora ABC S.A.",
        "phone": "11 1234-5678",
        "cuit": "20123456789",
        "dni": null,
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      },
      "locationAddress": "Av. Corrientes 1234, CABA",
      "locationLat": -34.6037,
      "locationLng": -58.3816,
      "workers": 15,
      "dateInit": "2025-02-01T00:00:00.000Z",
      "dateEnd": "2025-06-30T00:00:00.000Z",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Projects (Paginated)
```typescript
GET /api/projects/pagination?page={page}&limit={limit}&clientId={clientId}&status={status}&locationAddress={locationAddress}&workersMin={workersMin}&workersMax={workersMax}&dateInitFrom={dateInitFrom}&dateInitTo={dateInitTo}&amountMin={amountMin}&amountMax={amountMax}
Authorization: Bearer {token}

Query Parameters: Same as non-paginated + page & limit

Response: Same structure with meta
```

### Get Project by ID (includes payments)
```typescript
GET /api/projects/{id}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    ...project data,
    "paids": [
      {
        "id": "uuid",
        "amount": 100000,
        "date": "2025-01-15T00:00:00.000Z",
        "bill": "FC-2025-001",
        "projectId": "uuid",
        "createdAt": "2025-01-15T00:00:00.000Z",
        "updatedAt": "2025-01-15T00:00:00.000Z"
      }
    ]
  }
}
```

### Create Project
```typescript
POST /api/projects
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "amount": 500000,
  "clientId": "uuid",
  "locationAddress": "Av. Corrientes 1234, CABA",
  "locationLat": -34.6037, // Optional
  "locationLng": -58.3816, // Optional
  "workers": 15,
  "dateInit": "2025-02-01", // ISO date string
  "dateEnd": "2025-06-30"   // ISO date string
}

Note: Project starts as BUDGET status
Response: Same as Get Project by ID
```

### Update Project
```typescript
PATCH /api/projects/{id}
Authorization: Bearer {token}
Content-Type: application/json

Body (all optional):
{
  "amount": 600000,
  "locationAddress": "Updated Address",
  "locationLat": -34.6037,
  "locationLng": -58.3816,
  "workers": 20,
  "dateInit": "2025-03-01",
  "dateEnd": "2025-07-31"
}

Note: Cannot change status here, use /status endpoint
Response: Same as Get Project by ID
```

### Change Project Status
```typescript
PATCH /api/projects/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "status": "ACTIVE" // Must follow transition rules
}

Note: 
- When changing to ACTIVE from BUDGET or DELETED, usdPrice is automatically fetched
- Status transitions are validated (see rules above)

Response: Same as Get Project by ID (includes usdPrice if changed to ACTIVE)
```

### Delete Project (Soft Delete)
```typescript
DELETE /api/projects/{id}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "message": "Proyecto eliminado exitosamente"
  }
}
```

---

## 💰 Paids (Payments) API

### Get All Paids (No Pagination)
```typescript
GET /api/paids?projectId={projectId}&bill={bill}&amountMin={amountMin}&amountMax={amountMax}&dateFrom={dateFrom}&dateTo={dateTo}
Authorization: Bearer {token}

Query Parameters:
- projectId?: string (exact match)
- bill?: string (partial search in invoice code)
- amountMin?: number (range min)
- amountMax?: number (range max)
- dateFrom?: string (ISO date, range start)
- dateTo?: string (ISO date, range end)

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "amount": 100000,
      "date": "2025-01-15T00:00:00.000Z",
      "bill": "FC-2025-001",
      "projectId": "uuid",
      "project": {
        "id": "uuid",
        "amount": 500000,
        "totalPaid": 100000,
        "rest": 400000,
        "status": "ACTIVE",
        "clientId": "uuid",
        "client": {
          "id": "uuid",
          "fullname": "Constructora ABC S.A.",
          ...clientData
        },
        ...projectData
      },
      "createdAt": "2025-01-15T00:00:00.000Z",
      "updatedAt": "2025-01-15T00:00:00.000Z"
    }
  ]
}
```

### Get Paids (Paginated)
```typescript
GET /api/paids/pagination?page={page}&limit={limit}&projectId={projectId}&bill={bill}&amountMin={amountMin}&amountMax={amountMax}&dateFrom={dateFrom}&dateTo={dateTo}
Authorization: Bearer {token}

Query Parameters: Same as non-paginated + page & limit

Response: Same structure with meta
```

### Get Paid by ID
```typescript
GET /api/paids/{id}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "amount": 100000,
    "date": "2025-01-15T00:00:00.000Z",
    "bill": "FC-2025-001",
    "projectId": "uuid",
    "project": {
      ...full project data with client
    },
    "createdAt": "2025-01-15T00:00:00.000Z",
    "updatedAt": "2025-01-15T00:00:00.000Z"
  }
}
```

### Get Paids by Project
```typescript
GET /api/paids/project/{projectId}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [
    ...array of paids for this project
  ]
}
```

### Create Paid
```typescript
POST /api/paids
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "amount": 100000,
  "date": "2025-01-15", // ISO date string
  "bill": "FC-2025-001", // Optional, default: ""
  "projectId": "uuid"
}

Note: 
- Amount cannot exceed project.rest
- Automatically updates project totalPaid and rest

Response: Same as Get Paid by ID
```

### Update Paid
```typescript
PATCH /api/paids/{id}
Authorization: Bearer {token}
Content-Type: application/json

Body (all optional):
{
  "amount": 120000,
  "date": "2025-01-20",
  "bill": "FC-2025-002"
}

Note: Amount validation applies
Response: Same as Get Paid by ID
```

### Delete Paid (Soft Delete)
```typescript
DELETE /api/paids/{id}
Authorization: Bearer {token}

Note: Automatically recalculates project totals

Response:
{
  "success": true,
  "data": {
    "message": "Pago eliminado exitosamente"
  }
}
```

---

## 🚨 Error Responses

All errors follow this format with **error codes**:

```typescript
{
  "success": false,
  "statusCode": 422,
  "code": "VALIDATION_ERROR",
  "error": "Error de Validación",
  "message": "El email debe ser una dirección de correo válida",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "path": "/api/users"
}
```

### Error Codes

| Code | Status | Error (Spanish) | When |
|------|--------|----------------|------|
| `BAD_REQUEST` | 400 | Solicitud Incorrecta | Invalid parameters |
| `UNAUTHORIZED` | 401 | No Autorizado | Invalid/missing token |
| `FORBIDDEN` | 403 | Acceso Prohibido | Insufficient permissions |
| `NOT_FOUND` | 404 | No Encontrado | Resource not found |
| `CONFLICT` | 409 | Conflicto | Duplicate entry |
| `VALIDATION_ERROR` | 422 | Error de Validación | DTO validation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Demasiadas Solicitudes | Rate limit exceeded |
| `INTERNAL_SERVER_ERROR` | 500 | Error Interno del Servidor | Unhandled error |
| `BAD_GATEWAY` | 502 | Puerta de Enlace Incorrecta | External service error |
| `SERVICE_UNAVAILABLE` | 503 | Servicio No Disponible | Service down |

### Example Validation Error (Multiple Messages)
```typescript
{
  "success": false,
  "statusCode": 422,
  "code": "VALIDATION_ERROR",
  "error": "Error de Validación",
  "message": [
    "El email debe ser una dirección de correo válida",
    "La contraseña debe tener al menos 6 caracteres"
  ],
  "timestamp": "2025-01-01T00:00:00.000Z",
  "path": "/api/users"
}
```

### Example Conflict Error
```typescript
{
  "success": false,
  "statusCode": 409,
  "code": "CONFLICT",
  "error": "Conflicto",
  "message": "El email ya está registrado",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "path": "/api/users"
}
```

**📚 Full Error Documentation:** See `ERROR_CODES.md`

---

## 🎨 TypeScript Types

### User
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "SUBADMIN" | "MANAGER";
  isActive: boolean;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}
```

### Client
```typescript
interface Client {
  id: string;
  fullname: string;
  phone: string;
  cuit: string | null;
  dni: string | null;
  createdAt: string;
  updatedAt: string;
}
```

### Project
```typescript
interface Project {
  id: string;
  amount: number;
  totalPaid: number;
  rest: number;
  status: "BUDGET" | "ACTIVE" | "IN_PROCESS" | "FINISHED" | "DELETED";
  usdPrice: {
    compra: number;
    venta: number;
    casa: string;
    nombre: string;
    moneda: string;
    fechaActualizacion: string;
  } | null;
  clientId: string;
  client: Client;
  locationAddress: string | null;
  locationLat: number | null;
  locationLng: number | null;
  workers: number;
  dateInit: string; // ISO date
  dateEnd: string; // ISO date
  createdAt: string;
  updatedAt: string;
}
```

### Paid
```typescript
interface Paid {
  id: string;
  amount: number;
  date: string; // ISO date
  bill: string;
  projectId: string;
  project?: Project; // Included in some responses
  createdAt: string;
  updatedAt: string;
}
```

### API Response
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
```

### Auth Response
```typescript
interface AuthResponse {
  accessToken: string;
  user: User;
}
```

---

## 🔧 Axios Setup Example

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 📦 Example Usage

### Login and Store Token
```typescript
const login = async (email: string, password: string) => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
    email,
    password,
  });
  
  localStorage.setItem('token', response.data.data.accessToken);
  localStorage.setItem('user', JSON.stringify(response.data.data.user));
  
  return response.data.data;
};
```

### Fetch with Filters
```typescript
const getProjects = async (filters: {
  status?: string;
  clientId?: string;
  amountMin?: number;
  amountMax?: number;
}) => {
  const response = await api.get<ApiResponse<Project[]>>('/projects', {
    params: filters,
  });
  
  return response.data.data;
};

// Usage
const activeProjects = await getProjects({ status: 'ACTIVE' });
```

### Fetch with Pagination
```typescript
const getProjectsPaginated = async (
  page: number = 1,
  limit: number = 10,
  filters?: object
) => {
  const response = await api.get<ApiResponse<Project[]>>('/projects/pagination', {
    params: { page, limit, ...filters },
  });
  
  return {
    projects: response.data.data,
    meta: response.data.meta,
  };
};
```

### Create Resource
```typescript
const createClient = async (data: {
  fullname: string;
  phone: string;
  cuit?: string;
  dni?: string;
}) => {
  const response = await api.post<ApiResponse<Client>>('/clients', data);
  return response.data.data;
};
```

### Update Resource
```typescript
const updateProject = async (id: string, data: Partial<Project>) => {
  const response = await api.patch<ApiResponse<Project>>(`/projects/${id}`, data);
  return response.data.data;
};
```

### Change Project Status
```typescript
const changeProjectStatus = async (
  id: string,
  status: 'BUDGET' | 'ACTIVE' | 'IN_PROCESS' | 'FINISHED' | 'DELETED'
) => {
  const response = await api.patch<ApiResponse<Project>>(
    `/projects/${id}/status`,
    { status }
  );
  return response.data.data;
};
```

---

## 🎯 Best Practices

### 1. Always Check Token
```typescript
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};
```

### 2. Handle Pagination State
```typescript
const [page, setPage] = useState(1);
const [limit] = useState(10);
const [meta, setMeta] = useState<any>(null);

const loadData = async () => {
  const result = await getProjectsPaginated(page, limit);
  setMeta(result.meta);
};
```

### 3. Debounce Search Inputs
```typescript
import { debounce } from 'lodash';

const searchProjects = debounce(async (searchTerm: string) => {
  const projects = await getProjects({ locationAddress: searchTerm });
  // Update state
}, 500);
```

### 4. Cache Requests
```typescript
// Using React Query
import { useQuery } from '@tanstack/react-query';

const useProjects = (filters: any) => {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => getProjects(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

---

## 📝 Notes

- All dates are in ISO 8601 format
- Timezone: America/Argentina/Buenos_Aires (GMT-3)
- All monetary values are in ARS (Argentinian Pesos)
- Soft deletes: Records are marked as deleted but not removed from DB
- All error messages are in Spanish
- JWT tokens expire in 7 days (configurable via ENV)

---

## 🔗 Additional Resources

- Swagger UI: `http://localhost:3000/api/docs`
- Full Documentation: See `FILTERS_DOCUMENTATION.md`
- Implementation Details: See `FILTERS_IMPLEMENTATION_COMPLETE.md`

---

**Last Updated:** 2025-01-23  
**API Version:** 1.0.0

