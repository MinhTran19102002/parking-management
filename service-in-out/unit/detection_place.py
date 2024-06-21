import cv2
from ultralytics import YOLO
import pandas as pd
import numpy as np

model=YOLO('yolov8s.pt')


area1=[(263,243),(130,396),(345,400),(395,240)]
area2=[(395,240),(345,400),(600,400),(535,240)]
area3=[(535,240),(600,400),(805,380),(680,240)]
my_file = open("./unit/coco.txt", "r")
data = my_file.read()
class_list = data.split("\n")


class dection_place():
    def __init__(self):
        url = "rtmp://103.130.211.150:10050/stream"
        self.vid = cv2.VideoCapture(url)
        

    def get_frame(self):
        area1=[(263,243),(130,396),(345,400),(395,240)]
        area2=[(395,240),(345,400),(600,400),(535,240)]
        area3=[(535,240),(600,400),(805,380),(680,240)]
        my_file = open("./unit/coco.txt", "r")
        data = my_file.read()
        class_list = data.split("\n")
        while True:    
            ret,frame = self.vid.read()
            if not ret:
                break
            frame=cv2.resize(frame,(1020,600))

            results=model.predict(frame)
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
                    cv2.rectangle(frame,(x1,y1),(x2,y2),(0,255,0),2)
                    cx=int(x1+x2)//3
                    cy=int(y1+y2)//3


                    results1=cv2.pointPolygonTest(np.array(area1,np.int32),((cx,cy)),False)
                    if results1>=0:
                        cv2.rectangle(frame,(x1,y1),(x2,y2),(0,255,0),2)
                        cv2.circle(frame,(cx,cy),3,(0,0,255),-1)
                        list1.append(c)
                    results2=cv2.pointPolygonTest(np.array(area2,np.int32),((cx,cy)),False)
                    if results2>=0:
                        cv2.rectangle(frame,(x1,y1),(x2,y2),(0,255,0),2)
                        cv2.circle(frame,(cx,cy),3,(0,0,255),-1)
                        list2.append(c)
                    results3=cv2.pointPolygonTest(np.array(area3,np.int32),((cx,cy)),False)
                    if results3>=0:
                        cv2.rectangle(frame,(x1,y1),(x2,y2),(0,255,0),2)
                        cv2.circle(frame,(cx,cy),3,(0,0,255),-1)
                        list3.append(c)


            a1=(len(list1))
            a2=(len(list2))       
            a3=(len(list3)) 
            
            # print(a9)
            if a1==1:
                cv2.polylines(frame,[np.array(area1,np.int32)],True,(0,0,255),2)
                cv2.putText(frame,str('1'),(50,441),cv2.FONT_HERSHEY_COMPLEX,0.5,(0,0,255),1)
            else:
                cv2.polylines(frame,[np.array(area1,np.int32)],True,(0,255,0),2)
                cv2.putText(frame,str('1'),(50,441),cv2.FONT_HERSHEY_COMPLEX,0.5,(255,255,255),1)
            if a2==1:
                cv2.polylines(frame,[np.array(area2,np.int32)],True,(0,0,255),2)
                cv2.putText(frame,str('2'),(106,440),cv2.FONT_HERSHEY_COMPLEX,0.5,(0,0,255),1)
            else:
                cv2.polylines(frame,[np.array(area2,np.int32)],True,(0,255,0),2)
                cv2.putText(frame,str('2'),(106,440),cv2.FONT_HERSHEY_COMPLEX,0.5,(255,255,255),1)
            if a3==1:
                cv2.polylines(frame,[np.array(area3,np.int32)],True,(0,0,255),2)
                cv2.putText(frame,str('3'),(175,436),cv2.FONT_HERSHEY_COMPLEX,0.5,(0,0,255),1)
            else:
                cv2.polylines(frame,[np.array(area3,np.int32)],True,(0,255,0),2)
                cv2.putText(frame,str('2'),(106,440),cv2.FONT_HERSHEY_COMPLEX,0.5,(255,255,255),1)
            