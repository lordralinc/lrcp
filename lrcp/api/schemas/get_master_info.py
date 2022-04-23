from pydantic import BaseModel


class GetMasterInfoResponse(BaseModel):
    ip: str
    port: int
