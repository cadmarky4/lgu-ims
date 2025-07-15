FROM node:18-slim

# Install system dependencies and PHP
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    gnupg \
    lsb-release \
    ca-certificates \
    apt-transport-https \
    software-properties-common \
    zip \
    unzip

# Add PHP repository
RUN wget -qO /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
RUN echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/php.list

# Install PHP 8.2 and extensions
RUN apt-get update && apt-get install -y \
    php8.2 \
    php8.2-cli \
    php8.2-common \
    php8.2-curl \
    php8.2-mbstring \
    php8.2-xml \
    php8.2-zip \
    php8.2-pgsql \
    php8.2-bcmath \
    php8.2-gd \
    php8.2-tokenizer \
    php8.2-ctype \
    php8.2-json \
    php8.2-fileinfo

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY composer.json composer.lock ./

# Install Node.js dependencies
RUN npm install

# Install PHP dependencies
RUN composer install --optimize-autoloader --no-dev --no-interaction

# Copy application files
COPY . .

# Build frontend assets
RUN npm run build

# Cache Laravel configurations
RUN php artisan config:cache || true
RUN php artisan route:cache || true
RUN php artisan view:cache || true

# Create necessary directories and set permissions
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views
RUN chmod -R 775 storage bootstrap/cache

# Expose port
EXPOSE $PORT

# Start command
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT