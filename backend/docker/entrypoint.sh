#!/bin/sh
set -e

cd /var/www/html

# Ensure storage symlink exists (ignore if already created)
php artisan storage:link >/dev/null 2>&1 || true

# Run outstanding migrations (database might not be ready yet, so ignore failure)
php artisan migrate --force >/dev/null 2>&1 || true

exec php artisan serve --host=0.0.0.0 --port=8000
