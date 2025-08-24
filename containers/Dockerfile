FROM unit:php8.4

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

RUN groupmod -g $GROUP_ID unit  \
    && usermod -d /var/www/ -u $USER_ID unit

WORKDIR /var/www

RUN chown unit:unit /var/www/

COPY --chown=unit:unit ./composer.* ./

RUN chown -R unit:unit /var/lib/unit /var/run/

USER unit

RUN composer global require laravel/installer
RUN echo export PATH=~/.composer/vendor/bin:$PATH > ~/.bash_profile

RUN --mount=type=ssh,uid=$USER_ID,gid=$GROUP_ID composer install --no-scripts




