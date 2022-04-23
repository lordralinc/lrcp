import typing

from pydantic import BaseModel


class GetSelfUserResponse(BaseModel):
    username: str
    two_factor_enabled: bool
    full_name: typing.Optional[str] = None
    email: typing.Optional[str] = None


class Get2FAData(BaseModel):
    code: str
    url: str


class Set2FAData(BaseModel):
    code: int
    totp_code: str
