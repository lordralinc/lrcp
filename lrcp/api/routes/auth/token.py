from datetime import timedelta

import pyotp
from fastapi import APIRouter, Depends
from starlette import status

from lrcp.api.auth import Token, authenticate_user, create_access_token, OAuth2PasswordRequestForm
from lrcp.api.exceptions import APIError, APIExceptionType, APIException
from lrcp.api.schemas import get_responses
from lrcp.config import Config

cfg = Config.load()


router = APIRouter(
    tags=['auth']
)


@router.post(
    "/authToken",
    response_model=Token,
    summary="Получение токена",
    description="Получение токена по логину и паролю",
    operation_id='getAccessToken',
    responses=get_responses({
            200: {"model": Token},
            401: {
                "model": APIError,
                "description": "Invalid credit response",
                "content": {
                    "application/json": {
                        "example": dict(type=APIExceptionType.INVALID_CREDIT.value, message="string", extra={})
                    }
                },
            }
        },
        need_validation=True
    )
)
async def auth_get_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise APIException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_type=APIExceptionType.INVALID_CREDIT,
            error_message="Invalid login and password"
        )

    if user.totp:
        if int(pyotp.TOTP(user.totp).now()) != form_data.two_factor_code:
            raise APIException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                error_type=APIExceptionType.NEED_TWO_FACTOR_CODE,
                error_message="Need 2FA code"
            )

    access_token_expires = timedelta(minutes=cfg.api.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
