# 🧠 CNN Handwritten Digit Predictor

> A web-based handwritten digit recognition application powered by a Convolutional Neural Network (CNN) and deployed directly in the browser using TensorFlow.js. 

## 📖 Overview
This project allows users to draw a number (0-9) on a digital canvas and instantly get a prediction. The underlying Convolutional Neural Network was trained to recognize handwritten digits and successfully evaluates with a **98.86% accuracy rate**. The interface provides a seamless bridge between the trained Python model and a live web environment.

## ✨ Features
*   🎨 **Interactive Digital Pen:** Features a 280x280 HTML canvas configured to capture user drawings with a smooth, rounded digital pen on a black background to perfectly match the original MNIST dataset format.
*   ⚡ **Browser-Based ML:** Uses TensorFlow.js (`tf.min.js`) to load and run the model entirely client-side, ensuring fast predictions without needing a backend server.
*   ⚙️ **Real-World Image Processing:** The user's drawing is captured, resized down to 28x28 pixels, converted to grayscale, and normalized (0.0 to 1.0) so the input strictly matches what the CNN expects `[1, 28, 28, 1]`.
*   🧩 **Custom Rescaling Layer:** Implements a custom `Rescaling` layer registered within the JS engine to handle serialization differences and seamlessly bridge the Python model's architecture with TensorFlow.js.
*   📱 **Responsive UI:** A clean, centered user interface with distinct "Clear" and "Predict" controls, styled with CSS3.

## 🛠️ Technologies Used
*   **Frontend:** HTML5, CSS3, JavaScript
*   **Machine Learning:** TensorFlow.js

## 🚀 How to Run Locally
1. **Clone** this repository to your local machine.
2. Ensure the `tfjs_model` directory contains both your `model.json` and `group1-shard1of1.bin` files.
3. Because the application uses `tf.loadLayersModel()`, you must **serve the files using a local web server** (e.g., VS Code Live Server or Python's `http.server`) to avoid browser CORS restrictions.
4. Open `index.html` in your browser and start drawing.
