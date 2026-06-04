# FaceLockAuthStable Installation Requirements

---

## 1. System Requirements

Development machine:

- Windows 10 / Windows 11 recommended
- macOS or Linux can also be used with equivalent commands

Target mobile device:

- Android 8.0 or higher
- iOS 12 or higher
- Minimum RAM: 3 GB
- Camera required
- GPS/location service required for attendance module

---

## 2. Project Installation

From the project root:

```powershell
cd D:\FaceLockAuthStable
npm install
```

Clean install if needed:

```powershell
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
npm install
```

---

## 3. Required NPM Packages

Install required packages:

```powershell
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler
npm install react-native-vision-camera
npm install react-native-fast-tflite
npm install @tensorflow/tfjs @tensorflow/tfjs-backend-cpu @tensorflow/tfjs-core
npm install react-native-fs jpeg-js buffer
npm install @react-native-async-storage/async-storage
npm install react-native-keychain
npm install react-native-geolocation-service
npm install crypto-js
npm install react-native-svg@15.3.0 react-native-qrcode-svg@6.3.15
npm install --save-dev @types/crypto-js @types/node
```

---

## 4. Running the App

Start Metro on port `8088`:

```powershell
npx react-native start --reset-cache --port 8088
```

Open another terminal:

```powershell
cd D:\FaceLockAuthStable
npx react-native run-android --port 8088
```

---

## 5. App Data Reset

Preferred method:

```text
Open app → Reset Registered Face
```

Alternative from device settings:

```text
Settings → Apps → FaceLockAuthStable → Storage & cache → Clear storage
```

Some devices may block:

```powershell
adb shell pm clear com.facelockauthstable
```

If blocked, use the app reset button or Android Settings.






