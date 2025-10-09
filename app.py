import datetime
import cv2
import threading
from datetime import datetime
from flask import Flask, render_template, Response, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import os
import time
import requests
import json
import socketio

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Socket.IO client to connect to Node.js server
sio = socketio.Client()

try:
    sio.connect('http://localhost:4001')
    print('✅ Connected to Socket.IO server')
except Exception as e:
    print(f'❌ Failed to connect to Socket.IO server: {e}')

# make a folder named snapshot to save the snap while the accident is detected
snapshot_dir = "public/snapshots"
os.makedirs(snapshot_dir, exist_ok=True)

frame_count = 0  # Initialize frame_count outside of any function

model = YOLO("test5.pt")

frame_skip = 5

# YOLO class names - actual classes from your model
classnames = ["benturan", "crash", "kendaraan-besar", "manusia", "mobil-mainan", "roda-2", "roda-4"]

# Accident-related classes
ACCIDENT_CLASSES = ["benturan", "crash", "moderate-accident", "fatal-accident"]

# Store active streams
active_streams = {}

#this function sends http post request to the server
def send_accident_data_to_server(accident_data, headers=None):
    # Define the API endpoint
    api_endpoint = "http://localhost:3000/api/accidents"

    #Convert the data to JSON
    json_payload = json.dumps(accident_data)

    # Send the POST request to the server with the JSON payload
    headers = {'Content-Type': 'application/json'}

    response = requests.post(api_endpoint, data=json_payload, headers=headers)

    # Check the server's response
    if response.status_code == 201:
        print("✅ Accident data sent successfully to API!")
        
        # Also emit to Socket.IO for real-time updates
        try:
            sio.emit('send-message', response.json())
            print("✅ Accident alert sent via Socket.IO!")
        except Exception as e:
            print(f"❌ Failed to emit Socket.IO event: {e}")
        
        return True
    else:
        print(f"❌ Data upload failed. Status: {response.status_code}")
        return False


def annotate_frame(frame, custom_text, show_boxes=True):
    now = datetime.now()
    current_time = now.strftime("%Y-%m-%d %H:%M:%S")

    font = cv2.FONT_HERSHEY_SIMPLEX
    cv2.putText(frame, current_time, (10, 30), font, 1, (0, 0, 255), 2, cv2.LINE_AA)
    cv2.putText(frame, custom_text, (10, 60), font, 1, (0, 255, 0), 2, cv2.LINE_AA)

    if show_boxes:
        results = model.predict(frame)
        annotated_frame = results[0].plot()
        return annotated_frame, results
    
    return frame, None


