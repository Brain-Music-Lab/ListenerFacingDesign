#! /usr/bin/bash

if [ "$EUID" -ne 0 ]; then
    echo "This script must be run as root"
    exit 1
fi

# Go to current directory
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ "$(pwd)" != "$script_dir" ]; then
    echo "This script must be run from the directory where it's located."
    exit 1
fi

# Initialize frontend
cd frontend
npm install
cd ..

# Initialize backend
cd backend
if [ ! -d ".venv" ]; then
    # Ensure pyenv is installed and has python 3.10.0
    has_version=$(pyenv versions | grep 3.10.0)
    if [ -z "$has_version" ]; then 
        echo ERROR: Python version 3.10.0 must be installed via pyenv. See the top-level README.md.
        exit 1
    fi

    # Set python local version 
    pyenv local 3.10.0
    python -m venv .venv
fi

. .venv/bin/activate

python_version=$(python --version | grep 3.10.0)
if [ -z "$python_version" ]; then 
    echo ERROR: Python version is $(python --version). It needs to be 3.10.0.
    exit 1
fi

apt-get install -y build-essential libgtk-3-dev
pip install --upgrade pip
pip install -r requirements.txt
    
cd ..
