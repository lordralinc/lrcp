from pathlib import Path

import toml

BASE_DIR = Path(__file__).parent.parent
POETRY_FILE = BASE_DIR / 'pyproject.toml'
CONFIG_FILE = BASE_DIR / 'config.toml'

_poetry_file = toml.loads(POETRY_FILE.read_text(encoding='utf-8'))
VERSION = _poetry_file['tool']['poetry']['version']
DESCRIPTION = _poetry_file['tool']['poetry']['description']
