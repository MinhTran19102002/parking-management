from flask import Flask, render_template, request, redirect, url_for, jsonify, Response, g, json, send_file
from unit.license_plate_recognition import select_image1, car_into_parking, car_into_slot, car_Out_parking
import os
import numpy as np
from PIL import Image
import base64
import io
from unit.webcam import Webcam
from flask_cors import CORS


# from flask import Flask, render_template
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"
CORS(app)
@app.route('/service')
def home():
    return render_template('index.html', title = 'Parking Management')

def carIn(url, flag):
    webcam = Webcam(url)
    while True:
        image = next(webcam.get_frame(17))
        image, licenseS = car_into_parking(image, flag)
        global global_licenseS
        global image_license
        global_licenseS = licenseS
        image_license = image
        # g.global_var = licenseS
        yield b'Content-Type: image/jpeg\r\n\r\n' + image + b'\r\n--frame\r\n'

def carOut(url, flag):
    webcam = Webcam(url)
    while True:
        image = next(webcam.get_frame(17))
        image, licenseS = car_Out_parking(image, flag)
        global global_licenseS
        global image_license
        global_licenseS = licenseS
        image_license = image
        # g.global_var = licenseS
        yield b'Content-Type: image/jpeg\r\n\r\n' + image + b'\r\n--frame\r\n'

def carInOutSlot(url):
    webcam = Webcam(url)
    position = ['A104', 'A105', 'A106']
    zone = 'A'
    
    while True:
        image = next(webcam.get_frame(12))
        image = car_into_slot(image, position, zone)
        # g.global_var = licenseS
        yield b'Content-Type: image/jpeg\r\n\r\n' + image + b'\r\n--frame\r\n'



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
    app.run(host='0.0.0.0', port = 5000)
    global global_licenseS
    global image_license
    global_licenseS = []
    image_license = None

