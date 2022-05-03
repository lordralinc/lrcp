import asyncio
import typing
import datetime

import grpc
import ralisem
import socketio

from lrcp.db import Server
from lrcp.grpc import GrpcClient
from lrcp.grpc_data import base_types
from lrcp.utils.grpc_message_to_dict import grpc_message_to_dict


class ConnectionManager:

    def __init__(self, loop: asyncio.AbstractEventLoop, sio: socketio.AsyncServer):
        self.servers: typing.List[int] = []
        self.loop = loop
        self.sio = sio

    def add_server(self, server_id: int):
        if server_id not in self.servers:
            self.servers.append(server_id)
            self.loop.create_task(self.check_server(server_id))

    def remove_rever(self, server_id: int):
        self.servers.remove(server_id)

    async def check_server(self, server_id: int):
        server = await Server.get(id=server_id)
        base_request = base_types.BaseRequest(api_key=server.api_key)
        sem = ralisem.FixedNewPreviousDelaySemaphore(
            access_times=1, per=datetime.timedelta(seconds=5)
        )
        while server_id in self.servers:
            async with sem:
                try:
                    with GrpcClient(server.ip_address, server.grpc_port) as client:
                        memory_info = client.GetMemoryInfo(base_request)
                        await self.sio.emit(
                            'info.memory',
                            grpc_message_to_dict(memory_info),
                            room=server.id
                        )
                        cpu_info = client.GetCPUInfo(base_request)
                        await self.sio.emit(
                            'info.cpu',
                            grpc_message_to_dict(cpu_info),
                            room=server_id
                        )
                        net_info = client.GetNetInfo(base_request)
                        await self.sio.emit(
                            'info.net',
                            grpc_message_to_dict(net_info),
                            room=server_id
                        )
                except grpc.RpcError as ex:
                    await self.sio.emit(
                        'error.server_offline',
                        {},
                        room=server.id
                    )
                    await self.sio.close_room(server.id)
                except Exception as ex:
                    pass
