import typing

from pydantic import BaseModel, Field


class MeminfoWithoutAliases(BaseModel):
    mem_total: typing.Optional[int]
    mem_free: typing.Optional[int]
    mem_available: typing.Optional[int]
    buffers: typing.Optional[int]
    cached: typing.Optional[int]
    swap_cached: typing.Optional[int]
    active: typing.Optional[int]
    inactive: typing.Optional[int]
    active_anon: typing.Optional[int]
    inactive_anon: typing.Optional[int]
    active_file: typing.Optional[int]
    inactive_file: typing.Optional[int]
    unevictable: typing.Optional[int]
    mlocked: typing.Optional[int]
    swap_total: typing.Optional[int]
    swap_free: typing.Optional[int]
    dirty: typing.Optional[int]
    writeback: typing.Optional[int]
    anon_pages: typing.Optional[int]
    mapped: typing.Optional[int]
    shmem: typing.Optional[int]
    kreclaimable: typing.Optional[int]
    slab: typing.Optional[int]
    sreclaimable: typing.Optional[int]
    sunreclaim: typing.Optional[int]
    kernel_stack: typing.Optional[int]
    page_tables: typing.Optional[int]
    nfs_unstable: typing.Optional[int]
    bounce: typing.Optional[int]
    writeback_tmp: typing.Optional[int]
    commit_limit: typing.Optional[int]
    committed_as: typing.Optional[int]
    vmalloc_total: typing.Optional[int]
    vmalloc_used: typing.Optional[int]
    vmalloc_chunk: typing.Optional[int]
    percpu: typing.Optional[int]
    hardware_corrupted: typing.Optional[int]
    anon_huge_pages: typing.Optional[int]
    shmem_huge_pages: typing.Optional[int]
    shmem_pmd_mapped: typing.Optional[int]
    file_huge_pages: typing.Optional[int]
    file_pmd_mapped: typing.Optional[int]
    huge_pages_total: typing.Optional[int]
    huge_pages_free: typing.Optional[int]
    huge_pages_rsvd: typing.Optional[int]
    huge_pages_surp: typing.Optional[int]
    hugepagesize: typing.Optional[int]
    hugetlb: typing.Optional[int]
    direct_map_4k: typing.Optional[int]
    direct_map_2m: typing.Optional[int]
    direct_map_1g: typing.Optional[int]


class Meminfo(BaseModel):
    mem_total: typing.Optional[int] = Field(..., alias='MemTotal')
    mem_free: typing.Optional[int] = Field(..., alias='MemFree')
    mem_available: typing.Optional[int] = Field(..., alias='MemAvailable')
    buffers: typing.Optional[int] = Field(..., alias='Buffers')
    cached: typing.Optional[int] = Field(..., alias='Cached')
    swap_cached: typing.Optional[int] = Field(..., alias='SwapCached')
    active: typing.Optional[int] = Field(..., alias='Active')
    inactive: typing.Optional[int] = Field(..., alias='Inactive')
    active_anon: typing.Optional[int] = Field(..., alias='Active(anon)')
    inactive_anon: typing.Optional[int] = Field(..., alias='Inactive(anon)')
    active_file: typing.Optional[int] = Field(..., alias='Active(file)')
    inactive_file: typing.Optional[int] = Field(..., alias='Inactive(file)')
    unevictable: typing.Optional[int] = Field(..., alias='Unevictable')
    mlocked: typing.Optional[int] = Field(..., alias='Mlocked')
    swap_total: typing.Optional[int] = Field(..., alias='SwapTotal')
    swap_free: typing.Optional[int] = Field(..., alias='SwapFree')
    dirty: typing.Optional[int] = Field(..., alias='Dirty')
    writeback: typing.Optional[int] = Field(..., alias='Writeback')
    anon_pages: typing.Optional[int] = Field(..., alias='AnonPages')
    mapped: typing.Optional[int] = Field(..., alias='Mapped')
    shmem: typing.Optional[int] = Field(..., alias='Shmem')
    kreclaimable: typing.Optional[int] = Field(..., alias='KReclaimable')
    slab: typing.Optional[int] = Field(..., alias='Slab')
    sreclaimable: typing.Optional[int] = Field(..., alias='SReclaimable')
    sunreclaim: typing.Optional[int] = Field(..., alias='SUnreclaim')
    kernel_stack: typing.Optional[int] = Field(..., alias='KernelStack')
    page_tables: typing.Optional[int] = Field(..., alias='PageTables')
    nfs_unstable: typing.Optional[int] = Field(..., alias='NFS_Unstable')
    bounce: typing.Optional[int] = Field(..., alias='Bounce')
    writeback_tmp: typing.Optional[int] = Field(..., alias='WritebackTmp')
    commit_limit: typing.Optional[int] = Field(..., alias='CommitLimit')
    committed_as: typing.Optional[int] = Field(..., alias='Committed_AS')
    vmalloc_total: typing.Optional[int] = Field(..., alias='VmallocTotal')
    vmalloc_used: typing.Optional[int] = Field(..., alias='VmallocUsed')
    vmalloc_chunk: typing.Optional[int] = Field(..., alias='VmallocChunk')
    percpu: typing.Optional[int] = Field(..., alias='Percpu')
    hardware_corrupted: typing.Optional[int] = Field(..., alias='HardwareCorrupted')
    anon_huge_pages: typing.Optional[int] = Field(..., alias='AnonHugePages')
    shmem_huge_pages: typing.Optional[int] = Field(..., alias='ShmemHugePages')
    shmem_pmd_mapped: typing.Optional[int] = Field(..., alias='ShmemPmdMapped')
    file_huge_pages: typing.Optional[int] = Field(..., alias='FileHugePages')
    file_pmd_mapped: typing.Optional[int] = Field(..., alias='FilePmdMapped')
    huge_pages_total: typing.Optional[int] = Field(..., alias='HugePages_Total')
    huge_pages_free: typing.Optional[int] = Field(..., alias='HugePages_Free')
    huge_pages_rsvd: typing.Optional[int] = Field(..., alias='HugePages_Rsvd')
    huge_pages_surp: typing.Optional[int] = Field(..., alias='HugePages_Surp')
    hugepagesize: typing.Optional[int] = Field(..., alias='Hugepagesize')
    hugetlb: typing.Optional[int] = Field(..., alias='Hugetlb')
    direct_map_4k: typing.Optional[int] = Field(..., alias='DirectMap4k')
    direct_map_2m: typing.Optional[int] = Field(..., alias='DirectMap2M')
    direct_map_1g: typing.Optional[int] = Field(..., alias='DirectMap1G')

    @classmethod
    def get(cls) -> "Meminfo":
        data = {}
        with open('/proc/meminfo', 'r') as file:
            data_list = file.read().split('\n')

        for line in data_list:
            if not line:
                continue
            key, value = line.replace(' ', '').split(':')
            data[key] = int(value.replace('kB', '000'))
        return cls.parse_obj(data)
