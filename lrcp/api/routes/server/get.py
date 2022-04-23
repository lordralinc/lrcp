import datetime
import typing

from fastapi import APIRouter, Security
from starlette import status

from lrcp.api.auth import get_current_active_user
from lrcp.api.exceptions import APIError, APIExceptionType, APIException
from lrcp.api.schemas import GetServerResponse as ServerModel, get_responses, GetServerInfoResponse
from lrcp.db import Server
from lrcp.grpc import GrpcClient
from lrcp.grpc_data import base_types

router = APIRouter(
    tags=['servers']
)


def get_server(server: Server) -> ServerModel:
    data = dict(
        id=server.id,
        name=server.name,
        connect_time=server.connect_time,
        ip_address=server.ip_address,
        grpc_port=server.grpc_port,
        api_key=server.api_key,
    )
    try:
        with GrpcClient(server.ip_address, server.grpc_port) as conn:
            conn.Ping(base_types.BaseRequest(api_key=server.api_key))
        data.update(online=True)
    except:
        data.update(online=False)
    return ServerModel.parse_obj(data)


@router.get(
    "/servers",
    response_model=typing.List[ServerModel],
    summary="Получение списка серверов",
    description="Получение списка серверов",
    operation_id='getServers',
    dependencies=[Security(get_current_active_user)],
    responses=get_responses(
        {200: {"model": typing.List[ServerModel]}},
        need_auth=True
    )
)
async def servers_get_server_list():
    return [
        get_server(server)
        async for server in Server.all()
    ]


@router.get(
    "/server/{server_id}",
    response_model=ServerModel,
    summary="Получение сервера",
    description="Получение сервера",
    operation_id='getServer',
    dependencies=[Security(get_current_active_user)],
    responses=get_responses({
        200: {"model": typing.List[ServerModel]},
        404: {
            "model": APIError,
            "description": "Item not found response",
            "content": {
                "application/json": {
                    "example": dict(
                        type=APIExceptionType.NOT_FOUND.value,
                        message="string",
                        extra={"id": 0}
                    )
                }
            },
        }
    },
        need_auth=True,
        need_validation=True
    )
)
async def servers_get_server_list(server_id: int):
    server = await Server.get_or_none(id=server_id)
    if not server:
        raise APIException(
            status_code=status.HTTP_404_NOT_FOUND,
            error_type=APIExceptionType.NOT_FOUND,
            error_message="GetServerResponse not found",
            extra=dict(id=server.id)
        )
    return get_server(server)


@router.get(
    "/serverInfo/{server_id}",
    response_model=GetServerInfoResponse,
    summary="Получение информации о сервере",
    description="Получение информации о сервере",
    operation_id='getServerInfo',
    dependencies=[Security(get_current_active_user)],
    responses=get_responses({
        200: {"model": GetServerInfoResponse},
        404: {
            "model": APIError,
            "description": "Item not found response",
            "content": {
                "application/json": {
                    "example": dict(
                        type=APIExceptionType.NOT_FOUND.value,
                        message="string",
                        extra={"id": 0}
                    )
                }
            },
        },
        504: {
            "model": APIError,
            "description": "GetServerResponse offline response",
            "content": {
                "application/json": {
                    "example": dict(
                        type=APIExceptionType.CANT_CONNECT_TO_SERVER.value,
                        message="string",
                        extra={"id": 0}
                    )
                }
            },
        },

    },
        need_auth=True,
        need_validation=True
    )
)
async def servers_get_server_info(server_id: int):
    server = await Server.get_or_none(id=server_id)
    if not server:
        raise APIException(
            status_code=status.HTTP_404_NOT_FOUND,
            error_type=APIExceptionType.NOT_FOUND,
            error_message="Server not found",
            extra=dict(id=server.id)
        )
    with GrpcClient(server.ip_address, server.grpc_port) as conn:
        try:
            response = conn.GetSystemInfo(base_types.BaseRequest(api_key=server.api_key))
        except Exception as ex:
            raise APIException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                error_type=APIExceptionType.CANT_CONNECT_TO_SERVER,
                error_message="Server offline",
                extra=dict(id=server.id)
            )
    return GetServerInfoResponse(
        os_name=response.os_name,
        os_release=response.os_release,
        uptime=datetime.datetime.fromtimestamp(response.uptime)
    )
