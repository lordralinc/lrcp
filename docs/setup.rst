Установка
====================

Установка делится на 4 этапа:

- Установка API
- Установка master
- Установка slave
- Установка web-интерфейса


Установка API
--------------------

1. Для установки необходимо подключиться к серверу, например по SSH

.. code-block:: shell

   ssh ip

2. Далее необходимо клонировать репозиторий:

.. code-block:: shell

   git clone https://github.com/lordralinc/lrcp.git
   cd lrcp


3. Установить python3.10 и зависимости:

.. code-block:: shell

   sudo sh ./scripts/install-python.sh
   python3.10 -m pip install -U pip
   python3.10 -m pip install -U poetry
   poetry install

4. Скопировать и отредактировать юнит-файл

.. list-table:: Список переменных для редактирования
   :widths: 25 25 50
   :header-rows: 1

   * - Переменная
     - Как узнать
     - Описание
   * - cwd
     - pwd
     - Путь до рабочей директории
   * - ip_address
     - ip a
     - IP-адрес. Можно использовать 127.0.0.1.
   * - port
     -
     - Порт. Можно использовать 8080

.. code-block:: shell

   cp ./conf/lrcp_api.service.example /etc/systemd/system/lrcp_api.service
   sudo vim /etc/systemd/system/lrcp_api.service
   sudo systemctl enable lrcp_api

5. Отредактировать конфигурационный файл LRCP

.. code-block:: shell

   cp ./conf/config.example.toml ./config.toml
   sudo vim ./config.toml

6. Запустить сервис:

.. code-block:: shell

   sudo systemctl start lrcp_api

Установка master
--------------------

Установка мастера аналогична установке API до пункта 4.
Если API и master находятся на одном сервере, их повторять не надо.

4. Скопировать и отредактировать юнит-файл

.. list-table:: Список переменных для редактирования
   :widths: 25 25 50
   :header-rows: 1

   * - Переменная
     - Как узнать
     - Описание
   * - cwd
     - pwd
     - Путь до рабочей директории

.. code-block:: shell

   cp ./conf/lrcp_master.service.example /etc/systemd/system/lrcp_master.service
   sudo vim /etc/systemd/system/lrcp_master.service
   sudo systemctl enable lrcp_master

5. Если API и master находятся на одном сервере, то этот пункт выполнять не надо.
Отредактировать конфигурационный файл LRCP

.. code-block:: shell

   cp ./conf/config.example.toml ./config.toml
   sudo vim ./config.toml

6. Запустить сервис:

.. code-block:: shell

   sudo systemctl start lrcp_master

Установка slave
--------------------

Установка slave аналогична установке API до пункта 4.
Если API и slave находятся на одном сервере, их повторять не надо.

4. Скопировать и отредактировать юнит-файл

.. list-table:: Список переменных для редактирования
   :widths: 25 25 50
   :header-rows: 1

   * - Переменная
     - Как узнать
     - Описание
   * - cwd
     - pwd
     - Путь до рабочей директории

.. code-block:: shell

   cp ./conf/lrcp_slave.service.example /etc/systemd/system/lrcp_slave.service
   sudo vim /etc/systemd/system/lrcp_slave.service
   sudo systemctl enable lrcp_slave

5. Если API и slave находятся на одном сервере, то этот пункт выполнять не надо.
Отредактировать конфигурационный файл LRCP

.. code-block:: shell

   cp ./conf/config.example.toml ./config.toml
   sudo vim ./config.toml

6. Зайти в web-интерфейс и создать новый сервер

7. Запустить сервис:

.. code-block:: shell

   sudo systemctl start lrcp_slave

Установка web-интерфейса
--------------------

1. Для установки необходимо подключиться к серверу, например по SSH:

.. code-block:: shell

   ssh ip

2. Далее необходимо клонировать репозиторий:

.. code-block:: shell

   git clone https://github.com/lordralinc/lrcp.git
   cd lrcp

3. Необходимо установить nodejs, например, с помощью NVM:

.. code-block:: shell

   wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

Добавить строки в ~/.bash_profile, ~/.zshrc, ~/.profile, или ~/.bashrc

.. code-block:: shell

   export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

4. Установить зависимости:

.. code-block:: shell

   nvm install v16.13.1
   cd web
   npm i

5. Создать файл .env с ссылкой на API

.. code-block:: text

   VITE_API_URL=https://api.lrcp.example.com

6. Скомпилировать:

.. code-block:: shell

   npm run build
   cp -r ./dist/ /var/www/lrcp


