CLI
==================

Все команды вводятся из рабочей директории


1. Управление базой данных
------------------

1.1 Управление пользователями
^^^^^^^^^^^^^^^^^^

.. code-block:: text

   Команда:  poetry run manage db user list
   Описание: Просмотр списка пользователей

   Команда:  poetry run manage db user create
   Описание: Создать пользователя
   Параметры:
      --username  - Логин
      --password  - Пароль
      --name      - Имя пользователя
      --email     - Email пользователя

   Команда:  poetry run manage db user set_active
   Описание: Установить активность
   Параметры:
      --username  - Логин
      --is_active - Активность

   Команда:  poetry run manage db user set_full_name
   Описание: Установить имя
   Параметры:
      --username  - Логин
      --full_name - Имя

   Команда:  poetry run manage db user set_email
   Описание: Установить email
   Параметры:
      --username  - Логин
      --email     - Email

2. Управление клиентской частью
------------------

.. code-block:: text

   Команда:  poetry run manage client run
   Описание:  Запустить сервер

   Команда:  poetry run manage client setup
   Описание: Установка клиентского сервера
   Параметры:
      --master_ip    - IP мастера
      --master_port  - Порт мастера
      --client_ip    - IP клиента
      --client_port  - Порт клиента
      --client_name  - Имя сервера
      --token        - Токен

3. Управление серверной частью
------------------

.. code-block:: text

   Команда:  poetry run manage server run
   Описание:  Запустить сервер

   Команда:  poetry run manage server setup
   Описание: Установка клиентского сервера
   Параметры:
      --secret_key                   - Секретный код
      --api_url                      - URL API
      --access_token_expire_minutes  - Время истечения токена
      --master_ip                    - IP мастера
      --master_port                  - Порт мастера
      --database_url                 - DBMS к базе данных
