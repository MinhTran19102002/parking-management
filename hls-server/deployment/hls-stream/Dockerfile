FROM python:3.9-slim-buster

WORKDIR /app3

# COPY hls-stream/requirements.txt requirements.txt
COPY requirements.txt requirements.txt
RUN apt update && apt install -y libsm6 libxext6 ffmpeg libfontconfig1 libxrender1 libgl1-mesa-glx

RUN pip install --upgrade pip
RUN pip install -r requirements.txt
