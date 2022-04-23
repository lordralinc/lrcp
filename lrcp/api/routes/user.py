from fastapi import APIRouter, Security
import pyotp
from starlette import status

from lrcp.api.auth import get_current_active_user
from lrcp.api.exceptions import APIException, APIExceptionType, APIError
from lrcp.api.schemas import GetSelfUserResponse, get_responses, Get2FAData, Set2FAData
from lrcp.db import User

router = APIRouter(
    tags=['user']
)


@router.get(
    "/selfUser",
    operation_id="getSelf",
    response_model=GetSelfUserResponse,
    summary="Текущий пользователь",
    description="Получение текущего пользователя",
    responses=get_responses(
        {200: {"model": GetSelfUserResponse}},
        need_auth=True
    )
)
async def user_get_self(user: User = Security(get_current_active_user, scopes=[])):
    return GetSelfUserResponse(
        username=user.username,
        two_factor_enabled=user.totp is not None,
        full_name=user.full_name,
        email=user.email
    )


@router.delete(
    "/selfUser/2fa",
    operation_id="delete2FA",
    response_model=GetSelfUserResponse,
    summary="Удалить 2FA",
    description="Удалить 2FA",
    responses=get_responses(
        {200: {"model": GetSelfUserResponse}},
        need_auth=True
    )
)
async def user_delete_2fa(user: User = Security(get_current_active_user, scopes=[])):
    user.totp = None
    await user.save()
    return GetSelfUserResponse(
        username=user.username,
        two_factor_enabled=user.totp is not None,
        full_name=user.full_name,
        email=user.email
    )


@router.get(
    "/selfUser/get2FA",
    operation_id="get2FAData",
    response_model=Get2FAData,
    summary="Получить данные для 2FA",
    description="Получить данные для 2FA",
    responses=get_responses(
        {200: {"model": Get2FAData}},
        need_auth=True
    )
)
async def user_get_2fa_data(user: User = Security(get_current_active_user, scopes=[])):
    code = pyotp.random_base32()
    return Get2FAData(
        code=code,
        url=pyotp.TOTP(code).provisioning_uri(user.username, 'LRCP')
    )


@router.post(
    "/selfUser/2fa",
    operation_id="set2FA",
    response_model=GetSelfUserResponse,
    summary="Установить 2FA",
    description="Установить 2FA",
    responses=get_responses(
        {
            200: {"model": GetSelfUserResponse},
            401: {
                "model": APIError,
                "description": "Invalid credit response",
                "content": {
                    "application/json": {
                        "example": dict(type=APIExceptionType.NEED_TWO_FACTOR_CODE.value, message="string", extra={})
                    }
                },
            }
        },
        need_auth=True,
        need_validation=True
    )
)
async def user_set_2fa(
        params: Set2FAData,
        user: User = Security(get_current_active_user, scopes=[])
):

    if pyotp.TOTP(params.totp_code).now() != str(params.code):
        raise APIException(
            status.HTTP_400_BAD_REQUEST,
            APIExceptionType.NEED_TWO_FACTOR_CODE,
            error_message="Invalid 2FA code"
        )

    user.totp = params.totp_code
    await user.save()
    return GetSelfUserResponse(
        username=user.username,
        two_factor_enabled=user.totp is not None,
        full_name=user.full_name,
        email=user.email
    )
