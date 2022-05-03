import asyncio

import socketio
from fastapi import APIRouter
from fastapi.security import SecurityScopes

from lrcp.api.auth import get_current_active_user, get_current_user
from lrcp.api.exceptions import APIException
from lrcp.api.routes.server.monitor.logic import ConnectionManager
from lrcp.config import Config

cfg = Config.load()

router = APIRouter(
    tags=['servers']
)
loop = asyncio.get_event_loop()
sio = socketio.AsyncServer(async_mode='asgi', logger=True, cors_allowed_origins=[])
sio_app = socketio.ASGIApp(
    socketio_server=sio, socketio_path='socket.io'
)

manager = ConnectionManager(loop, sio)


@sio.event
async def connect(sid, environ, auth):
    try:
        await get_current_active_user(SecurityScopes([]), await get_current_user(auth['token']))
    except APIException:
        await sio.disconnect(sid)


@sio.event
async def enter(sid, data: dict):
    sio.enter_room(sid, data['server_id'])
    manager.add_server(data['server_id'])


@sio.event
async def exit(sid, data: dict):
    sio.leave_room(sid, data['server_id'])
    if str(data['server_id']) not in sio.manager.rooms:
        manager.remove_rever(data['server_id'])