def generate_frames(video_path, custom_text, camera_id=None, show_boxes=True):
    global frame_count
    cap = cv2.VideoCapture(video_path)
    frame_count = 0
    snapshot_taken = False
    last_detection_time = 0
    detection_cooldown = 10  # seconds between detections

    while True:
        success, frame = cap.read()

        if not success:
            # Loop video for continuous playback
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            snapshot_taken = False
            continue

        frame_count += 1

        if frame_count % frame_skip == 0:
            current_time = time.time()
            
            # Detect accidents
            results = model.predict(frame)
            accident_detected = False
            detected_class = None
            max_confidence = 0
            
            for r in results:
                for idx, c in enumerate(r.boxes.cls):
                    class_name = model.names[int(c)]
                    confidence = float(r.boxes.conf[idx]) if len(r.boxes.conf) > idx else 0.0

                    # Check if accident class detected
                    if any(accident_class in class_name.lower() for accident_class in ['moderate-accident', 'fatal-accident', 'crash', 'benturan']):
                        accident_detected = True
                        if confidence > max_confidence:
                            max_confidence = confidence
                            detected_class = class_name

            # Process accident detection
            if accident_detected and not snapshot_taken and (current_time - last_detection_time > detection_cooldown):
                print(f"🚨 Accident Detected: {detected_class} with confidence {max_confidence:.2f}")
               
                # Determine severity based on detected class
                if "fatal-accident" in detected_class.lower():
                    severity = "Fatal"
                elif "moderate-accident" in detected_class.lower() or "crash" in detected_class.lower():
                    severity = "Serious"
                else:
                    severity = "Normal"
               
                # Generate unique ID
                timestamp_with_microseconds = datetime.now().timestamp()
                microseconds = int((timestamp_with_microseconds % 1) * 1e6)
                unique_number = int(timestamp_with_microseconds * 1e6) + microseconds
               
                # Take snapshot
                snapshot_filename = os.path.join(snapshot_dir, f"snapshot_{unique_number}.jpg")
                cv2.imwrite(snapshot_filename, frame)
                snapshot_taken = True
                last_detection_time = current_time

                # Prepare IP address
                ipaddress = f"http://127.0.0.1:49/{custom_text}"
               
                accident_data = {
                    "photos": f"snapshots/snapshot_{unique_number}.jpg",
                    "ipAddress": ipaddress,
                    "severity": severity,
                    "description": f"Accident detected: {detected_class}",
                    "confidence": float(max_confidence)
                }
               
                print(f"📤 Sending accident data: {accident_data}")
               
                # Send to server (which will also emit Socket.IO event)
                send_accident_data_to_server(accident_data)

            # Annotate frame with boxes if enabled
            if show_boxes:
                annotated_frame = results[0].plot()
            else:
                annotated_frame = frame

            _, buffer = cv2.imencode('.jpg', annotated_frame)
            frame_bytes = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    cap.release()


# API endpoint to get available streams
@app.route('/api/streams')
def get_streams():
    return jsonify({
        'streams': [
            {'id': '1', 'name': 'Test Di Poltek', 'path': '/1'},
            {'id': '2', 'name': 'Koteshore', 'path': '/2'},
            {'id': 'test', 'name': 'Ahmad Yani', 'path': '/test'},
        ]
    })


# API endpoint to check server status
@app.route('/api/status')
def status():
    return jsonify({
        'status': 'online',
        'model': 'YOLOv8',
        'socket_connected': sio.connected,
        'active_streams': len(active_streams)
    })


@app.route('/')
def index():
    return render_template('index.html')


# hosting the video in the different path and passing the video link to the path.
@app.route('/1')
def video1():
    video_path = "video/mainan1.mp4"  
    custom_text = "Test Di poltek"
    return Response(generate_frames(video_path, custom_text, camera_id='1', show_boxes=True), 
                   mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/2')
def video2():
    video_path = "video/koteshore.mp4"  
    custom_text = "Koteshore"
    return Response(generate_frames(video_path, custom_text, camera_id='2', show_boxes=True), 
                   mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/test')
def video3():
    video_path = "video/ahmad_yani.mp4"  
    custom_text = "Ahmad Yani"
    return Response(generate_frames(video_path, custom_text, camera_id='test', show_boxes=True), 
                   mimetype='multipart/x-mixed-replace; boundary=frame')


# Generic stream endpoint with camera ID
@app.route('/stream/<camera_id>')
def stream(camera_id):
    # In production, you would map camera_id to actual video sources
    video_path = "video/mainan1.mp4"  # Default
    custom_text = f"Camera {camera_id}"
    return Response(generate_frames(video_path, custom_text, camera_id=camera_id, show_boxes=True), 
                   mimetype='multipart/x-mixed-replace; boundary=frame')


# Cleanup on shutdown
@app.teardown_appcontext
def cleanup(exception=None):
    if sio.connected:
        sio.disconnect()


# hosting the entire file in the port 5000 (changed from 49)
if __name__ == '__main__':
    print("🚀 Starting Flask AI Backend...")
    print("📹 YOLO Model loaded: test5.pt")
    print("🔌 Connecting to Socket.IO on port 4001...")
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
