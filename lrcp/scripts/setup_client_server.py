import argparse

from pydantic import BaseModel

from lrcp.config import Config
from lrcp.grpc import GrpcServer
from lrcp.grpc_data import server_types


class Args(BaseModel):
    master_ip: str
    master_port: int
    client_ip: str
    client_port: int
    client_name: str
    token: str


def setup_client_server(args: argparse.Namespace):
    try:
        cfg = Config.load()
    except Exception as ex:
        print(ex)
        cfg = Config()

    print(cfg)

    args = Args.parse_obj(args.__dict__)

    cfg.client.host = args.client_ip
    cfg.client.port = args.client_port

    cfg.master.host = args.master_ip
    cfg.master.port = args.master_port

    cfg.save()

    with GrpcServer() as conn:
        answer = conn.CreateServer(
            server_types.CreateServerRequest(
                access_token=args.token,
                ip=args.client_ip,
                port=args.client_port,
                name=args.client_name,
            )
        )
    cfg.client.api_key = answer.api_key
    cfg.save()
