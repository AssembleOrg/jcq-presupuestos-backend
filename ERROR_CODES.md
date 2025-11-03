# 🚨 Códigos de Error - API

## 📋 Formato de Respuesta de Error

Todos los errores siguen este formato estándar:

```json
{
  "success": false,
  "statusCode": 422,
  "code": "VALIDATION_ERROR",
  "error": "Error de Validación",
  "message": "El email debe ser una dirección de correo válida",
  "timestamp": "2025-10-23T12:00:00.000Z",
  "path": "/api/users"
}
```

### Campos:
- **success**: Siempre `false` en errores
- **statusCode**: Código HTTP estándar
- **code**: Código de error específico para el frontend
- **error**: Descripción del tipo de error en español
- **message**: Mensaje detallado del error (puede ser string o array)
- **timestamp**: Fecha y hora del error (ISO 8601)
- **path**: Endpoint donde ocurrió el error

---

## 🔢 Códigos de Error Disponibles

### 400 - Bad Request (Solicitud Incorrecta)
**Code**: `BAD_REQUEST`

**Cuándo ocurre:**
- Parámetros de query inválidos
- Body mal formado
- Tipo de datos incorrecto

**Ejemplo:**
```json
{
  "success": false,
  "statusCode": 400,
  "code": "BAD_REQUEST",
  "error": "Solicitud Incorrecta",
  "message": "El formato de la fecha es inválido",
  "timestamp": "2025-10-23T12:00:00.000Z",
  "path": "/api/projects"
}
```

---

### 401 - Unauthorized (No Autorizado)
**Code**: `UNAUTHORIZED`

**Cuándo ocurre:**
- Token JWT inválido
- Token expirado
- Token no proporcionado
- Credenciales incorrectas

**Ejemplo:**
```json
{
  "success": false,
  "statusCode": 401,
  "code": "UNAUTHORIZED",
  "error": "No Autorizado",
  "message": "Credenciales inválidas",
  "timestamp": "2025-10-23T12:00:00.000Z",
  "path": "/api/auth/login"
}
```

---

### 403 - Forbidden (Acceso Prohibido)
**Code**: `FORBIDDEN`

**Cuándo ocurre:**
- Usuario sin permisos suficientes
- Rol inadecuado para la operación
- Acceso a recurso prohibido

**Ejemplo:**
```json
{
  "success": false,
  "statusCode": 403,
  "code": "FORBIDDEN",
  "error": "Acceso Prohibido",
  "message": "No tienes permisos para realizar esta acción",
  "timestamp": "2025-10-23T12:00:00.000Z",
  "path": "/api/users"
}
```

---

### 404 - Not Found (No Encontrado)
**Code**: `NOT_FOUND`

**Cuándo ocurre:**
- Recurso no existe
- ID inválido
- Registro eliminado (soft deleted)

**Ejemplo:**
```json
{
  "success": false,
  "statusCode": 404,
  "code": "NOT_FOUND",
  "error": "No Encontrado",
  "message": "Usuario no encontrado",
  "timestamp": "2025-10-23T12:00:00.000Z",
  "path": "/api/users/invalid-uuid"
}
```

---

### 409 - Conflict (Conflicto)
**Code**: `CONFLICT`

**Cuándo ocurre:**
- Email duplicado
- CUIT/DNI duplicado
- Recurso ya existe
- Conflicto de estado

**Ejemplo:**
```json
{
  "success": false,
  "statusCode": 409,
  "code": "CONFLICT",
  "error": "Conflicto",
  "message": "El email ya está registrado",
  "timestamp": "2025-10-23T12:00:00.000Z",
  "path": "/api/users"
}
```

---

### 422 - Unprocessable Entity (Error de Validación)
**Code**: `VALIDATION_ERROR`

**Cuándo ocurre:**
- Validación de DTO fallida
- Campos requeridos faltantes
- Formato incorrecto
- Constraints no cumplidos

**Ejemplo (mensaje único):**
```json
{
  "success": false,
  "statusCode": 422,
  "code": "VALIDATION_ERROR",
  "error": "Error de Validación",
  "message": "El email debe ser una dirección de correo válida",
  "timestamp": "2025-10-23T12:00:00.000Z",
  "path": "/api/users"
}
```

**Ejemplo (múltiples errores):**
```json
{
  "success": false,
  "statusCode": 422,
  "code": "VALIDATION_ERROR",
  "error": "Error de Validación",
  "message": [
    "El email debe ser una dirección de correo válida",
    "La contraseña debe tener al menos 6 caracteres",
    "El nombre es requerido"
  ],
  "timestamp": "2025-10-23T12:00:00.000Z",
  "path": "/api/users"
}
```

---

### 429 - Too Many Requests (Demasiadas Solicitudes)
**Code**: `RATE_LIMIT_EXCEEDED`

