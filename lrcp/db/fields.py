import json
import typing

from tortoise import Model, fields
from tortoise.fields.data import JsonDumpsFunc, JsonLoadsFunc, JSON_DUMPS, JSON_LOADS

T = typing.TypeVar('T')


class PydanticField(fields.JSONField):

    def __init__(
            self,
            pydantic_model: typing.Type[T],
            encoder: "JsonDumpsFunc" = JSON_DUMPS,
            decoder: "JsonLoadsFunc" = JSON_LOADS,
            **kwargs,
    ):
        super().__init__(encoder=encoder, decoder=decoder, **kwargs)
        self._pydantic_model = pydantic_model

    def to_python_value(
            self, value: typing.Optional[typing.Union[str, bytes, dict, list]]
    ) -> typing.Optional[typing.Union[T, typing.List[T]]]:
        typed_value = super(PydanticField, self).to_python_value(value)
        if typed_value is None:
            return None
        if isinstance(typed_value, list):
            return [self._pydantic_model.parse_obj(x) for x in typed_value]
        return self._pydantic_model.parse_obj(typed_value)

    def to_db_value(
            self,
            value: typing.Optional[typing.Union[T, typing.List[T]]],
            instance: "typing.Union[typing.Type[Model], Model]"
    ) -> typing.Optional[str]:
        if value is None:
            return None
        if isinstance(value, list):
            return super(PydanticField, self).to_db_value(
                [json.loads(x.json()) for x in value],
                instance
            )
        return value.json()
