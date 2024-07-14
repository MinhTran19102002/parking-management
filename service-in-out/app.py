from flask import Flask, render_template, request, redirect, url_for, jsonify, Response, g, json, send_file
from unit.license_plate_recognition import select_image1, car_into_parking, car_into_slot, car_Out_parking, select_image, findUrl, car_into_parkingUpdate, car_Out_parkingUpdate
import os
import numpy as np
from PIL import Image
import base64
import io
from unit.webcam import Webcam
from flask_cors import CORS
import concurrent.futures
import requests


# from flask import Flask, render_template
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"
CORS(app)
@app.route('/service')
def home():
    return render_template('index.html', title = 'Parking Management')



@app.route('/uploads', methods=['POST'])
def image():
    if 'file' not in request.files:
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        return redirect(request.url)
    if file:
        
        # Gọi hàm xử lý ảnh
        result, fileImage = select_image(file)
    
        return jsonify({'message': 'File successfully uploaded', 'result': result}), 200
    return redirect(url_for('home'))


def check_webcam(cap):
    if not cap.isOpened():
        return False
    return True

def carIn(url, flag):
    global urlCarIn
    global running
    test =True
    webcam = Webcam(urlCarIn)
    while running:
        print("carIn")
        if webcam == None:
            continue  
        image = next(webcam.get_frame(17))
        image, licenseS = car_into_parkingUpdate(image, flag)
        yield b'Content-Type: image/jpeg\r\n\r\n' + image + b'\r\n--frame\r\n'
    carIn(url, flag)

def carOut(url, flag):
    global urlCarOut
    global urlCarIn
    global urlarInOutSlot
    global running
    test = True
    webcam = Webcam(urlCarOut)
    # if check_webcam(webcam):
    #     test =True
    # else:
    #     test =False
    while running:
        print("carOut")
        if webcam == None:
            continue 
        image = next(webcam.get_frame(17))
        image, licenseS = car_Out_parkingUpdate(image, flag)
        yield b'Content-Type: image/jpeg\r\n\r\n' + image + b'\r\n--frame\r\n'
    carOut(urlCarOut, flag)

def carInOutSlot(url):
    global urlarInOutSlot
    global running
    webcam = Webcam(urlarInOutSlot)
    test = True
    # if check_webcam(webcam):
    #     test =True
    # else:
    #     test =False
    position = ['A601', 'A602', 'A603']
    zone = 'A'
    
    while running:
        print("carInOutSlot")
        if webcam == None:

            continue  
        image = next(webcam.get_frame(12))
        image = car_into_slot(image, position, zone)
        yield b'Content-Type: image/jpeg\r\n\r\n' + image + b'\r\n--frame\r\n'
    carInOutSlot(urlarInOutSlot)



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

def findUrlAll():
    urlCarIn = findUrl("cameraIn")
    urlCarOut = findUrl("cameraOut")
    urlarInOutSlot = findUrl("cameraSlot")
    return urlCarIn, urlCarOut, urlarInOutSlot


@app.route('/service/reset', methods=['POST'])
def reset():
    global urlCarOut
    global urlCarIn
    global urlarInOutSlot
    global running
    running = False
    urlCarIn, urlCarOut, urlarInOutSlot = findUrlAll()
    running = True
    return jsonify({'message': 'success'}), 200


if __name__ == '__main__':
    global urlCarOut
    global urlCarIn
    global urlarInOutSlot
    global running
    running = True
    # urlCarOut = "rtsp://localhost:8554/CAM_001"
    # urlCarIn  = "rtsp://localhost:8554/CAM_002"
    # urlarInOutSlot = "rtsp://localhost:8554/CAM_SLOT_001"


    urlCarOut = ""
    urlCarIn  = ""
    urlarInOutSlot = ""
    while urlCarIn == "":
        urlCarIn, urlCarOut, urlarInOutSlot = findUrlAll()
        print(urlCarIn)
        print(urlCarOut)
        print(urlarInOutSlot)
    # urlCarOut = "./unit/video/XeRa.mp4"
    # urlCarIn  = "./unit/video/XeVao.mp4"
    # urlarInOutSlot = "./unit/video/Slot_InOut.mp4"

     # urlCarOut = "rtsp://103.130.211.150:10050/CAM_001"
    # urlCarIn  = "rtsp://103.130.211.150:10050/CAM_002"
    # urlarInOutSlot = "rtsp://103.130.211.150:10050/CAM_SLOT_001"
    
    urlCarOut = "rtsp://localhost:8554/CAM_001"
    urlCarIn  = "rtsp://localhost:8554/CAM_002"
    urlarInOutSlot = "rtsp://localhost:8554/CAM_SLOT_001"
    # try: 
    #     with concurrent.futures.ThreadPoolExecutor() as executor:
    #         executor.submit(carIn, urlCarIn, "in")
    #         executor.submit(carOut, urlCarOut, "out")
    #         executor.submit(carInOutSlot, urlarInOutSlot)
    #         app.run(host='0.0.0.0', threaded=True, port = 5000)
    # except KeyboardInterrupt:
    #     running = False
    #     print("Stopping the loop.")


    app.run(host='0.0.0.0', threaded=True, port = 5000)
    

