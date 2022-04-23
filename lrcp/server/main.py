import argparse
import asyncio
import os
from concurrent import futures

import grpc

from lrcp.config import Config
from lrcp.db.init import init_database
from lrcp.grpc_data import server_grpc
from lrcp.server.server import ServerServicer

cfg = Config.load()

if cfg.general.debug:
    os.environ['GRPC_VERBOSITY'] = 'DEBUG'
    os.environ['GRPC_TRACE'] = 'http'


def run_server(args: argparse.Namespace):
    server = grpc.aio.server(futures.ThreadPoolExecutor(max_workers=10))
    server.add_insecure_port(f'{cfg.master.host}:{cfg.master.port}')
    server_grpc.add_ServerServicerServicer_to_server(ServerServicer(), server)
    loop = asyncio.get_event_loop()
    loop.create_task(server.start())
    loop.create_task(init_database(cfg.general.database_url))
    loop.run_until_complete(server.wait_for_termination())
