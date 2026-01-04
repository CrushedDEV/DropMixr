# DropMixr - Plataforma de Mashups para DJs y Productores

**DropMixr** es una plataforma donde DJs y productores pueden compartir, intercambiar y descargar mashups de música. La plataforma incluye un sistema de créditos, packs de música, y herramientas de moderación y administración.
![DropMixr Banner](/public/images/og-image.jpg)

## Funcionalidades Principales

### Usuarios
- **Subir Mashups**: Sube tus creaciones (.mp3, .wav, etc). Se generan previsualizaciones automáticamente.
- **Crear Packs**: Agrupa tus mashups en packs (.zip). El precio se calcula automáticamente según el contenido.
- **Intercambio**: Gana créditos subiendo contenido y úsalos para descargar tracks de otros usuarios.
- **Perfil**: Gestiona tus subidas y descargas.

### Administración
- **Moderación**: Aprueba o rechaza mashups subidos.
- **Configuración Dinámica**: Ajusta límites de almacenamiento, cuotas de subida y costos de créditos desde el panel.
- **Gestión**: Administra usuarios, packs y contenido.

---

## Requisitos del Servidor

- **PHP**: 8.2 o superior
- **Composer**: 2.x
- **Node.js**: 20.x o superior
- **Base de Datos**: MySQL 8.0+ / MariaDB / PostgreSQL
- **Servidor Web**: Nginx o Apache
- **Extensiones PHP**: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML, Zip.

---

## 🚀 Despliegue en Producción

Sigue estos pasos para desplegar la aplicación en un entorno de producción (VPS, servidor dedicado, etc).

### 1. Obtener el Código
Clona el repositorio en tu servidor:
```bash
git clone https://github.com/tu_usuario/dropmix.git
cd dropmix
```

### 2. Instalar Dependencias
Instala las dependencias de PHP y optimiza el autoloader:
```bash
composer install --no-dev --optimize-autoloader
```

Instala las dependencias de Node.js:
```bash
npm ci
```

### 3. Configuración del Entorno (.env)
Copia el archivo de ejemplo y configúralo:
```bash
cp .env.example .env
```
Edita el archivo `.env` con tus credenciales de producción:
```ini
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dropmix_prod
DB_USERNAME=tu_usuario_db
DB_PASSWORD=tu_contraseña_db

FILESYSTEM_DISK=public (o s3 si usas AWS)
```

Genera la clave de la aplicación:
```bash
php artisan key:generate
```

### 4. Base de Datos y Seeders
Ejecuta las migraciones y los seeders para configurar las tablas y los **ajustes iniciales** (Límites, costos, etc.):
```bash
php artisan migrate --force
php artisan db:seed --force
```
> **Nota**: El `SettingsSeeder` es crucial para que funcionen los límites de carga y costos.

### 5. Compilar Frontend
Compila los assets para producción:
```bash
npm run build
```

### 6. Enlaces Simbólicos y Permisos
Crea el enlace simbólico para que los archivos públicos sean accesibles:
```bash
php artisan storage:link
```

Asegúrate de que el servidor web pueda escribir en los directorios necesarios:
```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```
*(Ajusta `www-data` según el usuario de tu servidor web, ej: `nginx` o `apache`)*.

### 7. Configuración del Servidor Web (Nginx)

Ejemplo de configuración para Nginx. Asegúrate de apuntar el `root` a la carpeta `/public`.

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/dropmix/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### 8. Primer Usuario Admin
Por defecto no hay usuario admin. Puedes crear uno usando `php artisan tinker`:

```php
php artisan tinker

// Dentro de tinker:
$user = App\Models\User::factory()->create([
    'name' => 'Admin',
    'email' => 'admin@dropmix.com',
    'password' => bcrypt('password'),
    'role' => 'admin' // Asegúrate de tener este campo en tu BD o ajustar según tu lógica de roles
]);
```
*(Si usas un sistema de roles diferente, ajusta el comando anterior)*.

---

## Desarrollo Local

Para trabajar en local:

1. `composer install`
2. `npm install`
3. `php artisan migrate --seed`
4. `php artisan serve`
5. `npm run dev` (en otra terminal)

---

## Configuración de Seguridad

Desde el panel de administración (/admin/settings) puedes configurar:
- **Límite de Almacenamiento (MB)**: Espacio máximo por usuario.
- **Límite de Subidas Diarias**: Cantidad de mashups/packs por día.
- **Costo de Créditos**: Cuánto cuesta descargar y cuánto se gana por subir.
