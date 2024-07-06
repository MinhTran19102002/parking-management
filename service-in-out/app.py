from flask import Flask, render_template, request, redirect, url_for, jsonify, Response, g, json, send_file
from unit.license_plate_recognition import select_image1, car_into_parking, car_into_slot, car_Out_parking, select_image, findUrl
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
        
#         img = Image.fromarray(fileImage.astype('uint8'))

# # Tạo một đối tượng StringIO để lưu trữ dữ liệu của hình ảnh dưới dạng chuỗi
#         img_io = io.BytesIO()

# # Lưu hình ảnh vào đối tượng StringIO với định dạng PNG
#         img.save(img_io, format='PNG')

# # Mã hóa dữ liệu của hình ảnh thành chuỗi Base64
#         img_base64 = base64.b64encode(img_io.getvalue()).decode()
        
        # return render_template('index.html', result = result,fileImage =img_base64 )
        return jsonify({'message': 'File successfully uploaded', 'result': result}), 200
    return redirect(url_for('home'))

def carIn(url, flag):
    global urlCarIn
    global running
    webcam = Webcam(urlCarIn)
    while running:
        image = next(webcam.get_frame(17))
        image, licenseS = car_into_parking(image, flag)
        # yield b'Content-Type: image/jpeg\r\n\r\n' + image + b'\r\n--frame\r\n'
    carIn(url, flag)

def carOut(url, flag):
    global urlCarOut
    global urlCarIn
    global urlarInOutSlot
    global running
    webcam = Webcam(urlCarOut)
    while running:
        # print('22222')
        image = next(webcam.get_frame(17))
        image, licenseS = car_Out_parking(image, flag)
    carOut(url, flag)

def carInOutSlot(url):
    global urlarInOutSlot
    global running
    webcam = Webcam(urlarInOutSlot)
    position = ['A104', 'A105', 'A106']
    zone = 'A'
    
    while running:
        # print('3333')
        image = next(webcam.get_frame(12))
        image = car_into_slot(image, position, zone)
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


@app.route('/service/reset')
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
    urlCarIn, urlCarOut, urlarInOutSlot = findUrlAll()
    # carIn(urlCarIn, "in")
    print(urlCarIn)
    print(urlCarOut)
    print(urlarInOutSlot)
    try: 
        with concurrent.futures.ThreadPoolExecutor() as executor:
            executor.submit(carIn, urlCarIn, "in")
            executor.submit(carOut, urlCarOut, "out")
            executor.submit(carInOutSlot, urlarInOutSlot)
            app.run(host='0.0.0.0', threaded=True, port = 5000)
    except KeyboardInterrupt:
        running = False
        print("Stopping the loop.")


    # app.run(host='0.0.0.0', threaded=True, port = 5000)
    

