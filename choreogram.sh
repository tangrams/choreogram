#!/bin/bash

OS=$(uname)
DIST="UNKNOWN"

# Dependencies
DEPS_COMMON="" 
DEPS_LINUX_COMMON="curl"
DEPS_LINUX_RASPBIAN=""
DEPS_LINUX_UBUNTU="nodejs npm"
DEPS_LINUX_REDHAT=""
DEPS_DARWIN="node"

# what linux distribution is?
if [ -f /etc/os-release ]; then
    . /etc/os-release
    DIST=$NAME
fi

case "$1" in
    install)
        # INSTALL DEPENDECIES
        if [ $OS == "Linux" ]; then
            echo "Install dependeces for Linux - $DIST"

            if [ "$DIST" == "Amazon Linux AMI" ]; then

                # Amazon Linux
                sudo yum update
                sudo yum upgrade
                sudo yum groupinstall "Development Tools"
                if [ ! -e ~/.nvm/ ]; then
                    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
                    nvm install node
                fi

            elif [ "$DIST" == "Ubuntu" ]; then

                sudo apt-get update
                sudo apt-get upgrade
                sudo apt-get install $DEPS_COMMON $DEPS_LINUX_COMMON $DEPS_LINUX_UBUNTU
                sudo ln -s /usr/bin/nodejs /usr/local/bin/node

            elif [ "$DIST" == "Raspbian GNU/Linux" ]; then

                sudo apt-get update
                sudo apt-get upgrade
                sudo apt-get install $DEPS_COMMON $DEPS_LINUX_COMMON $DEPS_LINUX_RASPBIAN
                curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
                sudo apt-get install nodejs -y

            fi

        elif [ $OS == "Darwin" ]; then

            if [ ! -e /usr/local/bin/brew ]; then
                ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
            fi

            brew update
            brew upgrade
            brew install $DEPS_COMMON $DEPS_DARWIN
        fi
        ;;

    start)
        while :
        do
            npm start
            sleep 5
        done
        ;;

    *)
        if [ ! -e /usr/local/bin/paparazzi_worker ]; then
            echo "Usage: $0 install"
        else
            echo "Usage: $0 start"
        fi
        exit 1
        ;;
esac





