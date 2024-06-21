
import cv2
import numpy as np

import matplotlib.pyplot as plt
import matplotlib.image as mpimg
from PIL import Image 
from paddleocr import PaddleOCR,draw_ocr
url =  "./unit/test11.png"
img =cv2.imread("./unit/video/test123.png")

img=cv2.resize(img,(1020,600))



area1=[(230,320),(190,420),(395,420),(405,320)]
area2=[(405,320),(395,420),(620,420),(610,320)]
area3=[(610,320),(620,420),(805,420),(775,320)]

a1=1
a2=0     
a3=1

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


# plt.imshow(edged)
plt.imshow(img)
plt.axis('off')  # Ẩn trục
plt.show()