**Cuándo ocurre:**
- Excede 100 requests por minuto
- Rate limiting activado

**Ejemplo:**
```json
{
  "success": false,
  "statusCode": 429,
  "code": "RATE_LIMIT_EXCEEDED",
  "error": "Demasiadas Solicitudes",
  "message": "Has excedido el límite de solicitudes. Intenta nuevamente en unos momentos",
  "timestamp": "2025-10-23T12:00:00.000Z",
  "path": "/api/users"
}
```

---

### 500 - Internal Server Error (Error Interno del Servidor)
**Code**: `INTERNAL_SERVER_ERROR`

**Cuándo ocurre:**
- Error no manejado
- Excepción inesperada
- Error de base de datos
- Bug en el código

**Ejemplo:**
```json
{
  "success": false,
  "statusCode": 500,
  "code": "INTERNAL_SERVER_ERROR",
  "error": "Error Interno del Servidor",
  "message": "Ocurrió un error inesperado. Por favor contacta al administrador",
  "timestamp": "2025-10-23T12:00:00.000Z",
  "path": "/api/projects"
}
```

---

### 502 - Bad Gateway (Puerta de Enlace Incorrecta)
**Code**: `BAD_GATEWAY`

**Cuándo ocurre:**
- Servicio externo no responde
- DolarAPI no disponible
- Timeout de servicios externos

**Ejemplo:**
```json
{
  "success": false,
  "statusCode": 502,
  "code": "BAD_GATEWAY",
  "error": "Puerta de Enlace Incorrecta",
  "message": "No se pudo obtener el precio del dólar. Intente nuevamente en unos momentos",
  "timestamp": "2025-10-23T12:00:00.000Z",
  "path": "/api/projects/uuid/status"
}
```

---

### 503 - Service Unavailable (Servicio No Disponible)
**Code**: `SERVICE_UNAVAILABLE`

**Cuándo ocurre:**
- Base de datos no disponible
- Servicio en mantenimiento
- Servidor sobrecargado

**Ejemplo:**
```json
{
  "success": false,
  "statusCode": 503,
  "code": "SERVICE_UNAVAILABLE",
  "error": "Servicio No Disponible",
  "message": "El servicio está temporalmente no disponible. Intenta nuevamente más tarde",
  "timestamp": "2025-10-23T12:00:00.000Z",
  "path": "/api/users"
}
```

---

## 🎨 Manejo en Frontend

### TypeScript Interface
```typescript
interface ApiError {
  success: false;
  statusCode: number;
  code: string;
  error: string;
  message: string | string[];
  timestamp: string;
  path: string;
}
```

### Ejemplo con Axios
```typescript
import axios from 'axios';

try {
  const response = await axios.post('/api/users', userData);
} catch (error) {
  if (axios.isAxiosError(error) && error.response) {
    const apiError = error.response.data as ApiError;
    
    switch (apiError.code) {
      case 'VALIDATION_ERROR':
        // Mostrar errores de validación
        if (Array.isArray(apiError.message)) {
          apiError.message.forEach(msg => console.error(msg));
        } else {
          console.error(apiError.message);
        }
        break;
        
      case 'CONFLICT':
        // Email duplicado, etc.
        console.error(apiError.message);
        break;
        
      case 'UNAUTHORIZED':
        // Redirigir a login
        window.location.href = '/login';
        break;
        
      case 'FORBIDDEN':
        // Mostrar mensaje de permisos
        console.error('No tienes permisos para esta acción');
        break;
        
      case 'NOT_FOUND':
        // Recurso no encontrado
        console.error('Recurso no encontrado');
        break;
        
      case 'RATE_LIMIT_EXCEEDED':
        // Demasiadas solicitudes
        console.error('Espera un momento antes de reintentar');
        break;
        
      case 'INTERNAL_SERVER_ERROR':
        // Error del servidor
        console.error('Error del servidor. Contacta al administrador');
        break;
        
      default:
        console.error('Error desconocido:', apiError.message);
    }
  }
}
```

### Ejemplo con React + Toast
```typescript
import { toast } from 'react-hot-toast';

const handleError = (error: any) => {
  if (axios.isAxiosError(error) && error.response) {
    const apiError = error.response.data as ApiError;
    
    const errorMessages: Record<string, string> = {
      'VALIDATION_ERROR': 'Por favor verifica los datos ingresados',
      'CONFLICT': 'Este registro ya existe',
      'UNAUTHORIZED': 'Debes iniciar sesión',
      'FORBIDDEN': 'No tienes permisos para esta acción',
      'NOT_FOUND': 'Registro no encontrado',
      'RATE_LIMIT_EXCEEDED': 'Demasiadas solicitudes, espera un momento',
      'INTERNAL_SERVER_ERROR': 'Error del servidor',
    };
    
    const message = errorMessages[apiError.code] || apiError.message;
    
    if (Array.isArray(apiError.message)) {
      apiError.message.forEach(msg => toast.error(msg));
    } else {
      toast.error(message);
    }
  }
};
```

