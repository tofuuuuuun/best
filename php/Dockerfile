FROM php:fpm
COPY php.ini /usr/local/etc/php/
RUN docker-php-ext-install pdo_mysql
RUN apt-get update \ 
    && apt-get install -y libzip-dev
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN docker-php-ext-install zip