import typing

from fastapi import APIRouter, Security

from lrcp.api.auth import get_current_active_user
from lrcp.api.schemas import GetServerResponse as ServerModel, get_responses, GetMasterInfoResponse
from lrcp.config import Config

cfg = Config.load()

router = APIRouter(
    tags=['master']
)


@router.get(
    "/master",
    response_model=GetMasterInfoResponse,
    summary="Получение мастера",
    description="Получение информации о мастер сервере",
    operation_id='getInfo',
    dependencies=[Security(get_current_active_user)],
    responses=get_responses(
        {200: {"model": typing.List[ServerModel]}},
        need_auth=True
    )
)
async def master_get_info():
    return GetMasterInfoResponse(
        ip=cfg.master.host,
        port=cfg.master.port
    )
