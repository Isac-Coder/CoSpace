#!/bin/sh

# Script de inicio para el Frontend
echo "🚀 Iniciando proceso de despliegue del Frontend..."

# Aquí puedes añadir acciones extra como:
# 1. Cambiar permisos de carpetas
# 2. Inyectar variables de entorno en archivos JS estáticos (sed)
# 3. Verificar si el backend está activo antes de lanzar nginx

# Ejemplo: Inyectar la URL de la API en un archivo de config si fuera necesario
# sed -i "s|API_URL_PLACEHOLDER|${API_URL}|g" /usr/share/nginx/html/config.js

echo "✅ Configuraciones aplicadas. Lanzando Nginx..."

# IMPORTANTE: El último comando debe ser el proceso principal del contenedor
exec nginx -g "daemon off;"
