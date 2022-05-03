import argparse

from passlib.context import CryptContext

from lrcp.db import User
from lrcp.scripts.deco import run_async, tortoise_script_wrapper

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@run_async
@tortoise_script_wrapper
async def create_user(args: argparse.Namespace):
    user = await User.create(
        username=args.username,
        full_name=args.name,
        email=args.email,
        password=pwd_context.hash(args.password),
        is_active=True
    )
    print(f"Создан новый пользователь с логином {user.username}, именем {user.full_name}, email'ом {user.email}")


@run_async
@tortoise_script_wrapper
async def set_active_user(args: argparse.Namespace):
    user = await User.get(username=args.username)
    user.is_active = args.is_active
    await user.save()
    print(f"Активность пользователя {user.username} изменена на {user.is_active}")


@run_async
@tortoise_script_wrapper
async def show_list_user(args: argparse.Namespace):
    from tabulate import tabulate

    users = await User.all()

    print(
        tabulate(
            [[user.username, user.full_name, user.email, user.is_active] for user in users],
            headers=['Логин', 'Имя', 'Email', 'Пользователь активен'],
            tablefmt='orgtbl'
        )
    )


@run_async
@tortoise_script_wrapper
async def set_full_name_user(args: argparse.Namespace):
    user = await User.get(username=args.username)
    user.full_name = args.full_name
    await user.save()
    print(f"Имя пользователя {user.username} изменено на {user.full_name}")


@run_async
@tortoise_script_wrapper
async def set_email_user(args: argparse.Namespace):
    user = await User.get(username=args.username)
    user.email = args.email
    await user.save()
    print(f"Email пользователя {user.username} изменен на {user.email}")

