from flask import Flask, render_template, request, redirect, url_for, jsonify, Response, g, json, send_file
from unit.license_plate_recognition import select_image1, car_into_parking, car_into_slot, car_Out_parking
import os
import numpy as np
from PIL import Image
import base64
import io
from unit.webcam import Webcam
from flask_cors import CORS
import concurrent.futures


# from flask import Flask, render_template
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"
CORS(app)
running = True
@app.route('/service')
def home():
    return render_template('index.html', title = 'Parking Management')

def carIn(url, flag):
    # flag = 'in'
    # global urlCarIn
    # url = urlCarIn
    # print('111111111111111')
    global running
    webcam = Webcam(url)
    while running:
        image = next(webcam.get_frame(17))
        image, licenseS = car_into_parking(image, flag)
        # yield b'Content-Type: image/jpeg\r\n\r\n' + image + b'\r\n--frame\r\n'

def carOut(url, flag):
    global running
    webcam = Webcam(url)
    while running:
        # print('22222')
        image = next(webcam.get_frame(17))
        image, licenseS = car_Out_parking(image, flag)
        # yield b'Content-Type: image/jpeg\r\n\r\n' + image + b'\r\n--frame\r\n'

def carInOutSlot(url):
    global running
    webcam = Webcam(url)
    position = ['A104', 'A105', 'A106']
    zone = 'A'
    
    while running:
        # print('3333')
        image = next(webcam.get_frame(12))
        image = car_into_slot(image, position, zone)
        # g.global_var = licenseS
        # yield b'Content-Type: image/jpeg\r\n\r\n' + image + b'\r\n--frame\r\n'



# API nhap xuat xe
@app.route('/service/carIn')
def apiCarIn():
    url = "./unit/video/XeVao.mp4"
    response =  Response( carIn(url, "in"), mimetype="multipart/x-mixed-replace; boundary=frame" )
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
    

# API nhap xuat xe
@app.route('/service/carOut')
def apiCarOut():
    # url = "./unit/video/XeRa.mp4"
    url = "rtsp://localhost:8554/CAM_001"
    response =  Response( carOut(url, "out"), mimetype="multipart/x-mixed-replace; boundary=frame" )
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response




# API xe ra vao trong slot
@app.route('/service/carInOutSlot')
def apiCarInOutSlot():
    url = "./unit/video/Slot_InOut.mp4"
    response =  Response( carInOutSlot(url), mimetype="multipart/x-mixed-replace; boundary=frame" )
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response





if __name__ == '__main__':
    global urlCarOut
    global urlCarIn
    global urlarInOutSlot
    urlCarOut = "rtsp://localhost:8554/CAM_001"
    urlCarIn  = "rtsp://localhost:8554/CAM_002"
    urlarInOutSlot = "rtsp://localhost:8554/CAM_SLOT_001"
    # carIn(urlCarIn, "in")
    try: 
        with concurrent.futures.ThreadPoolExecutor() as executor:
            executor.submit(carIn, urlCarIn, "in")
            executor.submit(carOut, urlCarOut, "out")
            executor.submit(carInOutSlot, urlarInOutSlot)
            app.run(host='0.0.0.0', threaded=True, port = 5000)
    except KeyboardInterrupt:
        running = False
        print("Stopping the loop.")
    

