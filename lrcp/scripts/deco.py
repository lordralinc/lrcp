import asyncio
import functools

from tortoise import Tortoise

from lrcp.config import Config
from lrcp.db.init import init_database


def async_script_wrapper(func):
    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except Exception as ex:
            print("EX:", ex)
        finally:
            await Tortoise.close_connections()
    return wrapper


def script_wrapper(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as ex:
            print("EX:", ex)

    return wrapper


def tortoise_script_wrapper(func):
    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        cfg = Config.load()
        await init_database(cfg.general.database_url)
        await Tortoise.generate_schemas()
        try:
            return await func(*args, **kwargs)
        except Exception as ex:
            print("EX:", ex)
        finally:
            await Tortoise.close_connections()

    return wrapper


def run_async(funct):
    @functools.wraps(funct)
    def wrapper(*args, **kwargs):
        return asyncio.run(funct(*args, **kwargs))

    return wrapper
