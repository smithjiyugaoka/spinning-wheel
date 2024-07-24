console.log('Script started');

const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');
const result = document.getElementById('result');

console.log('Wheel element:', wheel);
console.log('Spin button:', spinBtn);
console.log('Result element:', result);

const ctx = wheel.getContext('2d');

// Draw a simple shape to test if the canvas is working
ctx.fillStyle = 'red';
ctx.fillRect(0, 0, 100, 100);
console.log('Red square should be drawn');

// Debug: Log when the script starts
console.log('Script started');

const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');
const result = document.getElementById('result');

// Debug: Log if elements are found
console.log('Wheel element:', wheel);
console.log('Spin button:', spinBtn);
console.log('Result element:', result);

const ctx = wheel.getContext('2d');
const radius = wheel.width / 2;

// Debug information
console.log('Canvas dimensions:', wheel.width, 'x', wheel.height);
console.log('Data:', data);

// Check if data is defined and not empty
if (!data || data.length === 0) {
  console.error('Data is not defined or empty');
  data = [{ name: "Default", value: 1 }];
}

const totalWeight = data.reduce((sum, item) => sum + item.value, 0);

let isSpinning = false;

function drawWheel() {
    ctx.clearRect(0, 0, wheel.width, wheel.height);
    let startAngle = 0;
    const centerX = wheel.width / 2;
    const centerY = wheel.height / 2;

    data.forEach((item, index) => {
        const sliceAngle = (2 * Math.PI * item.value) / totalWeight;
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        ctx.fillStyle = `hsl(${index * (360 / data.length)}, 70%, 60%)`;
        ctx.fill();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(item.name, radius - 10, 5);
        ctx.restore();

        startAngle = endAngle;
    });

    // Debug: Draw a border around the canvas
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, wheel.width, wheel.height);
}

function rotateWheel(angle) {
    wheel.style.transform = `rotate(${angle}deg)`;
}

function getResult(angle) {
    const normalizedAngle = angle % 360;
    let currentAngle = 0;

    for (const item of data) {
        const sliceAngle = (360 * item.value) / totalWeight;
        if (normalizedAngle < currentAngle + sliceAngle) {
            return item.name;
        }
        currentAngle += sliceAngle;
    }
}

function spin() {
    if (isSpinning) return;
    isSpinning = true;
    result.textContent = '';

    const spinAngle = Math.random() * 360 + 720; // At least 2 full rotations
    const duration = 5000; // 5 seconds
    const start = performance.now();

    function animate(time) {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
        const currentAngle = spinAngle * easeProgress;

        rotateWheel(currentAngle);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            const selectedName = getResult(spinAngle);
            result.textContent = `Result: ${selectedName}`;
            isSpinning = false;
        }
    }

    requestAnimationFrame(animate);
}

// Debug: Log when drawWheel is called
console.log('About to call drawWheel');
drawWheel();
console.log('drawWheel called');

if (spinBtn) {
    spinBtn.addEventListener('click', spin);
    console.log('Spin button event listener added');
} else {
    console.error('Spin button not found');
}

// Debug: Log when the script ends
console.log('Script ended');