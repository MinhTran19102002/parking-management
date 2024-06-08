FROM python:3.11.7
WORKDIR /app
RUN apt-get update -y 
RUN apt-get install -y libgl1
# RUN apt-get update -y
# RUN apt-get install -y python3-venv  python3-pip python3-dev build-essential hdf5-tools libgl1 libgtk2.0-dev
COPY . /app
RUN pip install -r requirements.txt
EXPOSE 5000
CMD ["python", "app.py"]