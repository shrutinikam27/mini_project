import cv2
import mediapipe as mp
import time

class DroneGestureController:
    def __init__(self):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            max_num_hands=1,
            min_detection_confidence=0.9,
            min_tracking_confidence=0.9
        )
        self.mp_drawing = mp.solutions.drawing_utils
        self.command = "STANDBY"
        self.last_command_time = 0
        self.command_cooldown = 1.0  # seconds

    def count_fingers(self, landmarks):
        tip_ids = [4, 8, 12, 16, 20]
        fingers = []
        
        # Thumb (different logic)
        if landmarks[tip_ids[0]].x < landmarks[tip_ids[0]-1].x:
            fingers.append(1)  # Thumb up
        else:
            fingers.append(0)  # Thumb down
        
        # Other fingers
        for id in range(1,5):
            if landmarks[tip_ids[id]].y < landmarks[tip_ids[id]-2].y:
                fingers.append(1)  # Finger open
            else:
                fingers.append(0)  # Finger closed
        
        return fingers

    def process_frame(self, frame):
        frame = cv2.flip(frame, 1)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(rgb_frame)

        # Initialize hand status
        hand_status = "No Hand Detected"
        
        if results.multi_hand_landmarks:
            hand_status = "Hand Detected"
            for hand_landmarks in results.multi_hand_landmarks:
                # Draw hand landmarks
                self.mp_drawing.draw_landmarks(
                    frame, hand_landmarks, self.mp_hands.HAND_CONNECTIONS,
                    self.mp_drawing.DrawingSpec(color=(0,255,0), thickness=2),
                    self.mp_drawing.DrawingSpec(color=(0,0,255), thickness=2))
                
                # Get finger count
                fingers = self.count_fingers(hand_landmarks.landmark)
                total_fingers = sum(fingers)
                
                # Get hand position (wrist landmark)
                wrist_y = hand_landmarks.landmark[0].y
                
                
                # Command logic with cooldown
                current_time = time.time()
                if current_time - self.last_command_time > self.command_cooldown:
                    if total_fingers == 5:  # Open palm
                        self.command = "STOP"
                    elif fingers == [1,0,0,0,0]:  # Thumb only (left)
                        self.command = "TAKEOFF"
                    elif fingers == [1,0,0,0,1]:  # Thumb + little
                        self.command = "LAND"
                    elif total_fingers == 0:  # Fist
                        self.command = "EMERGENCY STOP"
                    elif fingers == [0,1,0,0,0]:  # Index only
                        self.command = "FORWARD"
                    elif fingers == [0,1,1,0,0]:  # Index+middle
                        self.command = "BACKWARD"
                    elif fingers == [0,1,1,1,1]:  # Index+middle+ring+little
                        self.command = "LEFT"
                    elif fingers == [0,0,1,1,1]:  # Middle+ring+little
                        self.command = "RIGHT"
                    elif fingers == [0,1,0,0,1]:  # Index + little
                        self.command = "UP"
                    elif fingers == [0,0,0,0,1]:  # Little only
                        self.command = "DOWN"
                    else:
                        self.command = "STANDBY"
                        hand_status = f"Tracking: {fingers}"
                    
                    if self.command != "STANDBY":
                        self.last_command_time = current_time
                else:
                    hand_status = f"Tracking: {fingers}"

        # Display UI
        cv2.putText(frame, f"DRONE GESTURE CONTROL", (10, 30), 
                  cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
        cv2.putText(frame, f"COMMAND: {self.command}", (10, 70), 
                  cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        cv2.putText(frame, hand_status, (10, 100), 
                  cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 1)
        
        # Display gesture legend
        legend = [
            "Gestures:",
            "✋ Open palm - STOP",
            "👍 Thumb left - TAKEOFF",
            "👍+👆 Thumb+little - LAND",
            "✊ Fist - EMERGENCY STOP",
            "☝️ Index - FORWARD",
            "✌️ Index+Middle - BACKWARD",
            "🤟 Middle+ring+little - RIGHT",
            "🖐️ Index+middle+ring+little - LEFT",
            "☝️+👆 Index+little - UP",
            "👆 Little finger - DOWN"
        ]
        
        for i, text in enumerate(legend):
            cv2.putText(frame, text, (10, 110 + i*30), 
                      cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

        return frame

def main():
    controller = DroneGestureController()
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Cannot open camera")
        return

    print("Drone Gesture Control System Ready")
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        processed_frame = controller.process_frame(frame)
        cv2.imshow('Drone Gesture Control', processed_frame)
        
        if cv2.waitKey(1) == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
