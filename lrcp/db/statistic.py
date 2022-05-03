import enum
import typing
from abc import ABC, abstractmethod
from datetime import datetime, timedelta

import pydantic
from tortoise import Model, fields

from lrcp.db.fields import PydanticField
from lrcp.utils.cpu_info import CPUInfo
from lrcp.utils.meminfo import MeminfoWithoutAliases
from lrcp.utils.net_info import NetInfo


if typing.TYPE_CHECKING:
    from lrcp.db import Server

__all__ = (
    'StatisticType',

    'StatisticCPU',
    'StatisticRAM',
    'StatisticNetwork',

    'StatisticCPURecollected',
    'StatisticRAMRecollected',
    'StatisticNetworkRecollected',
)


class RecollectMixin:
    date: datetime
    Type: typing.Type['StatisticType']
    server_id: int

    async def recollect(self):
        await self.recollect_15()
        await self.recollect_30()
        await self.recollect_60()
        await self.recollect_day()
        await self.recollect_week()
        await self.recollect_month()

    async def _recollect(self, delta: timedelta, input_type: "StatisticType", output_type: "StatisticType"):
        ...

    async def recollect_15(self):
        if self.date.minute % 15 == 0:
            await self._recollect(timedelta(minutes=15), self.Type.five, self.Type.fifteen)

    async def recollect_30(self):
        if self.date.minute % 30 == 0:
            await self._recollect(timedelta(minutes=30), self.Type.five, self.Type.thirty)

    async def recollect_60(self):
        if self.date.minute == 0:
            await self._recollect(timedelta(hours=1), self.Type.five, self.Type.hourly)

    async def recollect_day(self):
        if self.date.hour == 0 and self.date.minute == 0:
            await self._recollect(timedelta(days=1), self.Type.hourly, self.Type.days)

    async def recollect_week(self):
        if self.date.minute == 0 and self.date.hour == 0 and self.date.weekday() == 0:
            await self._recollect(timedelta(days=7), self.Type.days, self.Type.week)

    async def recollect_month(self):
        if self.date.minute == 0 and self.date.hour == 0 and self.date.day == 1:
            await self._recollect(timedelta(days=7), self.Type.days, self.Type.month)


class StatisticType(enum.Enum):
    five = "5"
    fifteen = "15"
    thirty = "30"
    hourly = "h"
    days = "d"
    week = "w"
    month = "m"


class StatisticCPU(Model):
    server_id: int

    id = fields.UUIDField(pk=True)
    date = fields.DatetimeField(default=datetime.utcnow)
    info: CPUInfo = PydanticField(CPUInfo)
    server: typing.Awaitable['Server'] = fields.ForeignKeyField(
        'models.Server',
        on_delete=fields.CASCADE,
        related_name='statistics_cpu'
    )

    async def recollect_5(self):
        if self.date.minute % 5 == 0 and await self.__class__.all().count() >= 5:
            datas = await self.__class__.filter(date__gte=datetime.utcnow() - timedelta(minutes=5))
            cores = []

            first, last = datas[0].info, datas[len(datas) - 1].info

            cores.append(StatisticCPURecollected.RecollectedCPUInfo(
                name='all',
                load=first.all_load.load(last.all_load)
            ))
            for core_index in range(0, len(first.cores)):
                core_name = (
                    f'[{first.cores[core_index].core_id}] '
                    f'{first.cores[core_index].model_name}'
                )
                cores.append(StatisticCPURecollected.RecollectedCPUInfo(
                    name=core_name,
                    load=first.load[core_index].load(last.load[core_index])
                ))
            result = await StatisticCPURecollected.create(
                type=StatisticCPURecollected.Type.five,
                info=cores,
                server_id=self.server_id
            )
            await result.recollect()
        return

    class Meta:
        table = 'statistic_cpu'
        order_by = ['-date']


