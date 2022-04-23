from fastapi import APIRouter, Security
from starlette import status

from lrcp.api.auth import get_current_active_user
from lrcp.api.exceptions import APIError, APIExceptionType, APIException
from lrcp.api.schemas import get_responses, DeleteServerResponse
from lrcp.db import Server

router = APIRouter(
    tags=['servers']
)


@router.delete(
    "/server/{server_id}",
    response_model=DeleteServerResponse,
    summary="Получение сервера",
    description="Получение сервера",
    operation_id='deleteServer',
    dependencies=[Security(get_current_active_user)],
    responses=get_responses({
        200: {"model": DeleteServerResponse},
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
async def servers_delete_server(server_id: int):
    server = await Server.get_or_none(id=server_id)
    if not server:
        raise APIException(
            status_code=status.HTTP_404_NOT_FOUND,
            error_type=APIExceptionType.NOT_FOUND,
            error_message="Server not found",
            extra=dict(id=server.id)
        )
    await server.delete()
    return DeleteServerResponse(success=True)
