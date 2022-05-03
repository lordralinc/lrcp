import typing

from fastapi import APIRouter, Security
from starlette import status

from lrcp.api.auth import get_current_active_user
from lrcp.api.exceptions import APIError, APIExceptionType, APIException
from lrcp.api.schemas import (
    get_responses,
    ServersGetCpuStatisticsResponse,
    ServersGetNetworkStatisticsResponse,
    ServersGetRAMStatisticsResponse
)
from lrcp.db import Server, StatisticCPURecollected, StatisticNetworkRecollected, StatisticRAMRecollected

router = APIRouter(
    tags=['servers']
)


@router.get(
    "/statistics/cpu/{server_id}",
    response_model=typing.List[ServersGetCpuStatisticsResponse],
    summary="Получение статистики CPU",
    description="Получение статистики CPU сервера",
    operation_id='getCPUStatistics',
    dependencies=[Security(get_current_active_user)],
    responses=get_responses({
        200: {"model": typing.List[ServersGetCpuStatisticsResponse]},
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
async def servers_get_cpu_statistics(server_id: int, type: StatisticCPURecollected.Type):
    server = await Server.get_or_none(id=server_id)
    if not server:
        raise APIException(
            status_code=status.HTTP_404_NOT_FOUND,
            error_type=APIExceptionType.NOT_FOUND,
            error_message="GetServerResponse not found",
            extra=dict(id=server.id)
        )
    return [
        ServersGetCpuStatisticsResponse(
          date=x.date,
          info=x.info
        ) async for x in StatisticCPURecollected.filter(type=type, server=server).limit(20)
    ]


@router.get(
    "/statistics/ram/{server_id}",
    response_model=typing.List[ServersGetRAMStatisticsResponse],
    summary="Получение статистики RAM",
    description="Получение статистики RAM сервера",
    operation_id='getRAMStatistics',
    dependencies=[Security(get_current_active_user)],
    responses=get_responses({
        200: {"model": typing.List[ServersGetRAMStatisticsResponse]},
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
async def servers_get_ram_statistics(server_id: int, type: StatisticCPURecollected.Type):
    server = await Server.get_or_none(id=server_id)
    if not server:
        raise APIException(
            status_code=status.HTTP_404_NOT_FOUND,
            error_type=APIExceptionType.NOT_FOUND,
            error_message="GetServerResponse not found",
            extra=dict(id=server.id)
        )
    return [
        ServersGetRAMStatisticsResponse(
          date=x.date,
          info=x.info
        ) async for x in StatisticRAMRecollected.filter(type=type, server=server).limit(20)
    ]


@router.get(
    "/statistics/network/{server_id}",
    response_model=typing.List[ServersGetNetworkStatisticsResponse],
    summary="Получение статистики net",
    description="Получение статистики net сервера",
    operation_id='getNetworkStatistics',
    dependencies=[Security(get_current_active_user)],
    responses=get_responses({
        200: {"model": typing.List[ServersGetNetworkStatisticsResponse]},
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
async def servers_get_network_statistics(server_id: int, type: StatisticNetworkRecollected.Type):
    server = await Server.get_or_none(id=server_id)
    if not server:
        raise APIException(
            status_code=status.HTTP_404_NOT_FOUND,
            error_type=APIExceptionType.NOT_FOUND,
            error_message="GetServerResponse not found",
            extra=dict(id=server.id)
        )
    return [
        ServersGetNetworkStatisticsResponse(
          date=x.date,
          info=x.info
        ) async for x in StatisticNetworkRecollected.filter(type=type, server=server).limit(20)
    ]
