Структура проекта
====================


.. code-block:: text

    .
    ├── docs          # Документация к проекту
    ├── lrcp          #
    │   ├── api       # Rest-api для взаимодействия с вебом
    │   ├── client    # Клиентский сервер
    │   ├── db        # Модели базы данных
    │   ├── grpc_data # Данные gRPC. Генерируются из ./protobuf
    │   ├── scripts   # Скрипты для CLI
    │   ├── server    # Мастер сервер
    │   └── utils     # Утилиты
    ├── protobuf      # Модели protobuf
    ├── scripts       # Скрипты
    └── web           # React приложение


