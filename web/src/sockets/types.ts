export const EventTypeEnum = {
  InfoMemory: 'info.memory',
  InfoCPU: 'info.cpu',
  InfoNet: 'info.net',
  ErrorServerOffline: 'error.server_offline'
} as const

export interface InfoMemory {
  mem_total?: number
  mem_free?: number
  mem_available?: number
  buffers?: number
  cached?: number
  swap_cached?: number
  active?: number
  inactive?: number
  active_anon?: number
  inactive_anon?: number
  active_file?: number
  inactive_file?: number
  unevictable?: number
  mlocked?: number
  swap_total?: number
  swap_free?: number
  dirty?: number
  writeback?: number
  anon_pages?: number
  mapped?: number
  shmem?: number
  kreclaimable?: number
  slab?: number
  sreclaimable?: number
  sunreclaim?: number
  kernel_stack?: number
  page_tables?: number
  nfs_unstable?: number
  bounce?: number
  writeback_tmp?: number
  commit_limit?: number
  committed_as?: number
  vmalloc_total?: number
  vmalloc_used?: number
  vmalloc_chunk?: number
  percpu?: number
  hardware_corrupted?: number
  anon_huge_pages?: number
  shmem_huge_pages?: number
  shmem_pmd_mapped?: number
  file_huge_pages?: number
  file_pmd_mapped?: number
  huge_pages_total?: number
  huge_pages_free?: number
  huge_pages_rsvd?: number
  huge_pages_surp?: number
  hugepagesize?: number
  hugetlb?: number
  direct_map_4k?: number
  direct_map_2m?: number
  direct_map_1g?: number
}

export interface CPUCore {
  processor: number
  vendor_id: string
  cpu_family: number
  model: number
  model_name: string
  stepping: number
  microcode: string
  cpu_mhz: string
  cache_size: number
  physical_id: number
  siblings: number
  core_id: number
  cpu_cores: number
  apicid: number
  initial_apicid: number
  fpu: boolean
  fpu_exception: boolean
  cpuid_level: number
  wp: boolean
  flags: string[]
  bugs: string[]
  bogomips: number
  tlb_size?: string | null
  clflush_size: number
  cache_alignment: number
  address_sizes: string[]
  power_management: string[]
}

export interface CPULoadInfo {
  user: number
  nice: number
  system: number
  idle: number
  iowait: number
  irq: number
  soft_irq: number
  steal: number
  guest: number
  guest_nice: number
}

export interface InfoCPU {
  load_avg_1: number;
  load_avg_5: number;
  load_avg_15: number;
  process_current: number;
  process_all: number;
  last_pid: number;
  cores: CPUCore[];
  load: CPULoadInfo[];
  all_load: CPULoadInfo;
}

export interface Receive {
  bytes: number
  packets: number
  errors: number
  drop: number
  fifo: number
  frame: number
  compressed: number
  multicast: number
}

export interface Transmit {
  bytes: number
  packets: number
  errors: number
  drop: number
  fifo: number
  colls: number
  carrier: number
  compressed: number
}

export interface EthInterface {
  name: string
  receive: Receive;
  transmit: Transmit;
}

export interface InfoNet {
  interfaces: EthInterface[]
}
