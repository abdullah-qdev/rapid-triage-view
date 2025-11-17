# Offline Multi-Modal Radiology Triage MVP

An AI-powered medical imaging prioritization system designed for humanitarian crisis response. This front-end MVP demonstrates offline-capable triage of radiology scans using simulated AI inference.

**Built for Datathon Demo** | React + Tailwind CSS | Offline-First

---

## 🎯 Purpose

This application simulates an AI-powered triage system for medical imaging that can operate offline in resource-constrained environments. It demonstrates:

- **Automated Prioritization**: AI-based classification of medical scans into triage levels (CRITICAL, URGENT, STABLE, NON-URGENT)
- **Offline Capability**: Works without internet using IndexedDB for persistence
- **Humanitarian Mode**: Optimized processing for crisis response scenarios
- **Visual Feedback**: Heatmap overlays showing AI attention regions

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
├── public/
│   └── sample-images/          # 3 demo medical images for testing
├── src/
│   ├── components/
│   │   ├── Uploader.jsx        # Drag-and-drop file uploader
│   │   ├── Viewer.jsx          # Main image viewer with heatmap
│   │   ├── QueuePanel.jsx      # Patient queue sidebar
│   │   └── ThroughputCard.jsx  # Statistics widget
│   ├── workers/
│   │   └── inference.worker.js # Web Worker for simulated AI inference
│   ├── utils/
│   │   └── indexeddb.js        # IndexedDB persistence helper
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # Application entry point
│   └── index.css               # Tailwind CSS + custom styles
├── index.html
├── package.json
└── README.md
```

---

## ✅ Acceptance Criteria

### Functional Requirements

- [x] **Upload**: Drag-and-drop or file selector for PNG/JPG images
- [x] **Queue**: Sidebar showing all scans with status (queued → processing → done)
- [x] **Viewer**: Display selected scan with triage badge and confidence
- [x] **Heatmap**: Toggle overlay showing AI attention regions
- [x] **Humanitarian Mode**: Changes processing speed and urgency distribution
- [x] **Offline**: Queue persists via IndexedDB, offline indicator visible
- [x] **Export**: Download JSON report of triage results
- [x] **Keyboard Shortcuts**: U (upload), H (humanitarian toggle)
- [x] **Responsive**: Mobile/tablet/desktop layouts
- [x] **Accessibility**: Keyboard navigation, ARIA labels

### Demo Testing Steps

1. **Upload Images**: Drop files or click uploader → thumbnails appear in queue
2. **Processing**: Status changes queued → processing → done with triage label
3. **Viewer**: Click queue item → displays in main viewer
4. **Heatmap**: Toggle shows colored attention spots
5. **Humanitarian Mode**: Checkbox changes processing speed & urgency bias
6. **Offline**: Simulate offline in DevTools → banner appears, reload preserves queue
7. **Export**: Click "Export Triage Report" → downloads JSON summary

---

## 🧪 Tech Stack

- **React** (v18) - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling (no runtime dependencies)
- **Web Workers** - Background processing
- **IndexedDB API** - Offline persistence
- **No external runtime libraries** - Pure browser APIs only

---

## 🔧 Converting to Real Inference

### Current Implementation
The `src/workers/inference.worker.js` file contains a **simulated AI model** that:
- Randomly assigns triage levels
- Generates fake heatmaps
- Simulates processing delays

### Production Steps

To replace the stub with a real AI model:

#### 1. **Choose a Runtime**

**Option A: ONNX Runtime Web**
```bash
npm install onnxruntime-web
```

**Option B: TensorFlow.js**
```bash
npm install @tensorflow/tfjs
```

#### 2. **Load Your Model**

Replace the `processInference` function in `inference.worker.js`:

```javascript
// ONNX example
import * as ort from 'onnxruntime-web';

let session;

async function loadModel() {
  session = await ort.InferenceSession.create('/models/triage-model.onnx');
}

// TensorFlow.js example
import * as tf from '@tensorflow/tfjs';

let model;

