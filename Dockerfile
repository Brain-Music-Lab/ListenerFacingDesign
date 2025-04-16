# Inherit from base image
FROM ubuntu:22.04

# Create working directory
WORKDIR /app

# Update package list
RUN apt-get update -y

# Install some psychopy dependencies
RUN apt-get install build-essential -y && \
    apt-get install libgtk-3-dev -y

# Add custom ppa (Needed to install python)
RUN apt-get install software-properties-common -y && \
    add-apt-repository ppa:deadsnakes/ppa

# Refresh package list one more time
RUN apt-get update -y

# Install python3.10
RUN apt-get install python3.10 -y && \
    apt-get install python3-venv -y && \
    apt-get install python3-pip -y

# Create virtual environment; upgrade pip
RUN python3 -m venv .venv
RUN python3 -m pip install --upgrade pip

# Install dependencies
RUN apt-get install -y \
    libxcb-cursor0 \

COPY requirements.txt requirements.txt
RUN python3 -m pip install -r requirements.txt

# Copy src files and projects
COPY /src /app/src
COPY /psychopy-projects /app/psychopy-projects

# ENTRYPOINT [ "/app/startup.sh" ]
CMD ["python3", "src/main.py"]
