import {
  ObjectDetector,
  FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

let detector, stream = null;
let lastFrameTime = performance.now();
let fps = 0;

const rawVideo = document.getElementById("rawVideo");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const snapBtn = document.getElementById("snap-btn");

const detectedList = document.getElementById("detected-list");
const fpsBox = document.getElementById("fps-box");

const confidenceSlider = document.getElementById("confidence");
const themeToggle = document.getElementById("theme-toggle");
const loadingScreen = document.getElementById("loading-screen");

stopBtn.disabled = true;

/* Theme toggle */
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");

  themeToggle.textContent =
    document.body.classList.contains("dark") ? "☀ Light" : "🌙 Dark";
});

/* Load model */
async function initModel() {
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

  loadingScreen.style.display = "none";
}

initModel();

/* Start Camera */
async function startCamera() {
  stream = await navigator.mediaDevices.getUserMedia({ video: true });
  rawVideo.srcObject = stream;

  rawVideo.onloadeddata = () => {
    detectFrame();
  };
}

startBtn.addEventListener("click", () => {
  startCamera();
  startBtn.disabled = true;
  stopBtn.disabled = false;
});

/* Stop Camera */
stopBtn.addEventListener("click", () => {
  stopCamera();
  stopBtn.disabled = true;
  startBtn.disabled = false;
});

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* Screenshot */
snapBtn.addEventListener("click", () => {
  const img = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = img;
  link.download = "snapshot.png";
  link.click();
});

/* Detection Loop */
function detectFrame() {
  if (!stream) return;

  const now = performance.now();
  fps = Math.round(1000 / (now - lastFrameTime));
  lastFrameTime = now;
  fpsBox.textContent = `${fps} FPS`;

  canvas.width = rawVideo.videoWidth;
  canvas.height = rawVideo.videoHeight;

  ctx.drawImage(rawVideo, 0, 0);

  const results = detector.detect(rawVideo);
  detectedList.innerHTML = "";

  results.detections.forEach(det => {
    const box = det.boundingBox;
    const name = det.categories[0].categoryName;
    const score = det.categories[0].score.toFixed(2);

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(box.originX, box.originY, box.width, box.height);

    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(`${name} (${score})`, box.originX, box.originY - 5);

    const li = document.createElement("li");
    li.textContent = `${name} (${score})`;
    detectedList.appendChild(li);
  });

  requestAnimationFrame(detectFrame);
}
