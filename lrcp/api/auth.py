import typing
from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, status, Form
from fastapi.security import SecurityScopes, OAuth2
from fastapi.security.utils import get_authorization_scheme_param
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from starlette.requests import Request
from starlette.status import HTTP_401_UNAUTHORIZED

from lrcp.api.exceptions import APIException, APIExceptionType
from lrcp.config import Config
from lrcp.db import User
from fastapi.openapi.models import OAuthFlows as OAuthFlowsModel, OAuthFlowPassword


class OAuth2PasswordRequestForm:

    def __init__(
        self,
        username: str = Form(...),
        password: str = Form(...),
        two_factor_code: typing.Optional[int] = Form(None),
    ):
        self.username = username
        self.password = password
        self.two_factor_code = two_factor_code


class OAuth2PasswordBearer(OAuth2):
    def __init__(
        self,
        tokenUrl: str,
        scheme_name: typing.Optional[str] = None,
        description: Optional[str] = None,
        auto_error: bool = True,
    ):
        flows = OAuthFlowsModel(password=OAuthFlowPassword(tokenUrl=tokenUrl, scopes={}))
        super().__init__(
            flows=flows,
            scheme_name=scheme_name,
            description=description,
            auto_error=auto_error,
        )

    async def __call__(self, request: Request) -> Optional[str]:
        authorization: str = request.headers.get("Authorization")
        scheme, param = get_authorization_scheme_param(authorization)
        if not authorization or scheme.lower() != "bearer":
            if self.auto_error:
                raise APIException(
                    status_code=HTTP_401_UNAUTHORIZED,
                    error_type=APIExceptionType.INVALID_CREDIT,
                    error_message="Not authenticated",
                    extra={}
                )
            else:
                return None
        return param


cfg = Config.load()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/authToken")

ALGORITHM = "HS256"


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


async def authenticate_user(username: str, password: str):
    user = await User.get_or_none(username=username)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, cfg.general.secret_key, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = APIException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        error_type=APIExceptionType.INVALID_CREDIT,
        error_message="InvalidToken"
    )
    try:
        payload = jwt.decode(token, cfg.general.secret_key, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception

    user = await User.get_or_none(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
        security_scopes: SecurityScopes,
        current_user: User = Depends(get_current_user)
):
    if not current_user.is_active:
        raise APIException(
            status_code=status.HTTP_400_BAD_REQUEST,
            error_type=APIExceptionType.INACTIVE_USER,
            error_message="Inactive user"
        )
    return current_user
