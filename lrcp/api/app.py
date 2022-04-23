import json

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import PlainTextResponse
from tortoise import Tortoise

from lrcp.config import Config
from lrcp.const import VERSION, DESCRIPTION
from lrcp.db.init import init_database
from . import routes
from .exceptions import APIException, APIError, APIExceptionType
from .routes.server.monitor.router import sio_app

cfg = Config.load()

app = FastAPI(
    debug=cfg.general.debug,
    title="LRCP API",
    version=VERSION,
    description=DESCRIPTION,
    license_info={
        "name": "MIT",
        "url": "https://github.com/lordralinc/lrcp/blob/master/LICENSE"
    },
    servers=[
        {"url": cfg.api.url, "description": ""},
    ],
    swagger_ui_parameters={
        "requestSnippets": dict(
            generators={
                'curl_bash': dict(title='cURL (bash)', syntax="bash"),
                'curl_powershell': {
                    'title': "cURL (PowerShell)",
                    'syntax': "powershell"
                },
            },
            defaultExpanded=True,
            languages=None
        ),
        "displayOperationId": True,
        "syntaxHighlight": {
            "activate": True,
            "theme": "obsidian"
        }
    }
)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount('/ws', sio_app)


for route in routes.routers:
    app.include_router(route)


@app.get("/url-list")
def get_all_urls():
    url_list = [{"path": route.path, "name": route.name} for route in app.routes]
    return url_list


@app.on_event('startup')
async def on_startup():
    await init_database(cfg.general.database_url)


@app.on_event('shutdown')
async def on_startup():
    await Tortoise.close_connections()


@app.exception_handler(APIException)
async def unicorn_exception_handler(request: Request, exc: APIException):
    return PlainTextResponse(
        status_code=exc.status_code,
        content=exc.error_model.json(),
        media_type="application/json"
    )


@app.exception_handler(RequestValidationError)
async def unicorn_exception_handler(request: Request, exc: RequestValidationError):
    return PlainTextResponse(
        status_code=422,
        content=APIError(
            type=APIExceptionType.VALIDATION_ERROR,
            message="Validation error",
            extra=exc.errors()
        ).json(),
        media_type="application/json"
    )
