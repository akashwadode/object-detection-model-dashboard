# 🧠 AI Object Detection Dashboard  
A modern, real-time **Object Detection Web App** built using **MediaPipe Vision Tasks**, **JavaScript**, and a **beautiful glassmorphic UI**.

This dashboard uses your webcam to detect objects live and display bounding boxes, labels, and confidence scores in real-time — all inside your browser.

Live Demo (if deployed):  
🔗 *https://aquamarine-starburst-e1cc47.netlify.app/*

---

## 🚀 Features

### 🎥 Real-time Object Detection  
- Uses **MediaPipe EfficientDet Lite0** model  
- Detects multiple objects at once  
- Displays labels, bounding boxes, and confidence  

### ⚡ Live FPS Counter  
- Shows how fast the model processes the video in real-time  

### 🌓 Light / Dark Mode  
- Smooth theme switching  
- Remembers user preference  

### 🪟 Dual Camera Views  
- **Normal Camera Preview**  
- **AI Detection Processed View**  

### 🎚 Adjustable Confidence Slider  
- Filter weak predictions  
- Perfect for testing & demos  

### 📸 Screenshot Capture  
- Save detection snapshots with one click  

### 💎 Modern UI/UX  
- Glassmorphism  
- Subtle neon glow  
- Responsive layout  
- Premium dashboard styling  

---

## 📁 Project Structure
📦 ai-object-detection-dashboard
┣ 📜 index.html
┣ 📜 style.css
┗ 📜 script.js


---

## 🛠 Technologies Used

- **HTML5**
- **CSS3 (Glassmorphism + Neon UI)**
- **JavaScript (ES6 Modules)**
- **MediaPipe Tasks Vision API**
- **MediaPipe EfficientDet Lite0 Model**
- **WebRTC (Webcam Access)**

---

## ▶️ How to Run Locally

### 1️⃣ Clone the repository
```sh
git clone https://github.com/akashwadode/object-detection-model-dashboard.git
cd object-detection-model-dashboard
```

### 2️⃣ Start a local server
(Important, because webcam won’t work with a plain file system.)
Using VSCode:

Install the extension: Live Server → Start Server

OR using Python:
```sh
python -m http.server 8000
```

### 3️⃣ Open the app
Visit:
```sh

http://localhost:8000
```

