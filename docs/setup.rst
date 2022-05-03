Установка
====================

Установка делится на 4 этапа:

- Установка API
- Установка master
- Установка slave
- Установка web-интерфейса


Установка API
====================

Для установки необходимо подключиться к серверу, например по SSH

.. code-block:: shell

   ssh ip

Далее необходимо клонировать репозиторий:

.. code-block:: shell

   git clone https://github.com/lordralinc/lrcp.git
   cd lrcp


Установить python3.10 и зависимости:

.. code-block:: shell

   sudo sh ./scripts/install-python.sh
   python3.10 -m pip install -U pip
   python3.10 -m pip install -U poetry
   poetry install

Скопировать и отредактировать юнит-файл

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

Отредактировать конфигурационный файл LRCP

.. code-block:: shell

   cp ./conf/config.example.toml ./config.toml
   sudo vim ./config.toml

Запустить сервис:

.. code-block:: shell

   sudo systemctl start lrcp_api
