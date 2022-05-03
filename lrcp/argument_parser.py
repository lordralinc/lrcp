import argparse

from lrcp.scripts.setup_server import setup_server

parser = argparse.ArgumentParser(
    usage='poetry run manage'
)

subparsers = parser.add_subparsers()


def create_client():
    from lrcp.client.main import run_client_server
    from lrcp.scripts.setup_client_server import setup_client_server
    client_sp = subparsers.add_parser('client', help="Управление клиентской частью")
    client_sps = client_sp.add_subparsers()

    run_client_server_sp = client_sps.add_parser('run', help="Запустить сервер")
    run_client_server_sp.set_defaults(func=run_client_server)

    setup_client_server_sp = client_sps.add_parser('setup', help="Установка клиентского сервера")
    setup_client_server_sp.add_argument('--master_ip', type=str)
    setup_client_server_sp.add_argument('--master_port', type=int)
    setup_client_server_sp.add_argument('--client_ip', type=str)
    setup_client_server_sp.add_argument('--client_port', type=int)
    setup_client_server_sp.add_argument('--client_name', type=str)
    setup_client_server_sp.add_argument('--token', type=str)
    setup_client_server_sp.set_defaults(func=setup_client_server)


def create_server():
    from lrcp.server.main import run_server

    client_sp = subparsers.add_parser('server', help="Управление серверной частью")
    client_sps = client_sp.add_subparsers()

    run_client_server_sp = client_sps.add_parser('run', help="Запустить сервер")
    run_client_server_sp.set_defaults(func=run_server)

    setup_server_sp = client_sps.add_parser('setup', help="Установка сервера")
    setup_server_sp.add_argument('--secret_key', type=str)
    setup_server_sp.add_argument('--api_url', type=str)
    setup_server_sp.add_argument('--access_token_expire_minutes', type=int, default=30)
    setup_server_sp.add_argument('--master_ip', type=str)
    setup_server_sp.add_argument('--master_port', type=int)
    setup_server_sp.add_argument('--database_url', type=str, default='sqlite://db.sqlite3')
    setup_server_sp.set_defaults(func=setup_server)


def create_db():
    from lrcp.scripts.database_user import (
        create_user,
        set_active_user,
        show_list_user,
        set_full_name_user,
        set_email_user
    )

    db_sp = subparsers.add_parser('db', help="Управление базой данных")
    db_sps = db_sp.add_subparsers()

    db_user_sp = db_sps.add_parser('user', help="Управление пользователями")
    db_user_sps = db_user_sp.add_subparsers()

    list_user_sp = db_user_sps.add_parser('list', help="Просмотр списка пользователей")
    list_user_sp.set_defaults(func=show_list_user)

    create_user_sp = db_user_sps.add_parser('create', help="Создать пользователя")
    create_user_sp.add_argument('--username', type=str)
    create_user_sp.add_argument('--password', type=str)
    create_user_sp.add_argument('--name', type=str, default="")
    create_user_sp.add_argument('--email', type=str, default="")
    create_user_sp.set_defaults(func=create_user)

    set_active_user_sp = db_user_sps.add_parser('set_active', help="Установить активность")
    set_active_user_sp.add_argument('--username', type=str)
    set_active_user_sp.add_argument('--is_active', action=argparse.BooleanOptionalAction, default=False)
    set_active_user_sp.set_defaults(func=set_active_user)

    set_full_name_user_sp = db_user_sps.add_parser('set_full_name', help="Установить имя")
    set_full_name_user_sp.add_argument('--username', type=str)
    set_full_name_user_sp.add_argument('--full_name', type=str, default=None)
    set_full_name_user_sp.set_defaults(func=set_full_name_user)

    set_email_user_sp = db_user_sps.add_parser('set_email', help="Установить email")
    set_email_user_sp.add_argument('--username', type=str)
    set_email_user_sp.add_argument('--email', type=str, default=None)
    set_email_user_sp.set_defaults(func=set_email_user)


def create_parser():
    create_client()
    create_server()
    create_db()
    return parser
