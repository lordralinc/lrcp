import grpc

import lrcp.grpc_data
from lrcp.api.auth import get_current_user
from lrcp.db import User, Server, StatisticNetwork, StatisticCPU, StatisticRAM
from lrcp.grpc_data import base_types, server_grpc, server_types
from lrcp.server.utils import get_server
from lrcp.utils.cpu_info import CPUInfo
from lrcp.utils.grpc_message_to_dict import grpc_message_to_dict
from lrcp.utils.meminfo import MeminfoWithoutAliases
from lrcp.utils.net_info import NetInfo


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
        return lrcp.grpc_data.base_pb2.BaseResponse(
            success=True
        )

    @get_server
    async def CollectMemoryInfo(
            self,
            request: lrcp.grpc_data.server_pb2.CollectCollectMemoryRequest,
            context: grpc.ServicerContext,
            server: Server
    ) -> lrcp.grpc_data.base_pb2.BaseResponse:
        report = await StatisticRAM.create(
            info=MeminfoWithoutAliases(**grpc_message_to_dict(request.info)),
            server=server
        )
        await report.recollect_5()
        return lrcp.grpc_data.base_pb2.BaseResponse(
            success=True
        )

    @get_server
    async def CollectCPUInfo(
            self,
            request: lrcp.grpc_data.server_pb2.CollectCPUInfoRequest,
            context: grpc.ServicerContext,
            server: Server
    ) -> lrcp.grpc_data.base_pb2.BaseResponse:
        report = await StatisticCPU.create(
            info=CPUInfo.parse_obj(grpc_message_to_dict(request.info)),
            server=server
        )
        await report.recollect_5()
        return lrcp.grpc_data.base_pb2.BaseResponse(
            success=True
        )

    @get_server
    async def CollectNetInfo(
            self,
            request: lrcp.grpc_data.server_pb2.CollectNetInfoRequest,
            context: grpc.ServicerContext,
            server: Server
    ) -> lrcp.grpc_data.base_pb2.BaseResponse:
        result = await StatisticNetwork.create(
            info=[NetInfo.parse_obj(grpc_message_to_dict(interface)) for interface in request.info.interfaces],
            server=server
        )
        await result.recollect_5()
        return lrcp.grpc_data.base_pb2.BaseResponse(
            success=True
        )
