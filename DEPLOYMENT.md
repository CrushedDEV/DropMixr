# Guía de Despliegue en Producción (Docker)

Esta guía documenta los pasos necesarios para desplegar la aplicación DropMix en un entorno de producción utilizando Docker y Docker Compose.

## Requisitos Previos

- **Docker** y **Docker Compose** instalados en el servidor.
- Acceso a la terminal del servidor (SSH).
- (Opcional) Git para clonar el repositorio.

## 1. Configuración Inicial (Servidor)

1.  **Clonar el repositorio** o subir los archivos al servidor.
2.  **Configurar variables de entorno**:
    Crea un archivo `.env` basado en `.env.example` y asegura los siguientes valores para producción con SQLite:
    ```env
    APP_ENV=production
    APP_DEBUG=false
    APP_URL=https://tu-dominio.com

    DB_CONNECTION=sqlite
    DB_DATABASE=/var/www/storage/database.sqlite

    QUEUE_CONNECTION=database
    SESSION_DRIVER=database
    ```
    > **Nota:** No configures `DB_HOST`, `DB_PORT`, `DB_USERNAME`, ni `DB_PASSWORD` si usas SQLite.

3.  **Permisos (Solo necesario si hay problemas)**:
    Si estás en un VPS Linux y tienes problemas de permisos con Docker, asegúrate de que tu usuario pertenece al grupo `docker`:
    ```bash
    sudo usermod -aG docker $USER
    newgrp docker
    ```

## 2. Construir y Arrancar

Ejecuta el siguiente comando para construir las imágenes y levantar los contenedores en segundo plano:

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

Esto iniciará los siguientes servicios:
- `app`: Aplicación Laravel (PHP-FPM).
- `webserver`: Servidor Nginx.
- `queue`: Worker de colas.
- `scheduler`: Ejecutor de tareas programadas.

## 3. Actualizar la Aplicación

Si haces cambios en el código (git pull) o en la configuración, sigue estos pasos para desplegar la nueva versión:

1.  **Bajar los cambios**:
    ```bash
    git pull origin main
    ```
2.  **Reconstruir y reiniciar**:
    ```bash
    docker-compose -f docker-compose.prod.yml up -d --build
    ```
    > Docker detectará los cambios y reconstruirá solo lo necesario.

## 4. Gestión y Mantenimiento

### Ejecutar comandos de Artisan
Para ejecutar cualquier comando de Laravel, usa `exec app`:
```bash
docker-compose -f docker-compose.prod.yml exec app php artisan <comando>
```

### Limpiar Caché
Si la configuración no se actualiza o hay errores extraños:
```bash
docker-compose -f docker-compose.prod.yml exec app php artisan optimize:clear
```

### Dar Permisos de Administrador
Para convertir a un usuario existente en administrador, utiliza el comando personalizado:

```bash
docker-compose -f docker-compose.prod.yml exec app php artisan user:make-admin correo@ejemplo.com
```

Este comando buscará al usuario por correo electrónico y le asignará el rol de 'admin'.

### Ver Logs
Para ver los logs de la aplicación en tiempo real:
```bash
docker-compose -f docker-compose.prod.yml logs -f app
```

## Solución de Problemas Comunes

### Error: "attempt to write a readonly database"
El usuario del servidor web (`www-data`) no tiene permisos para escribir en el archivo SQLite o la carpeta storage.
**Solución:** Reinicia forzando la recreación de contenedores (el entrypoint arregla los permisos automáticamente):
```bash
docker-compose -f docker-compose.prod.yml up -d --build --force-recreate
```

### Error: "permission denied ... /var/run/docker.sock"
Tu usuario de Linux no tiene permisos para hablar con el demonio de Docker.
**Solución:** Ejecuta los comandos del paso 1.3 (usermod y newgrp).
