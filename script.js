// --- THE PYTHON BRIDGE FIX ---
class Rescaling extends tf.layers.Layer {
    constructor(config) {
        super(config);
    }
    static get className() {
        return 'Rescaling'; // Tells TFJS to look for this exact name
    }
    computeOutputShape(inputShape) {
        return inputShape;
    }
    call(input) {
        // We already did the math with img.div(255.0) in our prediction function,
        // so we just pass the image straight through!
        return Array.isArray(input) ? input[0] : input;
    }
}
// Register the custom layer into the engine
tf.serialization.registerClass(Rescaling);

// ... The rest of your existing code stays exactly the same!
// const canvas = document.getElementById('drawingCanvas');
// ...

// 1. Grab the elements from our HTML
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clearBtn');
const predictBtn = document.getElementById('predictBtn');
const predictionText = document.getElementById('prediction');

// 2. Setup the "Digital Pen"
ctx.lineWidth = 28;        // Thick ink for the model to see clearly
ctx.lineCap = 'round';     // Smooth, rounded edges
ctx.strokeStyle = 'white'; // White ink on black background (like MNIST)

// NEW: Paint the transparent canvas solid black!
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

let isDrawing = false;

// 3. Mouse Events (For laptops/desktops)
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// 4. Touch Events (For mobile devices/tablets)
canvas.addEventListener('touchstart', startDrawing, { passive: false });
canvas.addEventListener('touchmove', draw, { passive: false });
canvas.addEventListener('touchend', stopDrawing);

// --- Drawing Functions ---

function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function draw(e) {
    if (!isDrawing) return;

    // Prevent default scrolling when drawing on a touch screen
    e.preventDefault();

    // Calculate accurate X and Y coordinates inside the canvas
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Draw the line
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Reset path so the line follows the cursor smoothly
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath(); // Reset the path so the next line doesn't connect to the old one
}

// --- Button Functions ---

// Clear the board
clearBtn.addEventListener('click', () => {
    // Replace clearRect with a solid black fill
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    predictionText.innerText = '?';
});

/// --- AI MODEL LOGIC ---

let model;

// 1. Load the model as soon as the page opens
async function loadModel() {
    try {
        predictionText.innerText = "Loading model...";
        // This looks inside your folder for the JSON file
        model = await tf.loadLayersModel('tfjs_model/model.json',{strict: false});
        console.log("Model loaded successfully!");
        predictionText.innerText = "Ready! Draw a number.";
    } catch (error) {
        console.error("Failed to load model:", error);
        predictionText.innerText = "Error: Check console";
    }
}

// Call the function to boot up the brain
loadModel();

// 2. The Prediction Button
predictBtn.addEventListener('click', async () => {
    // Prevent clicking before the model is ready
    if (!model) {
        alert("Hold on, the AI is still waking up!");
        return;
    }

    predictionText.innerText = "Thinking...";

    // tf.tidy() is a cleanup tool that prevents your browser from crashing out of memory
    const predictedNumber = tf.tidy(() => {
        // a. Grab the image straight from your canvas (1 = grayscale)
        let img = tf.browser.fromPixels(canvas, 1);
        
        // b. Resize it from 280x280 down to 28x28 (what the CNN expects)
        img = tf.image.resizeBilinear(img, [28, 28]);
        
        // c. Normalize the pixels (convert 0-255 into 0.0-1.0)
        img = img.div(255.0);
        
        // d. Reshape it to [1, 28, 28, 1] so it matches your Python setup perfectly
        img = img.expandDims(0);
        
        // e. Make the actual prediction!
        const output = model.predict(img);
        
        // f. Find the highest probability and return that exact number
        return output.argMax(1).dataSync()[0];
    });

    // Display the final answer on the website
    predictionText.innerText = predictedNumber;
});