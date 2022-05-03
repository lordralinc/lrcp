from lrcp.config import Config
from lrcp.grpc import GrpcServer
from lrcp.grpc_data import server_types, base_types
from lrcp.utils.cpu_info import CPUInfo
from lrcp.utils.meminfo import Meminfo
from lrcp.utils.net_info import NetInfo

cfg = Config.load()


async def collect_usage_every_minute():
    cpu = CPUInfo.get()
    memory = Meminfo.get()
    network = NetInfo.get()

    with GrpcServer() as connection:
        connection.CollectNetInfo(server_types.CollectNetInfoRequest(
            api_key=cfg.client.api_key,
            info=base_types.GetNetInfoResponse(
                interfaces=[base_types.GetNetInfoResponse.EthInterface(
                    name=x.name,
                    transmit=base_types.GetNetInfoResponse.EthInterface.Transmit(**x.transmit.dict()),
                    receive=base_types.GetNetInfoResponse.EthInterface.Receive(**x.receive.dict()),
                ) for x in network]
            )
        ))
        connection.CollectCPUInfo(server_types.CollectCPUInfoRequest(
            api_key=cfg.client.api_key,
            info=base_types.GetCPUInfoResponse(**cpu.dict())
        ))
        connection.CollectMemoryInfo(server_types.CollectCollectMemoryRequest(
            api_key=cfg.client.api_key,
            info=base_types.GetMemoryInfoResponse(**memory.dict())
        ))
