#!/bin/bash

# Exit on error
set -e

# Cache configuration, events, routes, and views
php artisan config:cache
php artisan event:cache
php artisan route:cache
php artisan view:cache

# Sync public assets from backup to volume
if [ -d "/var/www/public_assets_backup" ]; then
    mkdir -p /var/www/public/build
    cp -rf /var/www/public_assets_backup/. /var/www/public/build/
fi

# Create SQLite database if it doesn't exist
if [ ! -f /var/www/storage/database.sqlite ]; then
    touch /var/www/storage/database.sqlite
fi

# Fix permissions for storage and database
chown -R www-data:www-data /var/www/storage
chmod -R 775 /var/www/storage

# Run migrations
php artisan migrate --force

# Link storage if not already linked
php artisan storage:link || true

# Start PHP-FPM
exec php-fpm
