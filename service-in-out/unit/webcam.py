import cv2
from datetime import datetime

class Webcam():
    def __init__(self, url):
        # url = "rtmp://103.130.211.150:10050/stream"
        self.url = url
        self.vid = cv2.VideoCapture(url)
        if self.vid  is None or not self.vid.isOpened():
            print('Warning: unable to open video source: ', url)
            self.vid = None
    def get_frame(self, fram_surf):
        frame_count = 0
        while True:
            _, img =  self.vid.read()
            if frame_count == fram_surf:
                frame_count = 0
                yield img

            frame_count += 1

