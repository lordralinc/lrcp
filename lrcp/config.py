import typing

import toml
from pydantic import Field, PostgresDsn, AnyUrl, BaseModel

from lrcp.const import CONFIG_FILE


class MySQLDsn(AnyUrl):
    allowed_schemes = {
        'mysql'
    }
    host_required = True


class SQLiteDsn(AnyUrl):
    allowed_schemes = {
        'sqlite'
    }
    host_required = False


AnyDsn = typing.Union[MySQLDsn, SQLiteDsn, PostgresDsn]


class ConfigGeneral(BaseModel):
    debug: bool = Field(False)
    database_url: str = Field('sqlite:///var/lib/lrcp/db.sqlite3')
    secret_key: str = Field('')


class ConfigAPI(BaseModel):
    access_token_expire_minutes: int = Field(30)
    url: str = Field('http://127.0.0.1:8000')


class ConfigMaster(BaseModel):
    host: str = Field('127.0.0.1')
    port: int = Field(8001)


class ConfigClient(BaseModel):
    host: str = Field('127.0.0.1')
    port: int = Field(8001)
    api_key: str = Field('')


class Config(BaseModel):
    general: ConfigGeneral = ConfigGeneral()
    api: ConfigAPI = ConfigAPI()
    master: ConfigMaster = ConfigMaster()
    client: ConfigClient = ConfigClient()

    @classmethod
    def load(cls) -> "Config":
        return Config.parse_obj(toml.loads(CONFIG_FILE.read_text('utf-8')))

    def save(self):
        CONFIG_FILE.write_text(
            toml.dumps(self.dict()),
            encoding='utf-8'
        )
