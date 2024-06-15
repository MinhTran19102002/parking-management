from flask import Flask, render_template, request, redirect, url_for, jsonify, Response, g, json, send_file
from unit.license_plate_recognition import select_image1, car_into_parking, car_into_slot
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

def read_from_webcam():
    webcam = Webcam()
    while True:
        image = next(webcam.get_frame())
        image, licenseS = select_image1(image)
        global global_licenseS
        global image_license
        global_licenseS = licenseS
        image_license = image
        # g.global_var = licenseS
        yield b'Content-Type: image/jpeg\r\n\r\n' + image + b'\r\n--frame\r\n'
        
@app.route("/service/image_feed")
def image_feed():
    response =  Response( read_from_webcam(), mimetype="multipart/x-mixed-replace; boundary=frame" )
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

@app.route("/service/image_feed1")
def image_feed1():
    response =  Response( read_from_webcam(), mimetype="multipart/x-mixed-replace; boundary=frame" )
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

@app.route('/service/licenseS')
def licenseSFunc():
    global global_licenseS
    response_data = json.dumps({'message': 'File successfully uploaded', 'result': global_licenseS})
    
    # Create a Response object
    response = Response(response=response_data, status=200, mimetype='application/json')
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

def carInOut(url):
    webcam = Webcam(url)
    while True:
        image = next(webcam.get_frame(8))
        image, licenseS = car_into_parking(image)
        global global_licenseS
        global image_license
        global_licenseS = licenseS
        image_license = image
        # g.global_var = licenseS
        yield b'Content-Type: image/jpeg\r\n\r\n' + image + b'\r\n--frame\r\n'



# API nhap xuat xe
@app.route('/service/carInOut')
def apiCarInOut():
    # url = "./unit/dectect1.mp4"
    url = "./unit/CAM_ngoai_full.mp4"
    response =  Response( carInOut(url), mimetype="multipart/x-mixed-replace; boundary=frame" )
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response


def carInOutSlot(url):
    webcam = Webcam(url)
    position = ['A101', 'A102', 'A103']
    zone = 'A'
    
    while True:
        image = next(webcam.get_frame(22))
        image = car_into_slot(image, position, zone)
        # g.global_var = licenseS
        yield b'Content-Type: image/jpeg\r\n\r\n' + image + b'\r\n--frame\r\n'

# API xe ra vao trong slot
@app.route('/service/carInOutSlot')
def apiCarInOutSlot():
    url = "./unit/CAM_trong_full.mp4"
    # url = 0
    response =  Response( carInOutSlot(url), mimetype="multipart/x-mixed-replace; boundary=frame" )
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response



if __name__ == '__main__':
    app.run(host='0.0.0.0', port = 5000)
    global global_licenseS
    global image_license
    global_licenseS = []
    image_license = None

