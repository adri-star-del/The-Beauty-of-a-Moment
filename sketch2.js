let rows = 7;
let waveMaxHeight = 150; 
let baseT = 0;
let particles = [];

let sound, amplitude;
let fishX = -75, fishY = 375; 
let circleColor;

const baseW = 600;
const baseH = 600;
let canvasSize; // actual canvas size (square)

function preload() {
  sound = loadSound("assets/485702__univ_lyon3__luminais_nolwen_2019_2020_waves.wav");
}

function setup() {
  updateCanvasSize();
  circleColor = color(255, 165, 0);
  amplitude = new p5.Amplitude();

  const toggleBtn = document.getElementById('toggle-sound-2');
  toggleBtn.addEventListener('click', () => {
    userStartAudio().then(() => {
      if (!sound.isPlaying()) {
        sound.play();
        sound.setLoop(true);
      } else {
        sound.stop();
      }
    });
  });

  const vol = document.getElementById('vol');
  const volVal = document.getElementById('volVal');
  vol.addEventListener('input', () => {
    const v = parseFloat(vol.value);
    sound.setVolume(v);
    volVal.textContent = v.toFixed(2);
  });

  const colorBtn = document.getElementById('random-circle-color');
  colorBtn.addEventListener('click', () => {
    circleColor = color(random(255), random(255), random(255));
  });
}

function draw() {
  background('#A3D4DB');

  // scale everything to fit the square canvas
  let scaleFactor = canvasSize / baseW;

  push();
  scale(scaleFactor);

  drawWaves(rows);
  drawFish();

  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.show();
    if (p.isFinished()) particles.splice(i, 1);
  }

  pop();
}

function drawWaves(num) {
  for (let i = num; i >= 0; i--) drawWave(i, num);
  baseT += 0.01;
}

function drawWave(n, rows) {
  let baseY = baseH - n * waveMaxHeight / 5; 
  let t = baseT + n * 1000;

  push();
  colorMode(HSB);
  let hue = map(n, 0, rows, 190, 240);
  fill(hue, 60, 80);
  noStroke();

  beginShape();
  vertex(0, baseY);

  let level = amplitude.getLevel();
  let dynamicHeight = waveMaxHeight * (0.8 + level * 4);

  for (let x = 0; x <= baseW; x += 30) { 
    let y = baseY - noise(t + x * 0.01) * dynamicHeight;
    vertex(x, y);

    if (random(1) < 0.02) particles.push(new Particle(x, y));
  }

  vertex(baseW, baseY);
  vertex(baseW, baseH);
  vertex(0, baseH);
  endShape();
  pop();
}

function drawFish() {
  fill(circleColor);
  noStroke();
  ellipse(fishX, fishY, 60, 35); 
  ellipse(fishX - 25, fishY, 25, 25);

  fishX += 1.5; 
  if (fishX > baseW + 75) {
    fishX = -100;
    fishY = random(300, 500);
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vy = random(-0.5, -1.5);
    this.alpha = 200;
    this.size = random(4, 8); 
  }
  update() { this.y += this.vy; this.alpha -= 5; }
  show() { noStroke(); fill(255, 255, 255, this.alpha); ellipse(this.x, this.y, this.size); }
  isFinished() { return this.alpha <= 0; }
}

function windowResized() {
  updateCanvasSize();
}

function updateCanvasSize() {
  // square canvas, max 600x600, or smaller to fit window
  canvasSize = min(windowWidth, windowHeight, baseW);
  let canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent('sketch');
}


