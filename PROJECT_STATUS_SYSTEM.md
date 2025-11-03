# 🔄 Sistema de Estados de Proyectos

## 📊 Estados Disponibles

| Estado | Descripción | Uso |
|--------|-------------|-----|
| **BUDGET** | Borrador/Presupuesto | Estado inicial, para enviar capturas al cliente |
| **ACTIVE** | Proyecto Aceptado | Cuando el cliente acepta. **Se obtiene precio del dólar automáticamente** |
| **IN_PROCESS** | En Proceso | Proyecto en ejecución |
| **FINISHED** | Finalizado | Proyecto completado. **No permite más cambios** |
| **DELETED** | Eliminado | Proyecto cancelado. **Se puede restaurar a ACTIVE** |

---

## 🔀 Transiciones de Estado

### Diagrama de Flujo

```
BUDGET ──────────────┐
                     ↓
                  ACTIVE ──────┬─────────────┐
                     ↓         ↓             ↓
                IN_PROCESS  DELETED    (IN_PROCESS)
                     ↓         ↑
                  FINISHED     │
                               │
                          (restaurar)
```

### Reglas de Transición

#### Desde **BUDGET**:
- ✅ → **ACTIVE** (obtiene precio del dólar automáticamente)
- ❌ No puede ir directamente a IN_PROCESS, FINISHED o DELETED

#### Desde **ACTIVE**:
- ✅ → **IN_PROCESS**
- ✅ → **DELETED**
- ❌ No puede volver a BUDGET
- ❌ No puede saltar a FINISHED

#### Desde **IN_PROCESS**:
- ✅ → **FINISHED**
- ✅ → **DELETED**
- ❌ No puede volver a ACTIVE o BUDGET

#### Desde **FINISHED**:
- ❌ **No permite ningún cambio de estado**
- Estado final inmutable

#### Desde **DELETED**:
- ✅ → **ACTIVE** (restaurar proyecto)
- ❌ No puede ir a ningún otro estado

---

## 💰 Precio del Dólar (USD)

### ¿Cuándo se obtiene?

**Solo cuando el proyecto pasa de BUDGET a ACTIVE**

### API Utilizada

Se consulta la API pública de DolarAPI: https://dolarapi.com/v1/dolares/blue

**Respuesta:**
```json
{
  "compra": 1455,
  "venta": 1475,
  "casa": "blue",
  "nombre": "Blue",
  "moneda": "USD",
  "fechaActualizacion": "2025-10-08T21:03:00.000Z"
}
```

### Almacenamiento

Se guarda el objeto completo en el campo `usdPrice` (JSONB en PostgreSQL):

```json
{
  "id": "uuid-del-proyecto",
  "status": "ACTIVE",
  "usdPrice": {
    "compra": 1455,
    "venta": 1475,
    "casa": "blue",
    "nombre": "Blue",
    "moneda": "USD",
    "fechaActualizacion": "2025-10-08T21:03:00.000Z"
  }
}
```

### Ventajas

- 📊 Registro histórico del valor del dólar al momento de activación
- 💼 Útil para presupuestos y facturación
- 🔒 Inmutable una vez guardado
- 📈 Permite comparar precios históricos

---

## 🔐 Auditoría

**Todos los cambios de estado quedan registrados** en la tabla `audit_logs` con:

- ✅ Usuario que realizó el cambio
- ✅ Estado anterior y nuevo
- ✅ IP real del usuario
- ✅ Geolocalización
- ✅ Timestamp GMT-3 (Buenos Aires)
- ✅ Precio del dólar si se activó

**Ejemplo de log de auditoría:**
```json
{
  "id": "audit-uuid",
  "userId": "user-uuid",
  "action": "UPDATE",
  "entity": "Project",
  "entityId": "project-uuid",
  "changes": {
    "status": "ACTIVE",
    "usdPrice": {
      "compra": 1455,
      "venta": 1475,
      ...
    }
  },
  "ip": "202.136.329.45",
  "location": "Buenos Aires, Argentina",
  "createdAt": "2025-10-09T14:30:00-03:00"
}
```

---

## 📝 Endpoint: Cambiar Estado

### Request

```http
PATCH /api/projects/{id}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "ACTIVE"
}
```

### Respuestas

#### ✅ Éxito (BUDGET → ACTIVE)

```json
{
  "success": true,
  "data": {
    "id": "project-uuid",
    "status": "ACTIVE",
    "usdPrice": {
      "compra": 1455,
      "venta": 1475,
      "casa": "blue",
      "nombre": "Blue",
      "moneda": "USD",
      "fechaActualizacion": "2025-10-08T21:03:00.000Z"
    },
    "amount": 500000,
    "totalPaid": 0,
    "rest": 500000,
    ...
  }
}
```

