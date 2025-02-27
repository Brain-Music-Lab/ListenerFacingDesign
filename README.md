# Brain Music Lab Data Station
The Brain Music Lab (BML) Data station is a physical installation capable of running different psychopy studies all from the same interface. (Check out the [development of the hardware](https://sophiamontie.com/brain-music-lab-instillation).)


# Getting Started
## Cloning
This repository uses submodules. To clone, run: 
- (HTTPS) `git clone https://github.com/Brain-Music-Lab/ListenerFacingDesign.git --recuse-submodules`
- (SSH) `git clone git@github.com:Brain-Music-Lab/ListenerFacingDesign.git --recuse-submodules`

If the repository is already cloned, run `git submodule update --init --recursive`

## Getting the Right Python Version
The software requires Python 3.10. Run `python --version` to check. If your default Python version is not 3.10, you will need to switch to that. Some ideas to try are below:

1. `cd ListenerFacingDesign && python3.10 -m venv .venv`
    - If this works, this will create a python virtual environment using python 3.10. 
    - Confirm this worked by running `python --version`. The output should be "Python 3.10.X"
2. If idea 1. doesn't work, we recommend using [pyenv](https://realpython.com/intro-to-pyenv/) to acquire Python 3.10 without messing up the current Python environment.

## Setting up the Development Environment
If step 1. above worked for you, you have a virtual environment skip to step 2. 

1) `cd ListenerFacingDesign && python -m venv .venv`
2) `pip install --upgrade pip`
3) `pip install requirements.txt`

## Running the Software Locally
- `cd ListenerFacingDesign`
- `python src/main.py`

## Adding a Psychopy Project
All psychopy projects are kept in the `psychopy-projects` submodule. See the top-level `README.md` for details on adding another project.