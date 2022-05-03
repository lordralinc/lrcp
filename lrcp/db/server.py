import datetime
import secrets

from tortoise import Model, fields

__all__ = (
    'Server',
)


class Server(Model):
    id: int = fields.IntField(pk=True)
    name: str = fields.CharField(max_length=128, null=True)
    connect_time: datetime.datetime = fields.DatetimeField(auto_now=True)

    ip_address: str = fields.CharField(max_length=40)
    grpc_port: int = fields.IntField(default=8001)
    api_key: str = fields.CharField(max_length=128, default=lambda: secrets.token_hex(64))

    @property
    def current_name(self) -> str:
        return self.name or f"Sever {self.id}"

    class Meta:
        table = 'servers'
