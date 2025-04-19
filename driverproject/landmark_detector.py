import cv2
import numpy as np
import mediapipe as mp

class FacialLandmarkDetector:
    def __init__(self):
        """Initialize MediaPipe face mesh"""
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # Define landmark indices
        self.LEFT_EYE = [33, 160, 158, 133, 153, 144]
        self.RIGHT_EYE = [362, 385, 387, 263, 373, 380]
        self.MOUTH = [61, 291, 39, 181, 0, 17, 269, 405]
        self.NOSE = [1]
        self.LEFT_EAR = [234]
        self.RIGHT_EAR = [454]
        
    def detect_landmarks(self, frame):
        """
        Detect facial landmarks in frame
        Returns: Dictionary containing eye, mouth, and head pose landmarks
        """
        try:
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.face_mesh.process(frame_rgb)
            
            landmarks = []
            if results.multi_face_landmarks:
                for face_landmarks in results.multi_face_landmarks:
                    # Get image dimensions
                    h, w, _ = frame.shape
                    
                    # Extract landmarks
                    left_eye = self._get_landmarks(face_landmarks, self.LEFT_EYE, w, h)
                    right_eye = self._get_landmarks(face_landmarks, self.RIGHT_EYE, w, h)
                    mouth = self._get_landmarks(face_landmarks, self.MOUTH, w, h)
                    nose = self._get_landmarks(face_landmarks, self.NOSE, w, h)
                    left_ear = self._get_landmarks(face_landmarks, self.LEFT_EAR, w, h)
                    right_ear = self._get_landmarks(face_landmarks, self.RIGHT_EAR, w, h)
                    
                    landmarks.append({
                        'left_eye': left_eye,
                        'right_eye': right_eye,
                        'mouth': mouth,
                        'nose': nose,
                        'left_ear': left_ear,
                        'right_ear': right_ear
                    })
            
            return landmarks
        except Exception as e:
            print(f"Error in landmark detection: {e}")
            return []
    
    def _get_landmarks(self, face_landmarks, indices, width, height):
        """Helper function to extract landmarks"""
        points = []
        for idx in indices:
            point = face_landmarks.landmark[idx]
            points.append([
                int(point.x * width),
                int(point.y * height)
            ])
        return np.array(points)