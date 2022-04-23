poetry_path=$(poetry env info -p)

build_without_grpc_cmd="poetry run python3 -m grpc_tools.protoc -I./protobuf --plugin=$poetry_path/bin/protoc-gen-mypy --python_out=. --mypy_out=."
build_with_grpc_cmd="$build_without_grpc_cmd --grpc_python_out=. --mypy_grpc_out=."

rm -rf lrcp/grpc_data
mkdir lrcp/grpc_data

cat scripts/grpc_init.template > lrcp/grpc_data/__init__.py

poetry run python scripts/replace_imports.py to_build

sh -c "$build_with_grpc_cmd ./protobuf/lrcp/grpc_data/*.proto"

poetry run python scripts/replace_imports.py

echo "Proto compiled"
