import argparse

from pydantic import BaseModel

from lrcp.config import Config
from lrcp.scripts.deco import run_async, tortoise_script_wrapper


class Args(BaseModel):
    secret_key: str
    api_url: str
    access_token_expire_minutes: int
    master_ip: str
    master_port: int
    database_url: str


@run_async
@tortoise_script_wrapper
async def setup_server(args: argparse.Namespace):
    try:
        cfg = Config.load()
    except Exception as ex:
        print(ex)
        cfg = Config()

    args = Args.parse_obj(args.__dict__)

    cfg.master.port = args.master_port
    cfg.master.host = args.master_ip

    cfg.api.url = args.api_url
    cfg.api.access_token_expire_minutes = args.access_token_expire_minutes

    cfg.general.secret_key = args.secret_key
    cfg.general.database_url = args.database_url
    cfg.save()
