import json
import time
import typing

import pydantic


class CPUCore(pydantic.BaseModel):
    processor: int
    vendor_id: str
    cpu_family: int
    model: int
    model_name: str
    stepping: int
    microcode: str
    cpu_mhz: str
    cache_size: int
    physical_id: int
    siblings: int
    core_id: int
    cpu_cores: int
    apicid: int
    initial_apicid: int
    fpu: bool
    fpu_exception: bool
    cpuid_level: int
    wp: bool
    flags: typing.List[str]
    bugs: typing.List[str]
    bogomips: float
    tlb_size: typing.Optional[str] = None
    clflush_size: int
    cache_alignment: int
    address_sizes: typing.List[str]
    power_management: typing.List[str]

    @classmethod
    def get(cls, lines: typing.List[str]) -> "CPUCore":
        data = {}
        clean_data = {}
        for line in lines:
            key, value = line.replace('\t', '').split(':', maxsplit=1)
            data[key.lower().replace(' ', '_')] = value

        for key, value in data.items():
            if value.startswith(' '):
                value = value[1:]
            if value == "yes":
                clean_data[key] = True
            elif value == "no":
                clean_data[key] = False
            elif value.endswith("KB"):
                clean_data[key] = int(value.replace(' KB', '')) * 1024
            elif value.endswith("MB"):
                clean_data[key] = int(value.replace(' MB', '')) * 1024 * 1024
            elif key in ('flags', 'bugs', 'power_management',):
                clean_data[key] = value.split(' ')
            elif key in ('address_sizes',):
                clean_data[key] = value.split(', ')
            else:
                clean_data[key] = value
        return cls.parse_obj(clean_data)


class CPULoadInfo(pydantic.BaseModel):
    user: int
    nice: int
    system: int
    idle: int
    iowait: int
    irq: int
    soft_irq: int
    steal: int
    guest: int
    guest_nice: int

    @property
    def total_idle(self) -> int:
        return self.idle + self.iowait

    @property
    def total_usage(self):
        return self.user + self.nice + self.system + self.irq + self.soft_irq + self.steal

    @property
    def total(self):
        return self.total_usage + self.total_idle

    def load(self, last: "CPULoadInfo") -> float:
        return (self.total_usage - last.total_usage) / (self.total - last.total) * 100


class CPUInfo(pydantic.BaseModel):
    cores: typing.List[CPUCore] = []
    all_load: CPULoadInfo
    load: typing.List[CPULoadInfo]
    load_avg_1: float
    load_avg_5: float
    load_avg_15: float
    process_current: int
    process_all: int
    last_pid: int

    @classmethod
    def get_cores(cls) -> typing.List[CPUCore]:
        with open('/proc/cpuinfo', 'r') as file:
            file_data = file.read()

        lines = file_data.split("\n")
        blocks = []
        for line in lines:
            if not line:
                continue
            if line.startswith('processor'):
                blocks.append([])
            blocks[-1].append(line)
        return [CPUCore.get(block) for block in blocks]

    @classmethod
    def parse_cpu_line(cls, line: str) -> typing.Tuple[str, CPULoadInfo]:
        name, user, nice, system, idle, iowait, irq, soft_irq, steal, guest, guest_nice = list(
            s for s in line.split(' ') if s
        )
        return name, CPULoadInfo(
            user=user, nice=nice,
            system=system, idle=idle,
            iowait=iowait,
            irq=irq, soft_irq=soft_irq,
            steal=steal, guest=guest, guest_nice=guest_nice
        )

    @classmethod
    def get(cls) -> "CPUInfo":
        data = {
            "load": [],
            'cores': cls.get_cores()
        }

        with open('/proc/stat', 'r') as file:
            file_data = file.read().split('\n')

        for line in file_data:
            if line.startswith('cpu'):
                name, parsed = cls.parse_cpu_line(line)
                if name == 'cpu':
                    data['all_load'] = parsed
                else:
                    data['load'].append(parsed)

        with open('/proc/loadavg', 'r') as file:
            file_data = file.read()

        load_avg_1, load_avg_5, load_avg_15, process, last_pid = file_data.split(' ')
        data.update({
            'load_avg_1': load_avg_1,
            'load_avg_5': load_avg_5,
            'load_avg_15': load_avg_15,
            'process_current': process.split('/')[0],
            'process_all': process.split('/')[1],
            'last_pid': last_pid
        })

        return cls.parse_obj(data)


if __name__ == "__main__":
    cpu1 = CPUInfo.get()
    time.sleep(0.2)
    cpu2 = CPUInfo.get()

    print(f"All cpu load: {cpu1.all_load.load(cpu2.all_load)} | {cpu1.load_avg_1} {cpu1.load_avg_5} {cpu1.load_avg_15}")
    for index in range(0, len(cpu1.load)):
        print(
            f"[{cpu1.cores[index].core_id}] {cpu1.cores[index].model_name} {cpu1.load[index].load(cpu2.load[index])}"
        )
