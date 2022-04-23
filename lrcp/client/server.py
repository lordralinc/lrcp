import grpc

import lrcp.grpc_data
from lrcp.client.utils import check_api_token
from lrcp.grpc_data import base_types, client_types, client_grpc
from lrcp.utils.cpu_info import CPUInfo
from lrcp.utils.lsb_release import LSBRelease
from lrcp.utils.meminfo import Meminfo
from lrcp.utils.net_info import NetInfo
from lrcp.utils.uptime import Uptime


class ClientServicer(client_grpc.ClientServicerServicer):

    async def Ping(
            self,
            request: base_types.BaseRequest,
            context: grpc.ServicerContext,
    ) -> base_types.BaseResponse:
        return base_types.BaseResponse(success=True)

    async def GetSystemInfo(
            self,
            request: base_types.BaseRequest,
            context: grpc.ServicerContext
    ) -> client_types.GetSystemInfoResponse:
        check_api_token(request.api_key)
        data = LSBRelease.get()
        uptime = Uptime.get().timestamp()
        return client_types.GetSystemInfoResponse(
            os_release=data.release,
            os_name=data.distributor_id,
            uptime=uptime
        )

    async def GetMemoryInfo(
            self,
            request: base_types.BaseRequest,
            context: grpc.ServicerContext,
    ) -> client_types.GetMemoryInfoResponse:
        check_api_token(request.api_key)
        memory = Meminfo.get()
        return client_types.GetMemoryInfoResponse(**memory.dict())

    async def GetCPUInfo(
            self,
            request: base_types.BaseRequest,
            context: grpc.ServicerContext
    ) -> client_types.GetCPUInfoResponse:
        check_api_token(request.api_key)
        cpu = CPUInfo.get()
        return client_types.GetCPUInfoResponse(**cpu.dict())

    async def GetNetInfo(
            self,
            request: base_types.BaseRequest,
            context: grpc.ServicerContext,
    ) -> client_types.GetNetInfoResponse:
        return client_types.GetNetInfoResponse(
            interfaces=[client_types.GetNetInfoResponse.EthInterface(
                name=x.name,
                transmit=client_types.GetNetInfoResponse.EthInterface.Transmit(**x.transmit.dict()),
                receive=client_types.GetNetInfoResponse.EthInterface.Receive(**x.receive.dict()),
            ) for x in NetInfo.get()]
        )
