import datetime
import subprocess


class Uptime(datetime.datetime):

    @classmethod
    def get(cls) -> "Uptime":
        data = subprocess.check_output(['uptime', '-s']).decode().replace('\n', '')
        return cls.strptime(data, "%Y-%m-%d %H:%M:%S")
