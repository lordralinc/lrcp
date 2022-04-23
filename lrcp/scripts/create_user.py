import argparse

from passlib.context import CryptContext

from lrcp.db import User
from lrcp.scripts.deco import run_async, tortoise_script_wrapper

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@run_async
@tortoise_script_wrapper
async def create_user(args: argparse.Namespace):
    await User.create(
        username=args.username,
        full_name=args.name,
        email=args.email,
        password=pwd_context.hash(args.password)
    )
