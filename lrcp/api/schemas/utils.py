from lrcp.api.exceptions import APIError, APIExceptionType


def get_responses(
        data: dict,
        need_validation: bool = False,
        need_auth: bool = True,
) -> dict:
    if need_validation:
        data.update({
            422: dict(
                model=APIError,
                description="Validation Error",
                content={
                    "application/json": {
                        "example": dict(
                            type=APIExceptionType.VALIDATION_ERROR.value,
                            message="string",
                            extra=[{
                              "loc": ["string", 0],
                              "msg": "string",
                              "type": "string"
                            }]
                        )
                    }
                }
            )
        })

    if need_auth:
        data.update({
            400: dict(
                model=APIError,
                description="Inactive user response",
                content={
                    "application/json": {
                        "example": dict(
                            type=APIExceptionType.INACTIVE_USER.value,
                            message="string",
                            extra={}
                        )
                    }
                }
            ),
            401: dict(
                model=APIError,
                description="Invalid token response",
                content={
                    "application/json": {
                        "example": dict(
                            type=APIExceptionType.INVALID_CREDIT.value,
                            message="string",
                            extra={}
                        )
                    }
                },
            )
        })
    return data
