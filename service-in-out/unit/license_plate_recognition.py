from paddleocr import PaddleOCR,draw_ocr
from PIL import Image
import cv2
import numpy as np

from PIL import ImageTk, Image, ImageDraw


plateCascade = cv2.CascadeClassifier("./unit/haarcascade_russian_plate_number.xml")
minArea = 500
ocr = PaddleOCR(use_angle_cls=True, lang='en')

def select_image1(img):
    try:
        if img is None:
            return cv2.imencode('.jpg', img)[1].tobytes()
        grayscale = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        w= None
        h = None
        x= None
        y = None
        result_licenses = []

        numberPlates = plateCascade.detectMultiScale(grayscale, 1.1, 4)

        for (x, y, w, h) in numberPlates:
            area = w*h
            if area > minArea:  
                imgRoi = img[y:y+h,x:x+w]
                try:
                    result = ocr.ocr(imgRoi, cls=True)
                    result = result[0]
                    if(result is not None):
                        txts = [line[1][0] for line in result]
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
                            if license_text[2] == '6':
                                license_text =  license_text[:1] +'G' + license_text[3:]
                            cv2.rectangle(img, (x, y), (x + w, y + h), (145, 60, 255), 5)
                            cv2.putText(img, license_text, (x-10, y -10), cv2.FONT_HERSHEY_SIMPLEX, 1.75, (255, 0, 0), 2)
                            result_licenses.append(license_text)
                except:  print("Lỗi1111: " )

        return cv2.imencode('.jpg', img)[1].tobytes(), result_licenses #frame
    except:
         print("Lỗi: " )
         return cv2.imencode('.jpg', img)[1].tobytes(), result_licenses
