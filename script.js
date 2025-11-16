import {
  ObjectDetector,
  FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

let detector;
let stream = null;

const rawVideo = document.getElementById("rawVideo");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const detectedList = document.getElementById("detected-list");
const confidenceSlider = document.getElementById("confidence");

const themeToggle = document.getElementById("theme-toggle");
const loadingScreen = document.getElementById("loading-screen");

stopBtn.disabled = true;


themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");

  themeToggle.textContent =
    document.body.classList.contains("dark") ? "☀ Light" : "🌙 Dark";
});


async function initModel() {
  console.log("Loading model...");

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );

  detector = await ObjectDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite"
    },
    scoreThreshold: parseFloat(confidenceSlider.value)
  });

  console.log("Model Loaded!");
  loadingScreen.style.display = "none";
}

initModel();


async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });

    rawVideo.srcObject = stream;

    rawVideo.onloadeddata = () => {
      detectFrame();
    };
  } catch (err) {
    console.error("Webcam error:", err);
    alert("Camera blocked or unavailable!");
  }
}

startBtn.addEventListener("click", () => {
  startCamera();
  startBtn.disabled = true;
  stopBtn.disabled = false;
});

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  detectedList.innerHTML = "";
}

// When Stop Button Pressed
stopBtn.addEventListener("click", () => {
  stopCamera();
  stopBtn.disabled = true;
  startBtn.disabled = false;
});


function detectFrame() {
  if (!stream) return;

  canvas.width = rawVideo.videoWidth;
  canvas.height = rawVideo.videoHeight;

  ctx.drawImage(rawVideo, 0, 0);

  const results = detector.detect(rawVideo);

  // Reset detected objects list
  detectedList.innerHTML = "";

  results.detections.forEach(det => {
    const box = det.boundingBox;

    // Draw bounding box
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 3;
    ctx.strokeRect(box.originX, box.originY, box.width, box.height);

    // Label
    const name = det.categories[0].categoryName;
    const score = det.categories[0].score.toFixed(2);

    ctx.fillStyle = "yellow";
    ctx.font = "18px Arial";
    ctx.fillText(`${name} (${score})`, box.originX, box.originY - 5);

    // Add to detected list
    const li = document.createElement("li");
    li.textContent = `${name} - ${score}`;
    detectedList.appendChild(li);
  });

  requestAnimationFrame(detectFrame);
}
