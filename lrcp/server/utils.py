from lrcp.config import Config

cfg = Config.load()


def check_api_token(token: str):
    if token != cfg.client.api_key:
        raise PermissionError("Invalid access token")
