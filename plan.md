# Plan de Acción - CoSpace

## ⏱️ Cronograma Maestro (Total: 6 Horas)

| Fase | Nombre | Duración | Objetivo Principal |
| :--- | :--- | :--- | :--- |
| **1** | **Infraestructura y Base de Datos** | 45 min | Esquema validado, Migraciones y Seed del Admin. |
| **2** | **Autenticación y Seguridad** | 1h 15 min | Registro, Login, Refresh Tokens en Cookies y Middleware (Proxy). |
| **3** | **Gestión de Espacios (Admin)** | 45 min | CRUD de espacios y lógica de desactivación. |
| **4** | **Core de Reservas (Lógica de Negocio)** | 1h 15 min | Route Handlers con todas las reglas de validación (solapes, horas, etc). |
| **5** | **Frontend: Rutas y Layouts** | 45 min | Estructura de Route Groups, Layouts por rol y i18n básico. |
| **6** | **Frontend: Vistas y Consumo API** | 45 min | Home (SSG), Catálogo/Detalle (SSR), Dashboard (CSR). |
| **7** | **Docker, README y Despliegue** | 30 min | Dockerfile, Documentación técnica y Vercel. |

---

## 🛠️ Detalle Técnico por Fase

### Fase 1: Infraestructura y DB
- [ ] Validar `schema.prisma`.
- [ ] Ejecutar `prisma migrate dev` y generar cliente.
- [ ] Crear `prisma/seed.ts`: Crear el usuario Administrador y espacios de ejemplo.

### Fase 2: Autenticación y Seguridad
- [ ] **Route Handlers**: `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`.
- [ ] **Seguridad**: Implementar `bcrypt` para passwords y `jsonwebtoken` para tokens.
- [ ] **Cookies**: Configurar `httpOnly`, `secure` y `sameSite` para Access y Refresh tokens.
- [ ] **Middleware (`proxy.ts`)**: Proteger rutas `(private)` y `(admin)`.

### Fase 3: Gestión de Espacios (Admin)
- [ ] **Route Handlers**: `/api/spaces` (GET, POST, PUT, PATCH para desactivar).
- [ ] **Lógica**: Validar que no se desactive un espacio con reservas futuras confirmadas.

### Fase 4: Core de Reservas (El corazón del proyecto)
- [ ] **Route Handlers**: `/api/reservations` (GET propias, POST crear, PATCH cancelar).
- [ ] **Implementar Reglas de Negocio**:
    - Validación de horario (7:00 - 21:00) y duración (1-4h).
    - Control de solapamientos (Espacio y Usuario).
    - Límite de 3 reservas futuras.
    - Cálculo de precio en servidor.
    - Ventana de cancelación (2 horas antes).

### Fase 5: Frontend: Rutas y Layouts
- [ ] **Route Groups**: Crear carpetas `(public)`, `(auth)`, `(private)`, `(admin)`.
- [ ] **Layouts**: Navbar/Footer global y layouts específicos por grupo.
- [ ] **i18n**: Configurar soporte para ES/EN.

### Fase 6: Frontend: Vistas y Consumo API
- [ ] **Páginas**:
    - `Home` $\rightarrow$ SSG.
    - `Catálogo` y `Detalle [id]` $\rightarrow$ SSR.
    - `Dashboard` $\rightarrow$ CSR.
- [ ] **Optimización**: Implementar `next/image` para fotos de espacios.
- [ ] **Hidratación**: Componente de reloj/fecha local.

### Fase 7: Docker, README y Despliegue
- [ ] **Docker**: Crear `Dockerfile` multi-stage.
- [ ] **README**: Llenar variables de entorno y pasos de instalación.
- [ ] **Deploy**: Despliegue en Vercel y configuración de Supabase.