class StatisticCPURecollected(RecollectMixin, Model):
    server_id: int

    Type = StatisticType

    class RecollectedCPUInfo(pydantic.BaseModel):
        name: str
        load: float

    id = fields.UUIDField(pk=True)
    date = fields.DatetimeField(default=datetime.utcnow)
    type = fields.CharEnumField(Type)
    info: typing.List[RecollectedCPUInfo] = PydanticField(RecollectedCPUInfo)
    server: typing.Awaitable['Server'] = fields.ForeignKeyField(
        'models.Server',
        on_delete=fields.CASCADE,
        related_name='statistics_cpu_recollected'
    )

    async def _recollect(self, delta: timedelta, input_type: Type, output_type: Type):
        datas = await self.__class__.filter(
            date__gte=datetime.utcnow() - delta,
            type=input_type
        )
        cores = {}

        for data in datas:
            for core in data.info:
                cores[core.name] = cores.get(core.name, []) + [data.info[0].load]

        cores_result = [
            StatisticCPURecollected.RecollectedCPUInfo(
                name=name,
                load=sum(values) / (len(values) or 1)
            ) for name, values in cores.items()
        ]
        await StatisticCPURecollected.create(
            type=output_type,
            info=cores_result,
            server_id=self.server_id
        )

    class Meta:
        table = 'statistic_cpu_recollected'
        order_by = ['-date']


class StatisticRAM(Model):
    server_id: int

    id = fields.UUIDField(pk=True)
    date = fields.DatetimeField(default=datetime.utcnow)
    info: MeminfoWithoutAliases = PydanticField(MeminfoWithoutAliases)
    server: typing.Awaitable['Server'] = fields.ForeignKeyField(
        'models.Server',
        on_delete=fields.CASCADE,
        related_name='statistics_ram'
    )

    async def recollect_5(self):
        if self.date.minute % 5 == 0 and await self.__class__.all().count() >= 5:
            datas = await self.__class__.filter(date__gte=datetime.utcnow() - timedelta(minutes=5))
            rams = []

            for data in datas:
                rams += [{
                    "mem": data.info.mem_total - data.info.mem_available,
                    'swap': data.info.swap_total - data.info.swap_free
                }]
            result = await StatisticRAMRecollected.create(
                type=StatisticRAMRecollected.Type.five,
                info=StatisticRAMRecollected.RecollectedRAMInfo(
                    mem=sum(x['mem'] for x in rams) / len(rams),
                    swap=sum(x['swap'] for x in rams) / len(rams),
                ),
                server_id=self.server_id
            )
            await result.recollect()

        return

    class Meta:
        table = 'statistic_ram'
        order_by = ['date']


class StatisticRAMRecollected(Model, RecollectMixin):
    server_id: int
    Type = StatisticType

    class RecollectedRAMInfo(pydantic.BaseModel):
        mem: float
        swap: float

    id = fields.UUIDField(pk=True)
    date = fields.DatetimeField(default=datetime.utcnow)
    type = fields.CharEnumField(Type)
    info: RecollectedRAMInfo = PydanticField(RecollectedRAMInfo)
    server: typing.Awaitable['Server'] = fields.ForeignKeyField(
        'models.Server',
        on_delete=fields.CASCADE,
        related_name='statistics_ram_recollected'
    )

    async def _recollect(self, delta: timedelta, input_type: Type, output_type: Type):
        datas = await self.__class__.filter(
            date__gte=datetime.utcnow() - delta,
            type=input_type
        )
        await StatisticCPURecollected.create(
            type=output_type,
            info=self.RecollectedRAMInfo(
                mem=sum(x.info.mem for x in datas) / len(datas),
                swap=sum(x.info.swap for x in datas) / len(datas),
            ),
            server_id=self.server_id
        )

    class Meta:
        table = 'statistic_ram_recollected'
        order_by = ['-date']


