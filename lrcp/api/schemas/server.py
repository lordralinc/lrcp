import datetime
import typing

from pydantic import BaseModel

from lrcp.db import StatisticCPURecollected, StatisticNetworkRecollected, StatisticRAMRecollected

__all__ = (
    'GetServerResponse',
    'GetServerInfoResponse',
    'GetServerMonitorWSResponse',
    'DeleteServerResponse',
    'ServersGetCpuStatisticsResponse',
    'ServersGetRAMStatisticsResponse',
    'ServersGetNetworkStatisticsResponse',
)


class GetServerResponse(BaseModel):
    id: int
    name: str
    connect_time: datetime.datetime
    api_key: str
    online: bool
    ip_address: str
    grpc_port: int


class GetServerInfoResponse(BaseModel):
    os_name: str
    os_release: str
    uptime: datetime.datetime


class GetServerMonitorWSResponse(BaseModel):
    url: str
    token: str


class DeleteServerResponse(BaseModel):
    success: bool


class ServersGetCpuStatisticsResponse(BaseModel):
    date: datetime.datetime
    info: typing.List[StatisticCPURecollected.RecollectedCPUInfo]


class ServersGetRAMStatisticsResponse(BaseModel):
    date: datetime.datetime
    info: StatisticRAMRecollected.RecollectedRAMInfo


class ServersGetNetworkStatisticsResponse(BaseModel):
    date: datetime.datetime
    info: typing.List[StatisticNetworkRecollected.RecollectedNetworkInfo]
