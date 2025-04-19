import cv2
import numpy as np
import time
from datetime import datetime
import pandas as pd
import pygame
import os
from face_detector import FaceDetector
from landmark_detector import FacialLandmarkDetector
from drowsiness_detector import DrowsinessDetector
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

class DrowsinessDetectionSystem:
    def __init__(self):
        """Initialize the drowsiness detection system"""
        # Initialize detectors
        print("Loading models...")
        self.face_detector = FaceDetector()
        self.landmark_detector = FacialLandmarkDetector()
        self.drowsiness_detector = DrowsinessDetector()
        
        # Initialize alert system
        pygame.mixer.init()
        if os.path.exists('assets/alarm.wav'):
            self.alarm_sound = pygame.mixer.Sound('assets/alarm.wav')
        else:
            print("Warning: alarm.wav not found in assets folder")
            self.alarm_sound = None
        
        # Initialize data collection
        self.ear_data = []
        self.mar_data = []
        self.head_tilt_data = []
        self.head_elevation_data = []
        self.drowsy_data = []
        self.timestamps = []
        
        # Initialize metrics
        self.true_labels = []
        self.predicted_labels = []
        
    def draw_landmarks(self, frame, landmarks):
        """Draw facial landmarks on frame"""
        for landmark_set in ['left_eye', 'right_eye', 'mouth', 'nose', 'left_ear', 'right_ear']:
            points = landmarks[landmark_set]
            for point in points:
                cv2.circle(frame, tuple(point), 2, (0, 255, 0), -1)
    
    def calculate_metrics(self):
        """Calculate model performance metrics"""
        accuracy = accuracy_score(self.true_labels, self.predicted_labels)
        precision = precision_score(self.true_labels, self.predicted_labels, average='binary')
        recall = recall_score(self.true_labels, self.predicted_labels, average='binary')
        f1 = f1_score(self.true_labels, self.predicted_labels, average='binary')
        
        return accuracy, precision, recall, f1
    
    def start_detection(self):
        """Start the drowsiness detection system"""
        print("Starting video capture...")
        cap = cv2.VideoCapture(0)
        
        if not cap.isOpened():
            print("Error: Could not open video capture")
            return
        
        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    print("Error: Could not read frame")
                    break
                
                # Detect faces
                faces = self.face_detector.detect_faces(frame)
                
                for face in faces:
                    # Get face ROI
                    x1, y1, x2, y2 = face['bbox']
                    face_roi = frame[y1:y2, x1:x2]
                    
                    # Detect facial landmarks
                    landmarks = self.landmark_detector.detect_landmarks(face_roi)
                    
                    if landmarks:
                        # Detect drowsiness
                        is_drowsy, ear, mar, head_tilt, head_elevation = self.drowsiness_detector.detect_drowsiness(landmarks[0])
                        
                        # Collect data
                        self.ear_data.append(ear)
                        self.mar_data.append(mar)
                        self.head_tilt_data.append(head_tilt)
                        self.head_elevation_data.append(head_elevation)
                        self.drowsy_data.append(1 if is_drowsy else 0)
                        self.timestamps.append(datetime.now().strftime('%H:%M:%S.%f'))
                        
                        # Update metrics (assuming ground truth is available)
                        # For demonstration, we'll use a simple threshold on EAR as ground truth
                        true_label = 1 if ear < 0.2 else 0
                        self.true_labels.append(true_label)
                        self.predicted_labels.append(1 if is_drowsy else 0)
                        
                        # Draw landmarks
                        self.draw_landmarks(frame, landmarks[0])
                        
                        # Draw face rectangle
                        color = (0, 0, 255) if is_drowsy else (0, 255, 0)
                        cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                        
                        # Display metrics
                        cv2.putText(frame, f"EAR: {ear:.2f}", (10, 30),
                                  cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                        cv2.putText(frame, f"MAR: {mar:.2f}", (10, 60),
                                  cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                        cv2.putText(frame, f"Head Tilt: {head_tilt:.2f}", (10, 90),
                                  cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                        cv2.putText(frame, f"Head Elevation: {head_elevation:.2f}", (10, 120),
                                  cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                        
                        # Alert if drowsy
                        if is_drowsy:
                            cv2.putText(frame, "DROWSINESS ALERT!", (10, 150),
                                      cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                            if self.alarm_sound:
                                self.alarm_sound.play()
                
                # Display frame
                cv2.imshow("Driver Drowsiness Detection", frame)
                
                # Break loop on 'q' press
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
                    
        except Exception as e:
            print(f"Error during detection: {e}")
        finally:
            cap.release()
            cv2.destroyAllWindows()
            
            # Calculate and display metrics
            accuracy, precision, recall, f1 = self.calculate_metrics()
            print(f"Model Accuracy: {accuracy:.2f}")
            print(f"Model Precision: {precision:.2f}")
            print(f"Model Recall: {recall:.2f}")
            print(f"Model F1-Score: {f1:.2f}")
            
            # Save collected data
            self.save_data()
    
    def save_data(self):
        """Save collected data to CSV"""
        try:
            df = pd.DataFrame({
                'Timestamp': self.timestamps,
                'EAR': self.ear_data,
                'MAR': self.mar_data,
                'Head_Tilt': self.head_tilt_data,
                'Head_Elevation': self.head_elevation_data,
                'Is_Drowsy': self.drowsy_data
            })
            df.to_csv('drowsiness_data.csv', index=False)
            print("Data saved to drowsiness_data.csv")
        except Exception as e:
            print(f"Error saving data: {e}")

if __name__ == "__main__":
    system = DrowsinessDetectionSystem()
    system.start_detection()
