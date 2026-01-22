# Stage 1: Install Composer dependencies
FROM composer:2 as composer_deps
WORKDIR /app
COPY composer.json composer.lock ./
# Install only needed dependencies for ziggy (we need vendor/tightenco/ziggy)
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --ignore-platform-reqs

# Stage 2: Build frontend assets
FROM node:20 as frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Copy Ziggy from composer deps so Vite can resolve it
COPY --from=composer_deps /app/vendor/tightenco/ziggy /app/vendor/tightenco/ziggy
RUN npm run build:ssr

# Stage 3: Serve application with PHP
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    libicu-dev \
    default-mysql-client

# Install Node.js (required for SSR email rendering)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd intl zip

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy existing application directory contents
COPY . /var/www

# Copy frontend assets from stage 2
COPY --from=frontend /app/public/build /var/www/public/build
COPY --from=frontend /app/public/build /var/www/public_assets_backup
COPY --from=frontend /app/bootstrap/ssr /var/www/bootstrap/ssr

# Install dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache

# Copy entrypoint
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
