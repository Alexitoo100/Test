FROM postgres:15.2-alpine

COPY ../../View/interface/index.php /usr/src/app/index.php

WORKDIR /usr/src/app

RUN docker-php-ext-install pdo_mysql

CMD ["php", "-S", "0.0.0.0:8000"]