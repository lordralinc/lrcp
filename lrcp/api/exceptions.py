import enum
import typing

from pydantic import BaseModel


class APIExceptionType(enum.Enum):
    VALIDATION_ERROR = "ValidationError"
    INACTIVE_USER = "InactiveUser"
    INVALID_CREDIT = "InvalidCredit"
    NEED_TWO_FACTOR_CODE = "NeedTwoFactorCode"
    NOT_FOUND = "NotFound"
    CANT_CONNECT_TO_SERVER = "CantConnectToServer"
    UNKNOWN = "Unknown"


class APIError(BaseModel):
    type: APIExceptionType
    message: str
    extra: typing.Union[dict, typing.List[dict]]


class APIException(Exception):

    def __init__(
            self,
            status_code: int,
            error_type: APIExceptionType,
            error_message: str,
            extra: typing.Union[dict, typing.List[dict]] = None
    ):
        self.extra = extra or {}
        self.status_code = status_code
        self.error_type = error_type
        self.error_message = error_message

    @property
    def error_model(self) -> APIError:
        return APIError(
            type=self.error_type,
            message=self.error_message,
            extra=self.extra
        )
