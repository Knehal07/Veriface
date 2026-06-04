<<<<<<< HEAD
# Veriface

Veriface is a lightweight offline biometric authentication system built with React Native. It performs local face registration, face login, presence verification, GPS-based attendance, secure proof generation, and encrypted local storage without requiring internet access.

---

## 1. Project Objective

The objective of Veriface is to provide a secure, lightweight, offline facial authentication system suitable for remote or low-connectivity environments.

The system is designed to:

- Authenticate users using offline face recognition
- Verify physical presence using lightweight liveness checks
- Store biometric embeddings securely on-device
- Mark attendance with GPS location
- Generate tamper-aware local proof using SHA-256 hashing
- Run efficiently on midrange devices without high-end GPU requirements

---

## 2. Key Features

### Face Registration

- Captures user face using the front camera
- Detects face using a lightweight BlazeFace / MediaPipe face detector
- Crops and resizes face to MobileFaceNet input size
- Generates a face embedding using MobileFaceNet
- Stores the embedding securely using encrypted local storage

### Face Login

- Captures current face
- Generates current face embedding
- Compares with stored embedding using cosine similarity
- Allows login only when the match score crosses the threshold

### Presence Verification

- Performs lightweight anti-spoof verification before login
- Supports head-turn based challenge-response verification
- Designed to prevent basic photo or screen replay spoofing

### GPS Attendance

- Marks secure attendance only after authentication
- Stores timestamp, latitude, longitude, GPS accuracy, and map link
- Works offline using local storage

### Secure Local Proof

- Generates local proof code
- Includes match score, timestamp, GPS location, and presence verification result
- Generates SHA-256 hash for tamper detection
- Supports QR-based proof display
- Supports export as JSON or certificate text file

### Encrypted Storage

Sensitive biometric data is stored using secure device storage.

Encrypted items include:

- Registered face embedding
- Last match score
- Last presence verification result
- Secure proof data

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Model Footprint

The application uses a lightweight offline ML pipeline optimized for mobile devices.

|       Model          |            Purpose                 |   Size   |
|----------------------|------------------------------------|----------|
| blazeface.tflite     | Face detection                     | ~0.40 MB |
| face_landmark.tflite | Facial landmark/liveness support   | ~2.33 MB |
| mobilefacenet.tflite | Face recognition embeddings        | ~4.99 MB |

Total model size: **~7.72 MB**

Target model size: **~20 MB or less**

Status: **PASS**

=======
# Veriface
Lightweight offline facial authentication with presence verification, GPS attendance, encrypted storage, and secure local proof.
>>>>>>> a5dccceb2c7c04d71101a803722bb9a626698464
