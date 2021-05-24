
from flask import Flask, request, jsonify
from flask_ngrok import run_with_ngrok
import matplotlib.pyplot as plt
import numpy as np
import base64
import cv2
import time

def cartoonify(file):
    img = cv2.imread(file)

    # Get the edges
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.medianBlur(gray, 5)
    edges = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C,
                                  cv2.THRESH_BINARY, 7, 7)

    color = cv2.bilateralFilter(img, 7, 300, 300)

    cartoon = cv2.bitwise_and(color, color, mask=edges)

    return cartoon

app = Flask(__name__)


@app.route("/", methods=['POST'])
def cartoonifier():
    output = None
    data = request.get_json()
    # print(data)
    decoded = base64.decodebytes(bytes(data['imageBase64'], 'ascii'))
    nparr = np.frombuffer(decoded, np.uint8)
    img_np = cv2.imdecode(nparr, cv2.IMREAD_ANYCOLOR)
    cv2.imwrite('test.jpg', img_np)

    
    try:
        outimage = Image.fromarray(cartoonify('/content/test.jpg'))
        outimage.save('output.png')
        time.sleep(1) 
        with open('output.png', 'rb') as f:
            im_b64 = base64.b64encode(f.read())
            
        return im_b64
    except Exception as e:
        print(e)
        return jsonify({'status': 'failure'})

app.run()