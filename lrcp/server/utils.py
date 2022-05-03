import typing
from functools import wraps

import grpc

import lrcp.grpc_data
from lrcp.config import Config
from lrcp.db import Server

cfg = Config.load()


def check_api_token(token: str):
    if token != cfg.client.api_key:
        raise PermissionError("Invalid access token")


def get_server(function):
    @wraps(function)
    async def wrapper(servicer, request, context: grpc.ServicerContext) -> typing.Any:
        server = await Server.get_or_none(api_key=request.api_key)
        if not server:
            return lrcp.grpc_data.base_pb2.BaseResponse(
                success=False,
                error_code=lrcp.grpc_data.base_pb2.BaseResponse.ErrorCodes.UNAUTHORIZED,
                error_message="UNAUTHORIZED"
            )
        return await function(servicer, request, context, server)
    return wrapper
