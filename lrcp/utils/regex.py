import re
import typing
from collections import namedtuple

RegexSub = namedtuple('RegexSub', ['regex', 'fields'])


class Regex(RegexSub):
    regex: str
    fields: typing.Dict[str: typing.Any]

    def match(self, string: str) -> dict:
        searched = re.findall(self.regex, string)
        data = {}
        for index, field in enumerate(self.fields.items(), 0):
            try:
                data[field[0]] = searched[index]
            except IndexError:
                data[field[0]] = field[1]
        return data
