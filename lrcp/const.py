from pathlib import Path

import toml

BASE_DIR = Path(__file__).parent.parent
CONFIG_FILE = BASE_DIR / 'config.toml'

POETRY_FILE = BASE_DIR / 'pyproject.toml'
_poetry_file = toml.loads(POETRY_FILE.read_text(encoding='utf-8'))
VERSION = _poetry_file['tool']['poetry']['version']
DESCRIPTION = _poetry_file['tool']['poetry']['description']