async function loadModel() {
  model = await tf.loadLayersModel('/models/triage-model.json');
}
```

#### 3. **Preprocess Images**

Convert base64 image data to model input format:

```javascript
async function preprocessImage(imageDataURL) {
  // 1. Decode base64 to ImageData
  const img = await loadImage(imageDataURL);
  
  // 2. Resize to model input size (e.g., 224x224)
  const canvas = document.createElement('canvas');
  canvas.width = 224;
  canvas.height = 224;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, 224, 224);
  
  // 3. Get pixel data and normalize
  const imageData = ctx.getImageData(0, 0, 224, 224);
  const pixels = Float32Array.from(imageData.data);
  
  // Normalize to [0, 1] or [-1, 1] based on model training
  const normalized = pixels.map(p => p / 255.0);
  
  // 4. Convert to tensor (shape: [1, 224, 224, 3])
  return new ort.Tensor('float32', normalized, [1, 224, 224, 3]);
}
```

#### 4. **Run Inference**

```javascript
// ONNX Runtime
const tensor = await preprocessImage(imageData);
const results = await session.run({ input: tensor });
const predictions = results.output.data;

// TensorFlow.js
const tensor = tf.browser.fromPixels(imageElement).expandDims(0);
const predictions = model.predict(tensor).dataSync();
```

#### 5. **Generate Real Heatmaps**

For actual attention maps, implement Grad-CAM or similar:

```javascript
// Grad-CAM pseudo-code
const heatmap = await generateGradCAM(model, inputTensor, targetClass);
const heatmapData = convertToOverlayFormat(heatmap);
```

#### 6. **Map to Triage Levels**

```javascript
function classifyTriage(predictions) {
  const [critical, urgent, stable, nonUrgent] = predictions;
  const maxProb = Math.max(critical, urgent, stable, nonUrgent);
  
  if (maxProb === critical) return { level: 'CRITICAL', confidence: critical };
  if (maxProb === urgent) return { level: 'URGENT', confidence: urgent };
  if (maxProb === stable) return { level: 'STABLE', confidence: stable };
  return { level: 'NON-URGENT', confidence: nonUrgent };
}
```

---

## 🏥 DICOM Support (Future Enhancement)

To support medical DICOM files:

### 1. Install DICOM Parser

```bash
npm install cornerstone-core cornerstone-wado-image-loader dicom-parser
```

### 2. Configure Loader

```javascript
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
```

### 3. Load DICOM Files

```javascript
async function loadDicomImage(file) {
  const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
  const image = await cornerstone.loadImage(imageId);
  
  // Extract pixel data
  const pixelData = image.getPixelData();
  
  // Extract metadata
  const metadata = {
    patientName: image.data.string('x00100010'),
    studyDate: image.data.string('x00080020'),
    modality: image.data.string('x00080060'),
  };
  
  return { pixelData, metadata };
}
```

---

## 🎨 Design System

### Brand Colors
- **Primary**: `#1e61ab` (Medical Blue)
- **Critical**: Red (`hsl(0, 84%, 60%)`)
- **Urgent**: Orange (`hsl(25, 95%, 53%)`)
- **Stable**: Yellow (`hsl(45, 93%, 58%)`)
- **Non-Urgent**: Gray (`hsl(210, 10%, 60%)`)

### Key Features
- Clean, minimal medical aesthetic
- High-contrast triage badges for readability
- Responsive layout (mobile → tablet → desktop)
- Keyboard accessible (U, H shortcuts)

---

## 📸 Demo Screenshots

### Upload & Processing
![Upload Demo](docs/screenshot-upload.png)

### Viewer with Heatmap
![Viewer Demo](docs/screenshot-viewer.png)

### Queue & Triage
![Queue Demo](docs/screenshot-queue.png)

---

## 🛠️ Development Notes

### No Runtime Dependencies
This project intentionally avoids runtime libraries to minimize bundle size:
- ❌ No React Router (single page)
- ❌ No Redux/state management (useState only)
- ❌ No chart libraries (custom CSS sparklines)
- ❌ No image processing libs (canvas API)

### Web Worker Bundling
Vite automatically bundles workers using:
```javascript
new Worker(new URL('./workers/inference.worker.js', import.meta.url))
```

### IndexedDB Persistence
Queue survives page reloads and offline scenarios using native IndexedDB API.

---

## ⚠️ Limitations & Disclaimers

- **Demo Only**: Not for clinical use
- **Simulated AI**: Uses random classification, not real model
- **First 50 Pages**: If DICOM multi-frame, only first 50 processed
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

---

## 📝 License

MIT License - Built for educational/datathon purposes

---

## 🤝 Contributing

This is a demo project. For production use:
1. Replace simulated inference with trained model
2. Add DICOM support via Cornerstone
3. Implement backend API for model serving
4. Add authentication & audit logging
5. Conduct clinical validation

---

## 📞 Support

For questions or issues during the datathon, contact the development team.

**Demo Ready** ✅ | **Offline Capable** ✅ | **Humanitarian Optimized** ✅
