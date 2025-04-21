# Inherit from base image
FROM python:3.10.17-slim

# Set up environment
ENV DEBIAN_FRONTEND=noninteractive 

# Create working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libgtk-3-dev \
    software-properties-common \
    libgl1-mesa-dev \
    libxkbcommon-x11-0 \
    libxcb-icccm4 \
    libxcb-image0 \
    libxcb-keysyms1 \
    libxcb-randr0 \
    libxcb-render-util0 \
    libxcb-xinerama0 \
    libxcb-xinput0 \
    libxcb-xfixes0 \
    libxcb-shape0 \
    libxcb-render0 \
    libxcb-glx0 \
    libxi6 \
    libxkbfile1 \
    libxcb-cursor0 \
    # For QtWebEngine
    libqt5webenginecore5 \
    libqt5webchannel5 \
    qtwebengine5-dev \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment; upgrade pip
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH=$VIRTUAL_ENV/bin:$PATH

COPY requirements.txt .

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

EXPOSE 8000

# Run with xvfb-run for headless operation
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]