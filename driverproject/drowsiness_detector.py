import numpy as np
from scipy.spatial import distance
import time

class DrowsinessDetector:
    def __init__(self, 
                 ear_threshold=0.25, 
                 mar_threshold=0.35, 
                 head_tilt_threshold=20,
                 consecutive_frames=20,
                 drowsy_time=1.0):
        """Initialize drowsiness detector with thresholds"""
        self.ear_threshold = ear_threshold
        self.mar_threshold = mar_threshold
        self.head_tilt_threshold = head_tilt_threshold
        self.consecutive_frames = consecutive_frames
        self.drowsy_time = drowsy_time
        
        self.frame_counter = 0
        self.drowsy_start = None
        
    def calculate_ear(self, eye_points):
        """Calculate Eye Aspect Ratio"""
        try:
            # Vertical distances
            A = distance.euclidean(eye_points[1], eye_points[5])
            B = distance.euclidean(eye_points[2], eye_points[4])
            # Horizontal distance
            C = distance.euclidean(eye_points[0], eye_points[3])
            
            # Calculate EAR
            ear = (A + B) / (2.0 * C)
            return ear
        except Exception as e:
            print(f"Error calculating EAR: {e}")
            return 0.0
        
    def calculate_mar(self, mouth_points):
        """Calculate Mouth Aspect Ratio"""
        try:
            # Vertical distances
            A = distance.euclidean(mouth_points[1], mouth_points[7])
            B = distance.euclidean(mouth_points[3], mouth_points[5])
            # Horizontal distance
            C = distance.euclidean(mouth_points[0], mouth_points[4])
            
            # Calculate MAR
            mar = (A + B) / (2.0 * C)
            return mar
        except Exception as e:
            print(f"Error calculating MAR: {e}")
            return 0.0
        
    def calculate_head_pose(self, nose, left_ear, right_ear):
        """Calculate head pose (tilt and elevation)"""
        try:
            # Calculate head tilt
            dx = right_ear[0][0] - left_ear[0][0]
            dy = right_ear[0][1] - left_ear[0][1]
            angle = np.degrees(np.arctan2(dy, dx))
            
            # Calculate head elevation
            ear_center = ((left_ear[0][0] + right_ear[0][0]) // 2, (left_ear[0][1] + right_ear[0][1]) // 2)
            elevation = nose[0][1] - ear_center[1]
            
            return angle, elevation
        except Exception as e:
            print(f"Error calculating head pose: {e}")
            return 0, 0
        
    def detect_drowsiness(self, landmarks):
        """Detect drowsiness based on facial landmarks"""
        if not landmarks:
            return False, 0, 0, 0, 0
        
        try:
            # Calculate average EAR
            left_ear = self.calculate_ear(landmarks['left_eye'])
            right_ear = self.calculate_ear(landmarks['right_eye'])
            ear = (left_ear + right_ear) / 2.0
            
            # Calculate MAR
            mar = self.calculate_mar(landmarks['mouth'])
            
            # Calculate head pose
            head_tilt, head_elevation = self.calculate_head_pose(
                landmarks['nose'], landmarks['left_ear'], landmarks['right_ear'])
            
            # Check for drowsiness
            if ear < self.ear_threshold or abs(head_tilt) > self.head_tilt_threshold:
                self.frame_counter += 1
                if self.drowsy_start is None:
                    self.drowsy_start = time.time()
            else:
                self.frame_counter = 0
                self.drowsy_start = None
            
            # Detect drowsiness if eyes are closed or head is tilted for sufficient frames
            is_drowsy = False
            if self.drowsy_start and (time.time() - self.drowsy_start) > self.drowsy_time:
                is_drowsy = True
            
            return is_drowsy, ear, mar, head_tilt, head_elevation
            
        except Exception as e:
            print(f"Error in drowsiness detection: {e}")
            return False, 0, 0, 0, 0