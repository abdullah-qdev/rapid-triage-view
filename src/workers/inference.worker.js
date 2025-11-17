// Web Worker for simulated AI inference
// TODO: Replace with actual ONNX Runtime or TensorFlow.js model in production

let humanitarianMode = false;

// Listen for messages from main thread
self.onmessage = function (e) {
  const { type, scanId, imageData, enabled } = e.data;

  // Handle humanitarian mode toggle
  if (type === 'setHumanitarianMode') {
    humanitarianMode = enabled;
    return;
  }

  // Simulate inference processing
  if (scanId && imageData) {
    processInference(scanId, imageData);
  }
};

async function processInference(scanId, imageData) {
  const startTime = Date.now();

  // Simulated processing delay
  // Humanitarian mode: faster processing (500-1500ms)
  // Normal mode: slower processing (1000-3000ms)
  const processingDelay = humanitarianMode
    ? 500 + Math.random() * 1000
    : 1000 + Math.random() * 2000;

  await new Promise((resolve) => setTimeout(resolve, processingDelay));

  // Simulated triage classification
  // Humanitarian mode: biased toward higher urgency (more CRITICAL/URGENT)
  // Normal mode: balanced distribution
  const triageLevel = simulateTriageClassification(humanitarianMode);
  const confidence = 0.75 + Math.random() * 0.24; // 75-99%

  // Generate faux heatmap data (simulated attention regions)
  const heatmapData = generateFauxHeatmap(triageLevel);

  const processingTime = Date.now() - startTime;

  // Send result back to main thread
  self.postMessage({
    scanId,
    result: {
      triageLevel,
      confidence,
      heatmapData,
    },
    processingTime,
  });
}

function simulateTriageClassification(isHumanitarianMode) {
  const rand = Math.random();

  if (isHumanitarianMode) {
    // Humanitarian mode: Higher probability of urgent cases
    if (rand < 0.35) return 'CRITICAL';
    if (rand < 0.65) return 'URGENT';
    if (rand < 0.85) return 'STABLE';
    return 'NON-URGENT';
  } else {
    // Normal mode: More balanced distribution
    if (rand < 0.20) return 'CRITICAL';
    if (rand < 0.45) return 'URGENT';
    if (rand < 0.75) return 'STABLE';
    return 'NON-URGENT';
  }
}

function generateFauxHeatmap(triageLevel) {
  // Generate 3-5 "attention spots" based on triage level
  const spotCount = triageLevel === 'CRITICAL' ? 4 + Math.floor(Math.random() * 2) : 2 + Math.floor(Math.random() * 3);
  const spots = [];

  for (let i = 0; i < spotCount; i++) {
    const x = 20 + Math.random() * 60; // 20-80% from left
    const y = 20 + Math.random() * 60; // 20-80% from top
    const radius = 8 + Math.random() * 12; // 8-20% radius

    // Color based on triage level
    let color;
    switch (triageLevel) {
      case 'CRITICAL':
        color = '#DC2626'; // Red
        break;
      case 'URGENT':
        color = '#EA580C'; // Orange
        break;
      case 'STABLE':
        color = '#EAB308'; // Yellow
        break;
      default:
        color = '#9CA3AF'; // Gray
    }

    spots.push({ x, y, radius, color });
  }

  return spots;
}

/* 
  TODO: Integration with real model runtime (production steps)
  
  1. Install ONNX Runtime or TensorFlow.js:
     npm install onnxruntime-web
     or
     npm install @tensorflow/tfjs
  
  2. Load your trained model:
     - For ONNX: const session = await ort.InferenceSession.create('model.onnx');
     - For TF.js: const model = await tf.loadLayersModel('model.json');
  
  3. Preprocess imageData:
     - Decode base64 to pixel array
     - Resize to model input size (e.g., 224x224, 512x512)
     - Normalize pixel values (e.g., [0,1] or [-1,1])
     - Convert to tensor format
  
  4. Run inference:
     - ONNX: const output = await session.run({ input: tensor });
     - TF.js: const prediction = model.predict(tensor);
  
  5. Post-process outputs:
     - Extract class probabilities
     - Generate actual attention maps / heatmaps (e.g., Grad-CAM)
     - Map to triage levels (CRITICAL/URGENT/STABLE/NON-URGENT)
  
  6. Return structured result to main thread
  
  For DICOM support:
  - Use cornerstone-core or dicom-parser to load .dcm files
  - Extract pixel data and metadata
  - Convert to format suitable for model input
*/