class StatisticNetwork(Model):
    server_id: int

    id = fields.UUIDField(pk=True)
    date = fields.DatetimeField(default=datetime.utcnow)
    info: typing.List[NetInfo] = PydanticField(NetInfo)
    server: typing.Awaitable['Server'] = fields.ForeignKeyField(
        'models.Server',
        on_delete=fields.CASCADE,
        related_name='statistics_network'
    )

    async def recollect_5(self):
        if self.date.minute % 5 == 0 and await self.__class__.all().count() >= 5:
            datas = await self.__class__.filter(date__gte=datetime.utcnow() - timedelta(minutes=5))
            interfaces = {}
            delta_interfaces = {}

            for data in datas:
                for interface in data.info:
                    inter_data = interfaces.get(interface.name, {'rx': [], 'tx': []})
                    inter_data['rx'] += [interface.receive.bytes]
                    inter_data['tx'] += [interface.transmit.bytes]
                    interfaces[interface.name] = inter_data

            for int_name in interfaces.keys():
                delta_interface = delta_interfaces.get(int_name, {'rx': 0, 'tx': 0})
                for rx_index in range(0, len(interfaces[int_name]['rx']) - 1):
                    delta_interface['rx'] = interfaces[int_name]['rx'][rx_index + 1] - interfaces[int_name]['rx'][
                        rx_index
                    ]
                for tx_index in range(0, len(interfaces[int_name]['tx']) - 1):
                    delta_interface['tx'] = interfaces[int_name]['tx'][tx_index + 1] - interfaces[int_name]['tx'][
                        tx_index
                    ]

                interfaces[int_name]['rx'] = delta_interface['rx'] / (4 * 60)
                interfaces[int_name]['tx'] = delta_interface['tx'] / (4 * 60)

            report = await StatisticNetworkRecollected.create(
                server_id=self.server_id,
                type=StatisticType.five,
                info=[
                    StatisticNetworkRecollected.RecollectedNetworkInfo(
                        name=key,
                        rx=value['rx'],
                        tx=value['tx']
                    )
                    for key, value in interfaces.items()
                ],
            )
            await report.recollect()
        return

    class Meta:
        table = 'statistic_network'
        order_by = ['date']


class StatisticNetworkRecollected(Model, RecollectMixin):
    server_id: int
    Type = StatisticType

    class RecollectedNetworkInfo(pydantic.BaseModel):
        """
        rx и tx в bytes/sec.
        """
        name: str
        rx: float
        tx: float

    id = fields.UUIDField(pk=True)
    date = fields.DatetimeField(default=datetime.utcnow)
    type = fields.CharEnumField(Type)
    info: typing.List[RecollectedNetworkInfo] = PydanticField(RecollectedNetworkInfo)
    server: typing.Awaitable['Server'] = fields.ForeignKeyField(
        'models.Server',
        on_delete=fields.CASCADE,
        related_name='statistics_network_recollected'
    )

    async def _recollect(self, delta: timedelta, input_type: Type, output_type: Type):
        datas = await self.__class__.filter(
            date__gte=datetime.utcnow() - delta,
            type=input_type
        )
        interfaces = {}

        for data in datas:
            for interface in data.info:
                inter_data = interfaces.get(interface.name, {'rx': 0, 'tx': 0})
                inter_data['rx'] += interface.rx
                inter_data['tx'] += interface.tx
                interfaces[interface.name] = inter_data

        for int_name in interfaces.keys():
            interfaces[int_name]['rx'] = interfaces[int_name]['rx'] / len(datas)
            interfaces[int_name]['tx'] = interfaces[int_name]['tx'] / len(datas)

        await StatisticCPURecollected.create(
            type=output_type,
            info=[
                self.RecollectedNetworkInfo(
                    name=key,
                    rx=value['rx'],
                    tx=value['tx']
                )
                for key, value in interfaces.items()
            ],
            server_id=self.server_id
        )

    class Meta:
        table = 'statistic_network_recollected'
        order_by = ['-date']
