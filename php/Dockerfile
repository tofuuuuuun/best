FROM php:fpm

# PHP設定ファイルをコピー
COPY php.ini /usr/local/etc/php/

# libzip-devをインストール
RUN apt-get update && apt-get install -y libzip-dev

# Composerをコピー
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# zip拡張をインストール
RUN docker-php-ext-install zip

#apucsインストール　有効化
RUN pecl install apcu && docker-php-ext-enable apcu

# faviconをコピー
COPY ./favicon.ico /usr/share/nginx/html/

# SSL証明書と秘密鍵をコピー
COPY ./ssl/certs/letsencrypt33117937.crt /etc/ssl/certs/
COPY ./ssl/certs/letsencrypt33117937Int.crt /etc/ssl/certs/
COPY ./ssl/private/letsencrypt33117937.key /etc/ssl/private/
