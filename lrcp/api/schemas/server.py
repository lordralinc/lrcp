import datetime

from pydantic import BaseModel

__all__ = (
    'GetServerResponse',
    'GetServerInfoResponse',
    'GetServerMonitorWSResponse',
    'DeleteServerResponse',
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
