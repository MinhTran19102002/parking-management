

# ######

import cv2
from paddleocr import PaddleOCR,draw_ocr
from PIL import Image
import numpy as np
import time
import math
import re
from ultralytics import YOLO
from PIL import ImageTk, Image, ImageDraw
import requests




plateCascade = cv2.CascadeClassifier("./unit/haarcascade_russian_plate_number.xml")
haarcascade_car = cv2.CascadeClassifier("./unit/haarcascade_car.xml")
minArea = 500
ocr = PaddleOCR(use_angle_cls=True, lang='en')

url = "./unit/dectect1.mp4"
# url = "./unit/CAM_white.mp4"
# url = "rtmp://103.130.211.150:10050/stream"
cap= cv2.VideoCapture(url)

fps = cap.get(cv2.CAP_PROP_FPS)
print(fps)
if fps == 0:
    fps = 30  # Giả sử 30 FPS nếu không lấy được thông tin

frame_count = 0
frame_skip = 1
default_licenses = ''

while True:
    # Read first frame
    ret, img = cap.read()

    if frame_count % frame_skip == 0:
        start_time = time.time()
        grayscale = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        w= None
        h = None
        x= None
        y = None
        result_licenses = ''
        
        
        gray =  cv2.bilateralFilter(grayscale, 11,17,17)

        edged = cv2.Canny(gray, 190, 200)
        contours , new = cv2.findContours(edged.copy(), cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
        contours = sorted(contours, key=cv2.contourArea, reverse=True)[:30]
        contour_license_plate = None
        license_plate = None
        w= None
        h = None
        x= None
        y = None
        numberPlates = []
        # numberPlates = plateCascade.detectMultiScale(grayscale, 1.1, 4) 
        
        for contour in contours:
            perimeter =  cv2.arcLength(contour, True)
            approx = cv2.approxPolyDP(contour, 0.018* perimeter, True)
            if len(approx) == 4:
                contour_license_plate = approx
                x,y,w,h = cv2.boundingRect(contour_license_plate)
                area = w*h
                if area > minArea and w > h:  
                    numberPlates = list(numberPlates) + [(x,y,w,h)]
        for (x, y, w, h) in numberPlates:
            area = w*h
            if area > minArea:  
                imgRoi = img[y:y+h,x:x+w]
                try:
                    result = ocr.ocr(imgRoi, cls=True)
                    result = result[0]
                    if(result is not None):
                        txts = [line[1][0] for line in result]
                        exact  = [line[1][1] for line in result]
                        license_text = ''
                        if(len(txts)==2):
                            license_text= txts[0] + txts[1]
                        if(len(txts)==1):
                            license_text= txts[0]
                        license_text = license_text.replace(".", "")
                        license_text = license_text.replace("-", "")
                        license_text = license_text.replace(" ", "")
                        if license_text and len(license_text)== 8:
                            if (license_text[0] == 'O' or license_text[0] == '0' or license_text[0] == 'G' or license_text[0] == 'B'):
                                license_text = '6' + license_text[1:]
                            if license_text[1] == 'T':
                                license_text =  license_text[0] +'1' + license_text[2:]
                            if license_text[1] == 'I':
                                license_text =  license_text[0] +'1' + license_text[2:]
                            if license_text[2] == '6':
                                license_text =  license_text[:1] +'G' + license_text[3:]
                            license_text =  license_text[:3] +'-' + license_text[3:]

                            if exact[0] >= 0.85:
                                cv2.rectangle(img, (x, y), (x + w, y + h), (145, 60, 255), 5)
                                result_licenses = license_text
                                break
                            # result_licenses.append(license_text)
                except:  print("Lỗi1111: " )

        pattern = r'^\d{2}[A-Z]-\d{5}$'
        # result_licenses
        if re.match(pattern, result_licenses):
            print("Bien so xe xac dinh la ")
            print(result_licenses)
            if default_licenses != result_licenses:
                default_licenses = result_licenses
                _, img_encoded = cv2.imencode('.jpg', img)
                img_bytes = img_encoded.tobytes()
                data = {
                    'licenePlate': result_licenses
                }
                # Tệp tin hình ảnh

                files = {
                    'image': ('xevao.jpg', img_bytes, 'image/jpeg')
                }
                response = requests.post("http://localhost:8010/api/parkingTurn/createPakingTurnWithoutZoneAndPosition", data=data, files=files)

                # Kiểm tra kết quả trả về
                if response.status_code == 200:
                    print('Success:', response.json())
                else:
                    print('Failed:', response.status_code, response.text)
        end_time = time.time()
        processing_time = end_time - start_time
        processing_time1 = math.ceil(processing_time * 10) / 10 
        time.sleep(processing_time1 - processing_time)
        frame_skip = max(1, int(processing_time1 * fps))

    frame_count += 1
    resized_frame = cv2.resize(img, (640, 480))

    # Hiển thị khung hình đã thay đổi kích thước
    cv2.imshow('Resized Video', resized_frame)

    if cv2.waitKey(25) & 0xFF == ord('q'):
        break
cap.release()
cv2.destroyAllWindows()


