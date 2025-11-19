// ONNX Runtime Web Worker - Real AI Inference Only
import * as ort from 'onnxruntime-web';

// Configuration - Easy model swapping
const MODEL_CONFIG = {
  path: '/models/triage-model.onnx',
  inputSize: 224,
  executionProviders: ['webgl', 'wasm'], // WebGL for GPU, fallback to WebAssembly
  // Expected output classes (in order)
  classes: ['CRITICAL', 'URGENT', 'STABLE', 'NON-URGENT']
};

let session = null;
let modelLoaded = false;

async function initializeModel() {
  try {
    console.log('🔄 Loading ONNX model from:', MODEL_CONFIG.path);
    session = await ort.InferenceSession.create(MODEL_CONFIG.path, {
      executionProviders: MODEL_CONFIG.executionProviders,
    });
    modelLoaded = true;
    console.log('✅ Model loaded successfully');
    console.log('   Input names:', session.inputNames);
    console.log('   Output names:', session.outputNames);
    console.log('   Execution providers:', session.executionProviders);
  } catch (error) {
    console.error('❌ Failed to load model:', error);
    throw new Error(`Model initialization failed: ${error.message}. Please ensure ${MODEL_CONFIG.path} exists and is a valid ONNX model.`);
  }
}

// Preprocess: Convert image to model input tensor
// ImageNet normalization (adjust mean/std if your model uses different values)
const NORMALIZATION = {
  mean: [0.485, 0.456, 0.406],
  std: [0.229, 0.224, 0.225]
};

async function preprocessImage(imageDataURL) {
  const targetSize = MODEL_CONFIG.inputSize;
  
  try {
    // Load and resize image
    const img = await createImageBitmap(await (await fetch(imageDataURL)).blob());
    const canvas = new OffscreenCanvas(targetSize, targetSize);
    const ctx = canvas.getContext('2d');
    
    // Draw image (maintains aspect ratio if needed, or use 'cover' logic)
    ctx.drawImage(img, 0, 0, targetSize, targetSize);
    const { data } = ctx.getImageData(0, 0, targetSize, targetSize);
    
    // Convert to CHW format with normalization
    const float32Data = new Float32Array(3 * targetSize * targetSize);
    for (let i = 0; i < targetSize * targetSize; i++) {
      // RGB channels with ImageNet normalization
      float32Data[i] = (data[i * 4] / 255.0 - NORMALIZATION.mean[0]) / NORMALIZATION.std[0]; // R
      float32Data[targetSize * targetSize + i] = (data[i * 4 + 1] / 255.0 - NORMALIZATION.mean[1]) / NORMALIZATION.std[1]; // G
      float32Data[targetSize * targetSize * 2 + i] = (data[i * 4 + 2] / 255.0 - NORMALIZATION.mean[2]) / NORMALIZATION.std[2]; // B
    }
    
    return new ort.Tensor('float32', float32Data, [1, 3, targetSize, targetSize]);
  } catch (error) {
    throw new Error(`Image preprocessing failed: ${error.message}`);
  }
}

// Inference: Run model and get predictions
async function runModelInference(imageDataURL) {
  if (!session) {
    throw new Error('Model not initialized. Please ensure the model file is loaded before running inference.');
  }
  
  try {
    // Preprocess image to tensor
    const inputTensor = await preprocessImage(imageDataURL);
    
    // Run inference
    const feeds = { [session.inputNames[0]]: inputTensor };
    const results = await session.run(feeds);
    
    // Get raw predictions (logits or probabilities depending on model)
    const rawPredictions = Array.from(results[session.outputNames[0]].data);
    
    // Postprocess predictions
    return postprocessPredictions(rawPredictions);
  } catch (error) {
    console.error('❌ Inference failed:', error);
    throw new Error(`Inference failed: ${error.message}`);
  }
}

// Postprocess: Convert raw model outputs to user-friendly predictions
function postprocessPredictions(rawPredictions) {
  // Apply softmax if model outputs logits (not probabilities)
  // If your model already outputs probabilities, skip softmax
  const probabilities = softmax(rawPredictions);
  
  // Find class with highest probability
  const maxIdx = probabilities.indexOf(Math.max(...probabilities));
  const triageLevel = MODEL_CONFIG.classes[maxIdx];
  const confidence = probabilities[maxIdx];
  
  // Generate heatmap visualization data
  const heatmapData = generateHeatmap(triageLevel, confidence);
  
  return {
    triageLevel,
    confidence,
    probabilities: Object.fromEntries(
      MODEL_CONFIG.classes.map((label, i) => [label, probabilities[i]])
    ),
    heatmapData
  };
}

// Softmax activation for converting logits to probabilities
function softmax(logits) {
  const maxLogit = Math.max(...logits);
  const expScores = logits.map(x => Math.exp(x - maxLogit)); // Numerical stability
  const sumExp = expScores.reduce((a, b) => a + b, 0);
  return expScores.map(x => x / sumExp);
}

// Generate heatmap visualization (attention map approximation)
// In production, this would come from GradCAM or attention weights
function generateHeatmap(triageLevel, confidence) {
  const spotCount = triageLevel === 'CRITICAL' ? 5 : triageLevel === 'URGENT' ? 4 : 3;
  const colors = { 
    CRITICAL: '#DC2626', 
    URGENT: '#EA580C', 
    STABLE: '#EAB308', 
    'NON-URGENT': '#9CA3AF' 
  };
  
  // Generate attention-like spots (in real model, these would come from activation maps)
  return Array.from({ length: spotCount }, (_, i) => ({
    x: 20 + Math.random() * 60,
    y: 20 + Math.random() * 60,
    radius: 8 + Math.random() * 12,
    intensity: confidence * (0.6 + Math.random() * 0.4),
    color: colors[triageLevel],
  }));
}

// Worker message handler
self.onmessage = async (e) => {
  const { scanId, imageData } = e.data;
  
  if (!scanId || !imageData) {
    self.postMessage({ 
      scanId, 
      error: 'Invalid request: scanId and imageData are required' 
    });
    return;
  }
  
  const startTime = Date.now();
  
  try {
    // Initialize model on first run
    if (!modelLoaded) {
      await initializeModel();
    }
    
    // Run real inference
    const result = await runModelInference(imageData);
    
    self.postMessage({ 
      scanId, 
      result, 
      processingTime: Date.now() - startTime 
    });
  } catch (error) {
    console.error('Worker error:', error);
    self.postMessage({ 
      scanId, 
      error: error.message,
      processingTime: Date.now() - startTime
    });
  }
};
