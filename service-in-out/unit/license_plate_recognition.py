from paddleocr import PaddleOCR,draw_ocr
from PIL import Image
import cv2
import numpy as np
import re
import math
from PIL import ImageTk, Image, ImageDraw
import requests
from ultralytics import YOLO
import pandas as pd


plateCascade = cv2.CascadeClassifier("./unit/haarcascade_russian_plate_number.xml")
plateCascadeOut = cv2.CascadeClassifier("./unit/haarcascade_russian_plate_number.xml")
minArea = 500
ocr = PaddleOCR(use_angle_cls=True, lang='en')
global default_licenses_in
default_licenses_in = ''

global default_licenses_out
default_licenses_out = ''

global a1_defl , a2_defl, a3_defl
a1_defl= 0
a2_defl =1
a3_defl =1
global cout_frame 
cout_frame = 0

model=YOLO('yolov8s.pt')

# area1=[(263,243),(130,396),(345,400),(395,240)]
# area2=[(395,240),(345,400),(600,400),(535,240)]
# area3=[(535,240),(600,400),(805,380),(680,240)]


area1=[(230,320),(190,445),(395,445),(405,320)]
area2=[(405,320),(395,445),(620,445),(610,320)]
area3=[(610,320),(620,445),(805,445),(775,320)]

my_file = open("./unit/coco.txt", "r")
data = my_file.read()
class_list = data.split("\n")

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
                            license_text =  license_text[:3] +'-' + license_text[3:]
                            cv2.rectangle(img, (x, y), (x + w, y + h), (145, 60, 255), 5)
                            cv2.putText(img, license_text, (x-10, y -10), cv2.FONT_HERSHEY_SIMPLEX, 1.75, (255, 0, 0), 2)
                            result_licenses.append(license_text)
                except:  print("Lỗi1111: " )

        return cv2.imencode('.jpg', img)[1].tobytes(), result_licenses #frame
    except:
         print("Lỗi: " )
         return cv2.imencode('.jpg', img)[1].tobytes(), result_licenses





def car_into_parking(img, flag):
    try:
        url = "http://localhost:8010/api/parkingTurn/createPakingTurnWithoutZoneAndPosition"
        if img is None:
            return cv2.imencode('.jpg', img)[1].tobytes()
        grayscale = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        w= None
        h = None
        x= None
        y = None
        result_licenses = ''
        
        
        # gray =  cv2.bilateralFilter(grayscale, 11,17,17)

        # edged = cv2.Canny(gray, 190, 200)
        # contours , new = cv2.findContours(edged.copy(), cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
        # contours = sorted(contours, key=cv2.contourArea, reverse=True)[:30]
        contour_license_plate = None
        license_plate = None
        w= None
        h = None
        x= None
        y = None
        numberPlates = []
        # numberPlates = plateCascade.detectMultiScale(grayscale, 1.1, 4) 
        
        # for contour in contours:
        #     perimeter =  cv2.arcLength(contour, True)
        #     approx = cv2.approxPolyDP(contour, 0.018* perimeter, True)
        #     if len(approx) == 4:
        #         contour_license_plate = approx
        #         x,y,w,h = cv2.boundingRect(contour_license_plate)
        #         cv2.rectangle(img, (x, y), (x + w, y + h), (145, 60, 255), 5)
        #         area = w*h
        #         if area > minArea and w > h:  
        #             numberPlates = list(numberPlates) + [(x,y,w,h)]

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
                            print("ket qua la ")
                            print(license_text)
                            print(exact[0])
                            if exact[0] >= 0.85:
                                cv2.rectangle(img, (x, y), (x + w, y + h), (145, 60, 255), 5)
                                result_licenses = license_text
                                break
                            # result_licenses.append(license_text)
                except:  print("Lỗi1111: " )
        # global cout_frame 
        # cout_frame = cout_frame + 1
        pattern = r'^\d{2}[A-Z]-\d{5}$'
        # result_licenses

        if re.match(pattern, result_licenses):
            print("Bien so xe xac dinh la ")
            print(result_licenses)
            global default_licenses_in
            global default_licenses_out
            if default_licenses_in != result_licenses and flag =="in":
                # # cout_frame = 0
                default_licenses_in = result_licenses
                print("""result_licenses""")
                _, img_encoded = cv2.imencode('.jpg', img)
                img_bytes = img_encoded.tobytes()
                data = {
                    'licenePlate': result_licenses
                }
                # Tệp tin hình ảnh

                files = {
                    'image': ('xevao.jpg', img_bytes, 'image/jpeg')
                }
                response = requests.post(url, data=data, files=files)

                # Kiểm tra kết quả trả về
                if response.status_code == 201:
                    print('Success:', response.json())
                else:
                    print('Failed:', response.status_code, response.text)
            elif default_licenses_out != result_licenses and flag =="out":
                default_licenses_out = result_licenses
                data = {
                    'licenePlate': result_licenses
                }
                response1 = requests.post("http://localhost:8010/api/parkingTurn/outPaking", json=data)

                # Kiểm tra kết quả trả về
                if response1.status_code == 200:
                    print('Success:', response1.json())
                else:
                    print('Failed:', response1.status_code, response.text)
        resized_frame = cv2.resize(img, (640, 480))
        return cv2.imencode('.jpg', resized_frame)[1].tobytes(), result_licenses #frame
    except:
         print("Lỗi: " )
         return cv2.imencode('.jpg', img)[1].tobytes(), result_licenses


