import grpc

from lrcp.config import Config
from lrcp.grpc_data import client_grpc, server_grpc


class GrpcClient:

    def __init__(self, host: str, port: int):
        self._host = host
        self._port = port

    def __enter__(self) -> client_grpc.ClientServicerStub:
        self._channel = grpc.insecure_channel(f"{self._host}:{self._port}")
        return client_grpc.ClientServicerStub(self._channel)

    def __exit__(self, exc_type, exc_val, exc_tb):
        self._channel.close()


class GrpcServer:

    def __enter__(self) -> server_grpc.ServerServicerStub:
        cfg = Config.load()
        self._channel = grpc.insecure_channel(f"{cfg.master.host}:{cfg.master.port}")
        return server_grpc.ServerServicerStub(self._channel)

    def __exit__(self, exc_type, exc_val, exc_tb):
        self._channel.close()
