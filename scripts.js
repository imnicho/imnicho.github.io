// THREE.JS Wireframe Background Fix
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bgCanvas'), alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Wireframe Grid
const gridHelper = new THREE.GridHelper(30, 30, 0xff0000, 0xff0000);
scene.add(gridHelper);

camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);

function animate() {
    requestAnimationFrame(animate);
    gridHelper.rotation.y += 0.001; // Slight rotation
    renderer.render(scene, camera);
}
animate();
document.addEventListener('mousemove', function(e) {
    let trail = document.createElement("div");
    trail.classList.add("cursor-trail");
    trail.style.left = `${e.clientX}px`;
    trail.style.top = `${e.clientY}px`;
    document.body.appendChild(trail);

    setTimeout(() => {
        trail.remove();
    }, 200);
});

// Inject CSS for cursor trails
const style = document.createElement("style");
style.innerHTML = `
    .cursor-trail {
        position: absolute;
        width: 4px;
        height: 4px;
        background: red;
        border-radius: 50%;
        box-shadow: 0 0 4px red;
        pointer-events: none;
        transform: translate(-50%, -50%);
        opacity: 1;
        animation: fadeTrail 0.2s linear forwards;
    }

    @keyframes fadeTrail {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(2); }
    }
`;
document.head.appendChild(style);
// TERMINAL COMMAND HANDLING
const terminalInput = document.getElementById("terminalInput");
const outputDiv = document.querySelector(".output");

terminalInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        const inputText = terminalInput.value.trim().toLowerCase();
        terminalInput.value = ""; // Clear input field
        processCommand(inputText);
    }
});

function processCommand(command) {
    let response = "";

    switch (command) {
        case "help":
            response = "Available commands: <br> - help <br> - clear <br> - glitch <br> - blog <br> - back <br> - home ";
            break;
        case "clear":
            outputDiv.innerHTML = ""; // Clears the terminal
            return;
        case "glitch":
            applyGlitchEffect();
            response = "!! SYSTEM GLITCH ACTIVATED !!";
            break;
        case "blog":
            window.location.href = "/blog/index.html";
            return;
        default:
            response = `Unknown command: '${command}'`;
            case "home":
                window.location.href = "/index.html";
                return;
            case "back":
                window.history.back();
                return;
    }

    appendToTerminal(response);
}

function appendToTerminal(text) {
    const newLine = document.createElement("p");
    newLine.innerHTML = text;
    outputDiv.appendChild(newLine);
    outputDiv.scrollTop = outputDiv.scrollHeight; // Auto-scroll
}

// GLITCH EFFECT
function applyGlitchEffect() {
    document.body.classList.add("glitch");
    setTimeout(() => {
        document.body.classList.remove("glitch");
    }, 500);
}
// ASCII MATRIX EFFECT
const matrixContainer = document.createElement("div");
matrixContainer.classList.add("matrix-overlay");
document.body.appendChild(matrixContainer);

function createSymbol() {
    const symbol = document.createElement("span");
    symbol.innerText = String.fromCharCode(33 + Math.random() * 94); // Random ASCII
    symbol.classList.add("matrix-symbol");

    symbol.style.left = Math.random() * 100 + "vw";
    symbol.style.animationDuration = Math.random() * 3 + 2 + "s";
    
    matrixContainer.appendChild(symbol);

    setTimeout(() => {
        symbol.remove();
    }, 5000);
}

setInterval(createSymbol, 100);
// Algorithmic Pattern (Geometric Shifting Grid)
// const patternCanvas = document.createElement("canvas");
//document.body.appendChild(patternCanvas);
//const ctx = patternCanvas.getContext("2d");

//patternCanvas.width = window.innerWidth;
//patternCanvas.height = window.innerHeight;

//function drawPattern() {
  //  ctx.clearRect(0, 0, patternCanvas.width, patternCanvas.height);
    //ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
//
  //  for (let i = 0; i < patternCanvas.width; i += 50) {
    //    for (let j = 0; j < patternCanvas.height; j += 50) {
      //      const offset = Math.sin((i + j + Date.now() / 500) / 50) * 5;
        //    ctx.strokeRect(i + offset, j + offset, 40, 40);
        //}
   // }
   // requestAnimationFrame(drawPattern);
//}
//drawPattern();
// Fake Scrolling Terminal Text
const terminalFeed = document.querySelector('.background-terminal');

function generateTerminalText() {
    let chars = "0123456789ABCDEF";
    let text = "";
    for (let i = 0; i < 50; i++) {
        text += "> " + [...Array(40)].map(() => chars[Math.floor(Math.random() * chars.length)]).join('') + "\n";
    }
    return text;
}

function updateTerminalFeed() {
    terminalFeed.innerText = generateTerminalText();
}

setInterval(updateTerminalFeed, 200);
// Random Light Flickers & Glitches
function randomFlicker() {
    document.body.classList.add("glitch");
    setTimeout(() => {
        document.body.classList.remove("glitch");
    }, Math.random() * 500 + 100);
}

setInterval(() => {
    if (Math.random() > 0.9) { // 10% chance every second
        randomFlicker();
    }
}, 1000);
// Mouse Movement Effect
document.addEventListener('mousemove', function(e) {
    let x = (e.clientX / window.innerWidth) * 2 - 1;
    let y = (e.clientY / window.innerHeight) * 2 - 1;

    document.querySelectorAll('.matrix-symbol').forEach(symbol => {
        symbol.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
    });

    document.querySelector('.background-terminal').style.transform = `translate(${x * 5}px, ${y * 5}px)`;
});