def car_Out_parking(img, flag):
    try:
        url = "http://localhost:8010/api/parkingTurn/createPakingTurnWithoutZoneAndPosition"
        if img is None:
            return cv2.imencode('.jpg', img)[1].tobytes()
        grayscale = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        w= None
        h = None
        x= None
        y = None
        result_licenses = ''
        
        
        # gray =  cv2.bilateralFilter(grayscale, 11,17,17)

        # edged = cv2.Canny(gray, 190, 200)
        # contours , new = cv2.findContours(edged.copy(), cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
        # contours = sorted(contours, key=cv2.contourArea, reverse=True)[:30]
        contour_license_plate = None
        license_plate = None
        w= None
        h = None
        x= None
        y = None
        numberPlates = []

        numberPlates = plateCascadeOut.detectMultiScale(grayscale, 1.1, 4)
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
                            print("ket qua la ")
                            print(license_text)
                            print(exact[0])
                            if exact[0] >= 0.85:
                                cv2.rectangle(img, (x, y), (x + w, y + h), (145, 60, 255), 5)
                                result_licenses = license_text
                                break
                            # result_licenses.append(license_text)
                except:  print("Lỗi1111: " )
        pattern = r'^\d{2}[A-Z]-\d{5}$'

        if re.match(pattern, result_licenses):
            print("Bien so xe xac dinh la ")
            print(result_licenses)
            global default_licenses_in
            global default_licenses_out
            if default_licenses_in != result_licenses and flag =="in":
                # # cout_frame = 0
                default_licenses_in = result_licenses
                print("""result_licenses""")
                _, img_encoded = cv2.imencode('.jpg', img)
                img_bytes = img_encoded.tobytes()
                data = {
                    'licenePlate': result_licenses
                }
                # Tệp tin hình ảnh

                files = {
                    'image': ('xevao.jpg', img_bytes, 'image/jpeg')
                }
                response = requests.post(url, data=data, files=files)

                # Kiểm tra kết quả trả về
                if response.status_code == 201:
                    print('Success:', response.json())
                else:
                    print('Failed:', response.status_code, response.text)
            elif default_licenses_out != result_licenses and flag =="out":
                default_licenses_out = result_licenses
                data = {
                    'licenePlate': result_licenses
                }
                response1 = requests.post("http://localhost:8010/api/parkingTurn/outPaking", json=data)

                # Kiểm tra kết quả trả về
                if response1.status_code == 200:
                    print('Success:', response1.json())
                else:
                    print('Failed:', response1.status_code, response.text)
        resized_frame = cv2.resize(img, (640, 480))
        return cv2.imencode('.jpg', resized_frame)[1].tobytes(), result_licenses #frame
    except:
         print("Lỗi: " )
         return cv2.imencode('.jpg', img)[1].tobytes(), result_licenses

