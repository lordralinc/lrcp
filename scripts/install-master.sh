
check_result() {
    if [ $1 -ne 0 ]; then
        echo "Error: $2"
        exit $1
    fi
}


if [ "x$(id -u)" != 'x0' ]; then
    check_result 1 "Script can be run executed only by root"
fi
if [ ! -z "$(grep ^lradmin: /etc/passwd)" ] && [ -z "$force" ]; then
    echo 'Please remove lradmin user account before proceeding.'
    echo 'If you want to do it automatically run installer with -f option:'
    echo -e "Example: bash $0 --force\n"
    check_result 1 "User lradmin exists"
fi

memory=$(grep 'MemTotal' /proc/meminfo |tr ' ' '\n' |grep [0-9])
if [ -z "$(swapon -s)" ] && [ $memory -lt 1000000 ]; then
    fallocate -l 1G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo "/swapfile   none    swap    sw    0   0" >> /etc/fstab
fi

apt-get -y upgrade
check_result $? 'apt-get upgrade failed'

apt-get install -y curl git wget build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev libsqlite3-dev wget libbz2-dev
apt-get install -y default-jre
apt-get install -y nginx


cd /tmp || (echo "Folder tmp not exists" && exit)
wget https://www.python.org/ftp/python/3.10.0/Python-3.10.0.tar.xz
tar -xf Python-3.10.0.tar.xz
cd Python-3.10.0 || (echo "Folder Python-3.10.0 not exists" && exit)
./configure --enable-optimizations
make -j "$(proc)"
make altinstall

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
nvm install v16.13.1
nvm use v16.13.1

adduser --system --disabled-password --home /home/lradmin --shell /usr/sbin/nologin --gecos "User for LRCP process" lradmin
usermod -aG sudo lradmin


cd /home/lradmin || (echo "Folder /home/lradmin not exists" && exit)


echo download modulules

git clone https://github.com/lordralinc/lrcp.git


echo install depends

python3.10 -m pip install -U pip
python3.10 -m pip install -U poetry
npm install pm2 -g
npm install @openapitools/openapi-generator-cli -g
pm2 startup

cd lrcp || (echo "Folder lrcp not exists" && exit)
poetry install


read -p "Введите URL API: > " API_URL
ip a
read -p "Введите ip адресс gRPC: > " GRPC_IP
read -p "Порт gRPC: > " GRPC_PORT

touch /home/lradmin/lrcp/config.toml

poetry run manage server setup --secret_key "$(openssl rand -hex 32)" --database_url 'sqlite:///home/lradmin/lrcp/db.sqlite3' --api_url $API_URL --master_ip $GRPC_IP --master_port $GRPC_PORT

cd web || (echo "Folder web not exists" && exit)
npm install

cd ..

pm2 start ecosystem.config.js --only lrcp_api

sleep 15s

cd web || (echo "Folder web not exists" && exit)
rm -r src/api

curl "$API_URL"/openapi.json  > openapi.json

openapi-generator-cli generate -i ./openapi.json -o src/api -g typescript-axios

rm ./openapi.json

to_delete='git_push.sh .openapi-generator .gitignore .npmignore .openapi-generator-ignore'
for to_delete_file in $to_delete ; do
    rm -r src/api/$to_delete_file
done
rm openapitools.json
npm run build
cd ..

pm2 start ecosystem.config.js
pm2 save

echo "  _     ____   ____ ____    "
echo " | |   |  _ \ / ___|  _ \   "
echo " | |   | |_) | |   | |_) |  "
echo " | |___|  _ <| |___|  __/   "
echo " |_____|_| \_\\____|_|      "
echo "                            "
echo "                            "
echo " API Endpoint: $API_URL     "
echo " Build web:  /home/lradmin/lrcp/web/build"
echo " Next: create user by poetry run manage db create_user --help"
