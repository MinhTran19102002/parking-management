import cv2
from datetime import datetime

class Webcam():
    def __init__(self):
        url = "rtmp://103.130.211.150:10050/stream"
        self.vid = cv2.VideoCapture(url)
        # self.vid = cv2.VideoCapture(1)
    def get_frame(self):
        frame_count = 0
        while True:
            _, img =  self.vid.read()
            if frame_count == 10:
                frame_count = 0
                yield img

            frame_count += 1
