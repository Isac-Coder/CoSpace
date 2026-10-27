# 📚 Guía de Uso: CRUD Genérico, Proxy Seguro y Respuestas Estandarizadas

Esta documentación explica cómo implementar y extender el sistema de arquitectura base para reducir la duplicación de código y profesionalizar la comunicación del servidor.

---

## 🚀 1. CRUD Genérico con Prisma

El sistema utiliza una **Clase Base Abstracta** (`BaseService`) que contiene las operaciones comunes de base de datos.

### Implementación de una nueva Entidad
1. **Definir el modelo en `prisma/schema.prisma`**: Añadir el modelo y ejecutar `npx prisma generate`.
2. **Crear el Servicio**: Extender de `BaseService<Entidad, CreateInput, UpdateInput>`.
3. **Crear el Controlador**: Llamar a los métodos `findAll`, `findOne`, `create`, `update` y `remove`.

### Documentación de Métodos de `BaseService`
| Método | Firma | Descripción | Error Común |
| :--- | :--- | :--- | :--- |
| `findAll()` | `Promise<T[]>` | Retorna todos los registros del modelo. | - |
| `findOne(id)` | `Promise<T>` | Busca un registro único por su ID. | `NotFoundException` |
| `create(data)` | `Promise<T>` | Crea un nuevo registro. | Error de Prisma (campos faltantes) |
| `update(id, data)` | `Promise<T>` | Actualiza un registro. | `NotFoundException` |
| `remove(id)` | `Promise<T>` | Elimina un registro. | `NotFoundException` |

---

## 🌐 2. Proxy Genérico Seguro (`GenericProxyService`)

El Proxy Genérico permite realizar peticiones a servicios externos de forma centralizada, aplicando reglas de seguridad para evitar ataques comunes como SSRF e inundaciones de peticiones.

### 🛡️ Reglas de Protección Implementadas
- **Validación de Métodos**: Solo permite los métodos HTTP definidos en `allowedMethods`.
- **Blacklist de IPs**: Bloquea peticiones provenientes de IPs marcadas como maliciosas.
- **Prevención de SSRF**: Bloquea endpoints que contengan `..`, `http` o `localhost`.
- **Manejo de Errores Robusto**: Transforma fallos de red o timeouts en respuestas controladas de NestJS.

### 🚀 Ejemplo Práctico de Uso
```typescript
const weatherProxy = new GenericProxyService({
  targetBaseUrl: 'https://api.weather.com',
  allowedMethods: ['GET'],
  headers: { 'Authorization': 'Bearer TOKEN' }
});

// En el controlador:
return this.proxy.request('GET', '/v1/current', null, {}, clientIp);
```

---

## 📩 3. Sistema de Respuestas y Errores

Para evitar que el frontend reciba formatos diferentes según el error, hemos implementado un sistema de **Respuestas Estandarizadas**.

### 🛠️ ResponseFormatterService
Este servicio se utiliza para envolver cualquier dato en una estructura uniforme.

**Ejemplo de uso en un controlador:**
```typescript
@Get()
async findAll() {
  const users = await this.usersService.findAll();
  // Retorna: { success: true, message: '...', data: users, timestamp: '...', path: '...' }
  return this.formatter.success(users, 'Usuarios recuperados correctamente');
}
```

### 🚨 GlobalExceptionFilter (Manejo de Errores)
No necesitas usar `try-catch` en cada método. El filtro global captura todas las excepciones y las formatea automáticamente.

**Comportamiento automático:**
- **Error 404**: Si lanzas un `NotFoundException`, el cliente recibirá automáticamente:
  `{ "success": false, "message": "The requested resource was not found on this server.", ... }`
- **Error 500**: Cualquier fallo inesperado se convierte en un error controlado para no exponer el stack trace del servidor.

### 🖼️ Página de Not Found (`not-found.html`)
Para usuarios que navegan vía browser, el servidor puede servir el archivo HTML ubicado en `src/common/not-found.html` cuando una ruta no existe.

---

## ⚠️ Consideraciones Globales

1. **Case Sensitivity**: En el CRUD, el nombre del modelo debe coincidir exactamente con el `schema.prisma`.
2. **Seguridad**: Nunca pases el `targetBaseUrl` desde el cliente; debe estar configurado en el servidor.
3. **Prisma Types**: Usa siempre `Prisma.ModeloCreateInput` para el tipado de los DTOs.
4. **Filtros Globales**: Asegúrate de registrar el `GlobalExceptionFilter` en el `main.ts` para activar la estandarización de errores.