def car_into_slot(img, positon, zone):
    try:
        
        if img is None:
            return cv2.imencode('.jpg', img)[1].tobytes()
        img=cv2.resize(img,(1020,600))
        results=model.predict(img)
        a=results[0].boxes.data
        px=pd.DataFrame(a).astype("float")
        list1=[]
        list2=[]
        list3=[]
        for index,row in px.iterrows():
            x1=int(row[0])
            y1=int(row[1])
            x2=int(row[2])
            y2=int(row[3])
            d=int(row[5])
            c=class_list[d]
            width = abs(x2 - x1)
            height = abs(y2 - y1)
            area = width * height
            if 'car' in c and area > 10000:
                cv2.rectangle(img,(x1,y1),(x2,y2),(0,255,0),2)
                cx=int(x1+x2)//2
                cy=int((int(y1+y2)//2) +y2) //2

                # cv2.circle(img,(cx,cy),3,(0,0,255),-1)
                results1=cv2.pointPolygonTest(np.array(area1,np.int32),((cx,cy)),False)
                if results1>=0:
                    cv2.rectangle(img,(x1,y1),(x2,y2),(0,255,0),2)
                    cv2.circle(img,(cx,cy),3,(0,0,255),-1)
                    list1.append(c)
                results2=cv2.pointPolygonTest(np.array(area2,np.int32),((cx,cy)),False)
                if results2>=0:
                    cv2.rectangle(img,(x1,y1),(x2,y2),(0,255,0),2)
                    cv2.circle(img,(cx,cy),3,(0,0,255),-1)
                    list2.append(c)
                results3=cv2.pointPolygonTest(np.array(area3,np.int32),((cx,cy)),False)
                if results3>=0:
                    cv2.rectangle(img,(x1,y1),(x2,y2),(0,255,0),2)
                    cv2.circle(img,(cx,cy),3,(0,0,255),-1)
                    list3.append(c)


        a1=(len(list1))
        a2=(len(list2))       
        a3=(len(list3)) 
        
        # print(a9)
        if a1==1:
            cv2.polylines(img,[np.array(area1,np.int32)],True,(0,0,255),2)
            cv2.putText(img,str('1'),(50,441),cv2.FONT_HERSHEY_COMPLEX,0.5,(0,0,255),1)
        else:
            cv2.polylines(img,[np.array(area1,np.int32)],True,(0,255,0),2)
            cv2.putText(img,str('1'),(50,441),cv2.FONT_HERSHEY_COMPLEX,0.5,(255,255,255),1)
        if a2==1:
            cv2.polylines(img,[np.array(area2,np.int32)],True,(0,0,255),2)
            cv2.putText(img,str('2'),(106,440),cv2.FONT_HERSHEY_COMPLEX,0.5,(0,0,255),1)
        else:
            cv2.polylines(img,[np.array(area2,np.int32)],True,(0,255,0),2)
            cv2.putText(img,str('2'),(106,440),cv2.FONT_HERSHEY_COMPLEX,0.5,(255,255,255),1)
        if a3==1:
            cv2.polylines(img,[np.array(area3,np.int32)],True,(0,0,255),2)
            cv2.putText(img,str('3'),(175,436),cv2.FONT_HERSHEY_COMPLEX,0.5,(0,0,255),1)
        else:
            cv2.polylines(img,[np.array(area3,np.int32)],True,(0,255,0),2)
            cv2.putText(img,str('3'),(106,440),cv2.FONT_HERSHEY_COMPLEX,0.5,(255,255,255),1)
        global a1_defl , a2_defl, a3_defl
        print(a1_defl)
        if a1 != a1_defl:
            a1_defl = a1
            url = ''
            if a1 == 1:
                url = "http://localhost:8010/api/parkingTurn/carInSlot"
            else:
                url = "http://localhost:8010/api/parkingTurn/carOutSlot"
            data = {
                    'zone': zone,
                    'position': positon[0]
                }
            response = requests.post(url, json=data)

            # Kiểm tra kết quả trả về
            if response.status_code == 200:
                print('Success:', response.json())
            else:
                print('Failed:', response.status_code, response.text)
        if a2 != a2_defl:
            a2_defl = a2
            url = ''
            if a2 == 1:
                url = "http://localhost:8010/api/parkingTurn/carInSlot"
            else:
                url = "http://localhost:8010/api/parkingTurn/carOutSlot"
            data = {
                    'zone': zone,
                    'position': positon[1]
                }
            response = requests.post(url, json=data)

            # Kiểm tra kết quả trả về
            if response.status_code == 200:
                print('Success:', response.json())
            else:
                print('Failed:', response.status_code, response.text)
        return cv2.imencode('.jpg', img)[1].tobytes()

    except:
         print("Lỗi: " )
         return cv2.imencode('.jpg', img)[1].tobytes()
