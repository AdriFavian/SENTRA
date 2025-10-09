import time
import cv2
import threading
from ultralytics import YOLO
import numpy as np


class HLSStreamProcessor:
    """Read HLS (.m3u8) stream via OpenCV (FFmpeg), run YOLO inference at a limited FPS,
    annotate vehicle-related detections and yield MJPEG frames for Flask streaming.

    Usage:
        proc = HLSStreamProcessor(src, model, target_fps=4)
        return Response(proc.generator(), mimetype='multipart/x-mixed-replace; boundary=frame')
    """

    def __init__(self, src, model: YOLO, target_fps: float = 4.0, camera_id: str = None, show_boxes: bool = True):
        self.src = src
        self.model = model
        self.target_fps = float(target_fps) if target_fps > 0 else 4.0
        self.camera_id = camera_id
        self.show_boxes = show_boxes
        self._stop_event = threading.Event()
        # Include all relevant classes: accidents, vehicles, and persons
        self._interesting_substrings = (
            'benturan', 'crash', 'roda-2', 'roda-4', 'kendaraan-besar', 
            'mobil', 'manusia', 'car', 'truck', 'bus', 'motor', 
            'bicycle', 'bike', 'vehicle', 'person', 'accident', 'fatal', 'moderate')

    def stop(self):
        self._stop_event.set()

    def _is_interesting(self, class_name: str) -> bool:
        """Check if class should be displayed - show all detected classes"""
        if not class_name:
            return False
        # Show all classes detected by the model
        return True
    
    def _get_box_color(self, confidence: float) -> tuple:
        """Return BGR color based on confidence: green (high), orange (medium), red (low)"""
        if confidence >= 0.8:
            return (0, 255, 0)  # Green
        elif confidence >= 0.5:
            return (0, 165, 255)  # Orange
        else:
            return (0, 0, 255)  # Red

    def generator(self):
        """Yield MJPEG frames annotated with bounding boxes. Handles reconnects."""
        last_infer_time = 0.0
        min_interval = 1.0 / self.target_fps

        # Attempt to open the stream (supports http(s)://...m3u8 as long as OpenCV was built with FFmpeg)
        cap = None
        while not self._stop_event.is_set():
            try:
                if cap is None or not cap.isOpened():
                    cap = cv2.VideoCapture(self.src)
                    # small warm-up
                    time.sleep(0.1)

                success, frame = cap.read()
                if not success or frame is None:
                    # Failed to read frame: try reconnect after short delay
                    time.sleep(0.5)
                    # Recreate capture to handle live stream rolling
                    try:
                        cap.release()
                    except Exception:
                        pass
                    cap = None
                    continue

                now = time.time()
                do_infer = (now - last_infer_time) >= min_interval

                annotated = frame

                if do_infer:
                    last_infer_time = now
                    # Run model inference once per target interval
                    # Use small image size for speed; caller can change if desired
                    try:
                        results = self.model.predict(frame, imgsz=640, conf=0.25, verbose=False)
                    except Exception:
                        # If inference fails, skip this frame and continue reading
                        results = None

                    if results and len(results) > 0:
                        r = results[0]
                        # Draw all detections with confidence-based colors
                        if self.show_boxes and hasattr(r, 'boxes') and len(r.boxes) > 0:
                            annotated = frame.copy()
                            for i, box in enumerate(r.boxes.xyxy):
                                try:
                                    cls_id = int(r.boxes.cls[i])
                                except Exception:
                                    # fallback if indexing shape differs
                                    cls_id = int(r.boxes.cls) if hasattr(r.boxes, 'cls') else None

                                conf = float(r.boxes.conf[i]) if hasattr(r.boxes, 'conf') and len(r.boxes.conf) > i else 0.0
                                name = self.model.names[cls_id] if (cls_id is not None and cls_id in self.model.names) else str(cls_id)

                                if not self._is_interesting(name):
                                    continue

                                x1, y1, x2, y2 = map(int, box)
                                
                                # Get color based on confidence
                                color = self._get_box_color(conf)
                                
                                # Draw bounding box
                                cv2.rectangle(annotated, (x1, y1), (x2, y2), color, 2)
                                
                                # Draw label with confidence percentage
                                label = f"{name} {conf*100:.1f}%"
                                t_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)[0]
                                
                                # Draw label background
                                cv2.rectangle(annotated, (x1, y1 - t_size[1] - 8), (x1 + t_size[0] + 8, y1), color, -1)
                                
                                # Draw label text
                                cv2.putText(annotated, label, (x1 + 4, y1 - 4), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

                # Encode annotated frame as JPEG
                ret, jpeg = cv2.imencode('.jpg', annotated)
                if not ret:
                    # failed to encode, continue
                    continue

                frame_bytes = jpeg.tobytes()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

                # Small sleep to be cooperative; actual inference throttling is done by min_interval
                time.sleep(0.01)

            except GeneratorExit:
                break
            except Exception:
                # On unexpected error try to re-establish capture
                try:
                    if cap is not None:
                        cap.release()
                except Exception:
                    pass
                cap = None
                time.sleep(1.0)
                continue

        try:
            if cap is not None:
                cap.release()
        except Exception:
            pass
