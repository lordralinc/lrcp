import typing

import pydantic


class NetInfoReceive(pydantic.BaseModel):
    bytes: int
    packets: int
    errors: int
    drop: int
    fifo: int
    frame: int
    compressed: int
    multicast: int


class NetInfoTransmit(pydantic.BaseModel):
    bytes: int
    packets: int
    errors: int
    drop: int
    fifo: int
    colls: int
    carrier: int
    compressed: int


class NetInfo(pydantic.BaseModel):
    name: str
    receive: NetInfoReceive
    transmit: NetInfoTransmit

    @classmethod
    def get(cls) -> typing.List["NetInfo"]:
        data = []
        with open('/proc/net/dev', 'r') as file:
            file_data = file.read().split('\n')
        data_lines = file_data[2:]
        for line in data_lines:
            if not line:
                continue
            (
                interface_name,

                receive_bytes, receive_packets, receive_errors, receive_drop,
                receive_fifo, receive_frame, receive_compressed, receive_multicast,

                transmit_bytes, transmit_packets, transmit_errors, transmit_drop, transmit_fifo,
                transmit_colls, transmit_carrier,
                transmit_compressed
            ) = list(item for item in line.split(' ') if item)
            data.append(cls(
                name=interface_name[:-1],
                receive=NetInfoReceive(
                    bytes=receive_bytes,
                    packets=receive_packets,
                    errors=receive_errors,
                    drop=receive_drop,
                    fifo=receive_fifo,
                    frame=receive_frame,
                    compressed=receive_compressed,
                    multicast=receive_multicast
                ),
                transmit=NetInfoTransmit(
                    bytes=transmit_bytes,
                    packets=transmit_packets,
                    errors=transmit_errors,
                    drop=transmit_drop,
                    fifo=transmit_fifo,
                    colls=transmit_colls,
                    carrier=transmit_carrier,
                    compressed=transmit_compressed,
                )
            ))
        return data
