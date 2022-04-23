import os
import sys
from pathlib import Path

params = [
    'import "base.proto";',
    'import "lrcp/grpc_data/base.proto";'
] if 'to_build' in sys.argv else [
    'import "lrcp/grpc_data/base.proto";',
    'import "base.proto";'
]

for current_directory, _, files in os.walk('protobuf/lrcp/grpc_data'):
    for file_name in files:
        (Path(current_directory) / file_name).write_text(
            (Path(current_directory) / file_name).read_text('utf-8').replace(*params),
            encoding='utf-8'
        )

