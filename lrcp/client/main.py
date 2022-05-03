import argparse
import asyncio
import os
from concurrent import futures

import grpc

from lrcp.client.cron import shc
from lrcp.client.server import ClientServicer
from lrcp.config import Config
from lrcp.grpc_data import client_grpc

cfg = Config.load()

if cfg.general.debug:
    os.environ['GRPC_VERBOSITY'] = 'DEBUG'
    os.environ['GRPC_TRACE'] = 'http'


def run_client_server(args: argparse.Namespace):
    server = grpc.aio.server(futures.ThreadPoolExecutor(max_workers=10))
    server.add_insecure_port(f'{cfg.client.host}:{cfg.client.port}')
    client_grpc.add_ClientServicerServicer_to_server(ClientServicer(), server)
    loop = asyncio.get_event_loop()
    shc.start()
    loop.create_task(server.start())
    loop.run_until_complete(server.wait_for_termination())
