## CoSpace - Coworking Reservation Platform

Plataforma fullstack de reservas de espacios de coworking.

## Variables de Entorno (.env)
DATABASE_URL=...
DIRECT_URL=...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

## Ejecución
1. `npm install`
2. `npx prisma db push`
3. `npx prisma db seed`
4. `npm run dev`

## Docker
`docker build -t cospace-app .`
`docker run -p 3000:3000 --env-file .env cospace-app`
