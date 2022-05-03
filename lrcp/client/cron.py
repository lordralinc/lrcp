import apscheduler.schedulers.asyncio

from . import cron_functions

shc = apscheduler.schedulers.asyncio.AsyncIOScheduler()

shc.add_job(
    cron_functions.collect_usage_every_minute,
    minute="*/1",
    trigger='cron'
)
