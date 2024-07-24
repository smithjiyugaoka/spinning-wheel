cat << EOF > public/script.js
const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');
const result = document.getElementById('result');

const ctx = wheel.getContext('2d');
const radius = wheel.width / 2;
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

        ctx.fillStyle = \`hsl(\${index * (360 / data.length)}, 70%, 60%)\`;
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
}

function rotateWheel(angle) {
    wheel.style.transform = \`rotate(\${angle}deg)\`;
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
            result.textContent = \`Result: \${selectedName}\`;
            isSpinning = false;
        }
    }

    requestAnimationFrame(animate);
}

drawWheel();
spinBtn.addEventListener('click', spin);
EOF