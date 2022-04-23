import grpc

from lrcp.api.auth import get_current_user
from lrcp.db import User, Server
from lrcp.grpc_data import base_types, server_grpc, server_types


class ServerServicer(server_grpc.ServerServicerServicer):

    async def CreateServer(
            self,
            request: server_types.CreateServerRequest,
            context: grpc.ServicerContext
    ) -> server_types.CreateServerResponse:
        user: User = await get_current_user(request.access_token)
        if user is None or not user.is_active:
            raise PermissionError()
        server = await Server.create(
            name=request.name,
            ip_address=request.ip,
            grpc_port=request.port
        )
        return server_types.CreateServerResponse(
            api_key=server.api_key
        )

    async def Ping(
            self,
            request: base_types.BaseRequest,
            context: grpc.ServicerContext,
    ) -> base_types.BaseResponse:
        return base_types.BaseResponse(success=True)
