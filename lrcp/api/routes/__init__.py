import typing

from fastapi import APIRouter

from . import auth
from . import master
from . import server
from . import user

routers: typing.List[APIRouter] = [
    user.router,
    *master.routers,
    *server.routers,
    *auth.routers,
]