#### ❌ Error: Transición Inválida

```json
{
  "success": false,
  "statusCode": 400,
  "message": "No se puede cambiar de FINISHED a ACTIVE. Transiciones válidas desde FINISHED: ninguna"
}
```

#### ❌ Error: API Dólar No Disponible

```json
{
  "success": false,
  "statusCode": 400,
  "message": "No se pudo obtener el precio del dólar. Intente nuevamente en unos momentos."
}
```

---

## 💡 Ejemplos de Uso

### 1. Crear Proyecto (inicia en BUDGET)

```bash
POST /api/projects
{
  "amount": 500000,
  "clientId": "client-uuid",
  "workers": 15,
  "dateInit": "2025-01-15",
  "dateEnd": "2025-03-15",
  ...
}

# Respuesta: status = "BUDGET"
```

### 2. Activar Proyecto (obtiene dólar)

```bash
PATCH /api/projects/{id}/status
{
  "status": "ACTIVE"
}

# ✅ Se obtiene precio del dólar automáticamente
# ✅ Queda auditado
```

### 3. Iniciar Trabajo

```bash
PATCH /api/projects/{id}/status
{
  "status": "IN_PROCESS"
}
```

### 4. Finalizar Proyecto

```bash
PATCH /api/projects/{id}/status
{
  "status": "FINISHED"
}

# ⚠️ Después de esto, no se pueden hacer más cambios de estado
```

### 5. Cancelar Proyecto

```bash
PATCH /api/projects/{id}/status
{
  "status": "DELETED"
}
```

### 6. Restaurar Proyecto Cancelado

```bash
PATCH /api/projects/{id}/status
{
  "status": "ACTIVE"
}

# ✅ Se puede restaurar desde DELETED a ACTIVE
```

---

## ⚠️ Validaciones Importantes

### ❌ No se puede saltar estados

```bash
# INCORRECTO ❌
BUDGET → FINISHED
BUDGET → IN_PROCESS
ACTIVE → FINISHED

# CORRECTO ✅
BUDGET → ACTIVE → IN_PROCESS → FINISHED
```

### ❌ FINISHED es inmutable

```bash
# Desde FINISHED no se puede ir a ningún estado
FINISHED → ACTIVE    ❌
FINISHED → DELETED   ❌
```

### ✅ DELETED se puede restaurar

```bash
# Solo a ACTIVE
DELETED → ACTIVE  ✅
```

---

## 🔍 Consultar Estado Actual

```bash
GET /api/projects/{id}
```

**Respuesta incluye:**
- `status`: Estado actual
- `usdPrice`: Precio del dólar (si está en ACTIVE o posterior)

---

## 📊 Filtrar por Estado (futuro)

```bash
# Obtener solo proyectos activos
GET /api/projects?status=ACTIVE

# Obtener proyectos en proceso
GET /api/projects?status=IN_PROCESS
```

---

## 🎯 Casos de Uso

### Caso 1: Presupuesto al Cliente

1. Crear proyecto en **BUDGET**
2. Generar captura en el frontend
3. Enviar al cliente
4. Cliente aprueba → cambiar a **ACTIVE**

### Caso 2: Proyecto Normal

```
BUDGET → ACTIVE → IN_PROCESS → FINISHED
```

### Caso 3: Proyecto Cancelado y Reactivado

```
BUDGET → ACTIVE → DELETED → ACTIVE → IN_PROCESS → FINISHED
```

### Caso 4: Cancelación en Proceso

```
BUDGET → ACTIVE → IN_PROCESS → DELETED
```

---

## 🛡️ Seguridad

- ✅ Todos los cambios requieren autenticación JWT
- ✅ Roles permitidos: ADMIN, SUBADMIN, MANAGER
- ✅ Auditoría completa con IP real
- ✅ Validación estricta de transiciones
- ✅ Precio del dólar inmutable una vez guardado

---

## 📚 Documentación en Swagger

Toda la funcionalidad está documentada en:

```
http://localhost:3000/api/docs
```

Buscar el endpoint:
- **PATCH** `/api/projects/{id}/status` - Cambiar estado del proyecto

---

## ✨ Ventajas del Sistema

1. 🔒 **Seguridad**: No se pueden saltar estados incorrectamente
2. 📊 **Trazabilidad**: Todo cambio queda auditado
3. 💰 **Histórico**: Precio del dólar al momento de activación
4. 🔄 **Flexibilidad**: Se pueden restaurar proyectos cancelados
5. 🛡️ **Inmutabilidad**: FINISHED no permite cambios
6. 📝 **Claridad**: Estados bien definidos y descriptivos

---

¡El sistema de estados está completamente implementado y funcional! 🎉

