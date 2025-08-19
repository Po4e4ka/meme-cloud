FROM php:8.4.3-zts-bullseye

RUN apt update && apt install -y \
    zip \
    git \
    libicu-dev \
    libzip-dev \
    vim

RUN pecl install \
    redis \
    xdebug

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install \
    pdo_mysql \
    mysqli \
    zip \
    pcntl \
    intl \
    && docker-php-ext-enable \
    mysqli \
    redis \
    xdebug

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Изменение группы 20 чтобы работало на macOS
RUN groupmod -g 31 dialout

ARG USER_ID
ARG GROUP_ID
ARG USER_NAME

RUN addgroup --gid $GROUP_ID $USER_NAME \
    && adduser --gid $GROUP_ID --uid $USER_ID --home /home/$USER_NAME/ --disabled-password $USER_NAME

WORKDIR /var/www

RUN chown $USER_NAME:$USER_NAME /var/www/

COPY --chown=$USER_NAME:$USER_NAME ./composer.* ./

USER $USER_NAME

RUN composer global require laravel/installer
RUN echo export PATH=~/.composer/vendor/bin:$PATH > ~/.bash_profile

RUN --mount=type=ssh,uid=$USER_ID,gid=$GROUP_ID composer install --no-scripts




