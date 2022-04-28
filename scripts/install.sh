cd /tmp


RESULTS=""
clear_console() {
    echo "^[[30;40m";clear
}

check_result() {
    if [ $1 -ne 0 ]; then
        echo -e "$2"
        exit $1
    fi
}


G="\033[00;32m"
R="\033[00;31m"
Y="\033[1;33m"
RE="\033[00m"




if [ "x$(id -u)" != 'x0' ]; then
    check_result 1 "${R}Script can be run executed only by root${RE}"
fi

echo "${G}Update and install packages...${RE}"
apt-get update -y > /dev/null 2>&1
apt-get install -y git wget build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev libsqlite3-dev wget libbz2-dev > /dev/null 2>&1
RESULTS="${RESULTS}\n${Y}Update and install packages ${G}success${RE}"
clear_console
echo "$RESULTS\n\n"

echo "${G}Download ${R}python3.10...${RE}"
wget https://www.python.org/ftp/python/3.10.0/Python-3.10.0.tar.xz -q
RESULTS="${RESULTS}\n${Y}Download python3.10 ${G}success${RE}"
clear_console
echo "$RESULTS\n\n"


echo "${G}Install ${R}python3.10 with options:${RE}"
echo "${G}Number of jobs: ${Y}$(nproc)${RE}"

tar -xf Python-3.10.0.tar.xz
cd Python-3.10.0 || check_result 1 "${R}Folder Python-3.10.0 not exists${RE}"
./configure --enable-optimizations > /dev/null 2>&1
make -j "$(nproc)" > /dev/null 2>&1 &
make altinstall > /dev/null 2>&1 &
python3.10 -m pip install -U pip > /dev/null 2>&1
python3.10 -m pip install -U poetry > /dev/null 2>&1
cd ..
RESULTS="${RESULTS}\n${Y}Install python3.10 ${G}success${RE}"
clear_console
echo "$RESULTS\n\n"

echo "${G}Cloning ${R}lrcp${RE}"
git clone https://github.com/lordralinc/lrcp.git > /dev/null 2>&1

RESULTS="${RESULTS}\n${Y}Cloning lrcp ${G}success${RE}"
clear_console
echo "$RESULTS\n\n"

cd lrcp || check_result 1 "${R}Folder lrcp not exists${RE}"
poetry build


python3.10 -m venv /var/lib/lrcp/env > /dev/null 2>&1
/var/lib/lrcp/env/bin/python3.10 -m pip install -r requirements.txt > /dev/null 2>&1
poetry build > /dev/null 2>&1
/var/lib/lrcp/env/bin/python3.10 -m pip install dist/*.whl > /dev/null 2>&1

echo "/var/lib/lrcp/env/bin/python3.10 -m lrcp" > /usr/bin/lrcp > /dev/null 2>&1
chmod +x /usr/bin/lrcp > /dev/null 2>&1

cd /tmp
rm -rf lrcp
rm -rf Python3.10*

RESULTS="${RESULTS}\n${Y}Done ${G}success${RE}"
clear_console
echo "$RESULTS\n\n"
