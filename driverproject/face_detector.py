import cv2
import torch
from ultralytics import YOLO

class FaceDetector:
    def __init__(self, model_path='yolov8n-face.pt'):
        """Initialize YOLO face detector"""
        try:
            self.model = YOLO(model_path)
        except Exception as e:
            print(f"Error loading YOLO model: {e}")
            raise
        
    def detect_faces(self, frame):
        """
        Detect faces in frame
        Returns: List of face bounding boxes
        """
        try:
            results = self.model(frame, conf=0.5)  # Run inference
            faces = []
            
            if results[0].boxes:
                for box in results[0].boxes:
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                    confidence = box.conf[0].cpu().numpy()
                    faces.append({
                        'bbox': [int(x1), int(y1), int(x2), int(y2)],
                        'confidence': float(confidence)
                    })
            
            return faces
        except Exception as e:
            print(f"Error in face detection: {e}")
            return []