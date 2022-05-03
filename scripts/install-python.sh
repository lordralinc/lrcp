
if [ "x$(id -u)" != 'x0' ]; then
    check_result 1 "Script can be run executed only by root"
fi

apt-get -y upgrade
apt-get install -y wget build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev libsqlite3-dev wget libbz2-dev

cd /tmp || (echo "Folder tmp not exists" && exit)
wget https://www.python.org/ftp/python/3.10.0/Python-3.10.0.tar.xz
tar -xf Python-3.10.0.tar.xz
cd Python-3.10.0 || (echo "Folder Python-3.10.0 not exists" && exit)
./configure --enable-optimizations
make -j "$(nproc)"
make altinstall

cd ..
rm -rf Python-3.10*
