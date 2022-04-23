from . import (
    get,
    delete
)

from .monitor.router import router

routers = [
    get.router,
    delete.router,
    router
]
