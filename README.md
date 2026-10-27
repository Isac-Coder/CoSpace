# CoSpace

Plataforma de coworking construida con Next.js 16, TypeScript, Prisma y PostgreSQL.

## Páginas incluidas

- `/` — landing page y espacios destacados.
- `/spaces` — catálogo de espacios disponibles.
- `/spaces/[id]` — detalle del espacio y formulario de reserva.
- `/login` y `/register` — autenticación y registro conectados a los endpoints existentes.
- `/dashboard` — panel del usuario con sus reservas, próxima reserva, historial y cancelación.
- `/admin` — dashboard administrativo con métricas y actividad.
- `/admin/spaces` — gestión de espacios: creación, edición, filtros, búsqueda y activación/desactivación.

## Puesta en marcha

1. Copia `.env.example` a `.env` y configura `DATABASE_URL`, `DIRECT_URL` y las claves JWT requeridas por `src/lib/auth/jwt.ts`.
2. Instala dependencias: `npm install`.
3. Genera el cliente Prisma: `npm run prisma:generate`.
4. Aplica las migraciones: `npm run prisma:migrate` (o el comando apropiado para tu entorno).
5. Inicia el servidor: `npm run dev`.

## Notas

- Las páginas y métricas dependen de una base de datos PostgreSQL correctamente configurada y con migraciones aplicadas.
- El catálogo usa imágenes de muestra de `picsum.photos` y la portada una imagen de Unsplash. Sustituye estas imágenes por recursos propios antes de producción.
- La interfaz administrativa usa las rutas `/api/admin/spaces` existentes. Verifica la protección de todas las rutas en el servidor antes de desplegar.
- No se ha podido ejecutar un build de validación en este entorno porque el proyecto no tenía `node_modules` instalado. Ejecuta `npm install && npm run build` localmente y corrige cualquier error de entorno o Prisma que aparezca.
