from . import (
    get,
    delete,
    statistics
)

from .monitor.router import router

routers = [
    get.router,
    delete.router,
    router,
    statistics.router,
]
