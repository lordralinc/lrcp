import subprocess

from pydantic import BaseModel


class LSBRelease(BaseModel):
    distributor_id: str = 'unknown'
    description: str = 'unknown'
    release: str = 'unknown'
    codename: str = 'unknown'

    @classmethod
    def get(cls) -> "LSBRelease":
        _data = {}
        data = subprocess.check_output(['lsb_release', '-a']).decode()
        data_lines = [x for x in data.split('\n') if x]
        for line in data_lines:
            name, value = line.split('\t')
            _data[name.lower().replace(' ', '_').replace(':', '')] = value
        return cls.parse_obj(_data)