### Componente de Error
```typescript
import React from 'react';

interface ErrorDisplayProps {
  error: ApiError;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  const getErrorIcon = (code: string) => {
    switch (code) {
      case 'VALIDATION_ERROR': return '⚠️';
      case 'UNAUTHORIZED': return '🔒';
      case 'FORBIDDEN': return '🚫';
      case 'NOT_FOUND': return '🔍';
      case 'CONFLICT': return '⚔️';
      case 'RATE_LIMIT_EXCEEDED': return '⏱️';
      case 'INTERNAL_SERVER_ERROR': return '💥';
      default: return '❌';
    }
  };
  
  return (
    <div className="error-container">
      <div className="error-icon">{getErrorIcon(error.code)}</div>
      <div className="error-content">
        <h3>{error.error}</h3>
        {Array.isArray(error.message) ? (
          <ul>
            {error.message.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        ) : (
          <p>{error.message}</p>
        )}
      </div>
    </div>
  );
};
```

---

## 📊 Tabla Resumen

| Code | StatusCode | Error | Ejemplo de Mensaje |
|------|------------|-------|-------------------|
| `BAD_REQUEST` | 400 | Solicitud Incorrecta | "El formato de la fecha es inválido" |
| `UNAUTHORIZED` | 401 | No Autorizado | "Credenciales inválidas" |
| `FORBIDDEN` | 403 | Acceso Prohibido | "No tienes permisos para esta acción" |
| `NOT_FOUND` | 404 | No Encontrado | "Usuario no encontrado" |
| `CONFLICT` | 409 | Conflicto | "El email ya está registrado" |
| `VALIDATION_ERROR` | 422 | Error de Validación | "El email debe ser válido" |
| `RATE_LIMIT_EXCEEDED` | 429 | Demasiadas Solicitudes | "Has excedido el límite" |
| `INTERNAL_SERVER_ERROR` | 500 | Error Interno | "Error inesperado" |
| `BAD_GATEWAY` | 502 | Puerta de Enlace Incorrecta | "Servicio externo no disponible" |
| `SERVICE_UNAVAILABLE` | 503 | Servicio No Disponible | "Servicio en mantenimiento" |

---

## 🔍 Testing de Errores

### 1. Validation Error (422)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email", "password": "123"}'
```

**Respuesta esperada:**
```json
{
  "success": false,
  "statusCode": 422,
  "code": "VALIDATION_ERROR",
  "error": "Error de Validación",
  "message": [
    "El email debe ser una dirección de correo válida",
    "La contraseña debe tener al menos 6 caracteres"
  ]
}
```

### 2. Conflict (409)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@jcq.com", "password": "password123", ...}'
```

**Respuesta esperada:**
```json
{
  "success": false,
  "statusCode": 409,
  "code": "CONFLICT",
  "error": "Conflicto",
  "message": "El email ya está registrado"
}
```

### 3. Unauthorized (401)
```bash
curl -X GET http://localhost:3000/api/users
# Sin token
```

**Respuesta esperada:**
```json
{
  "success": false,
  "statusCode": 401,
  "code": "UNAUTHORIZED",
  "error": "No Autorizado",
  "message": "Token no proporcionado"
}
```

### 4. Not Found (404)
```bash
curl -X GET http://localhost:3000/api/users/invalid-uuid \
  -H "Authorization: Bearer TOKEN"
```

**Respuesta esperada:**
```json
{
  "success": false,
  "statusCode": 404,
  "code": "NOT_FOUND",
  "error": "No Encontrado",
  "message": "Usuario no encontrado"
}
```

### 5. Rate Limit (429)
```bash
# Hacer 101 requests rápidos
for i in {1..101}; do
  curl http://localhost:3000/api/users
done
```

**Respuesta esperada (request 101):**
```json
{
  "success": false,
  "statusCode": 429,
  "code": "RATE_LIMIT_EXCEEDED",
  "error": "Demasiadas Solicitudes",
  "message": "ThrottlerException: Too Many Requests"
}
```

---

## ✅ Mejoras Implementadas

- ✅ Códigos de error específicos (`code`)
- ✅ Mensajes en español (`error`)
- ✅ Mensajes detallados (`message`)
- ✅ Path del endpoint (`path`)
- ✅ Timestamp ISO 8601
- ✅ Soporte para múltiples mensajes de validación
- ✅ StatusCode HTTP estándar
- ✅ Formato consistente en toda la API

---

**¡Ahora los errores son más claros y manejables desde el frontend!** 🎉


