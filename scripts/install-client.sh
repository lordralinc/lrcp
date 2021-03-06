
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

apt-get install -y wget build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev libsqlite3-dev wget libbz2-dev

cd /tmp || (echo "Folder tmp not exists" && exit)
wget https://www.python.org/ftp/python/3.10.0/Python-3.10.0.tar.xz
tar -xf Python-3.10.0.tar.xz
cd Python-3.10.0 || (echo "Folder Python-3.10.0 not exists" && exit)
./configure --enable-optimizations
make -j "$(nproc)"
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
pm2 startup

cd lrcp || (echo "Folder lrcp not exists" && exit)
poetry install

touch /home/lradmin/lrcp/config.toml



