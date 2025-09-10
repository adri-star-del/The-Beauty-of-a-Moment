let rows = 7;
let waveMaxHeight = 120; 
let baseT = 0;
let particles = [];

let sound, oceanAmp;   // ocean sound + analyzer
let soundBird, birdAmp; // bird sound + separate analyzer

let fishX = -75, fishY = 375; 
let fishBaseY = 450; 
let fishAmplitude = 20; 
let fishSpeed = 1.5; 
let circleColor;

const baseW = 600;
const baseH = 600;
let canvasSize;
let bg, birdImg;
let chirp = false; 

function preload() {
  bg = loadImage('ocean.png');
  sound = loadSound("assets/485702__univ_lyon3__luminais_nolwen_2019_2020_waves.wav"); 
  birdImg = loadImage('bird.png'); 
  soundBird = loadSound('chirp.mp3'); 
}

function setup() {
  updateCanvasSize(); 
  circleColor = color(255, 165, 0);

  // analyzers
  oceanAmp = new p5.Amplitude();
  birdAmp = new p5.Amplitude();

  userStartAudio().then(() => {
    if (!sound.isPlaying()) {
      sound.loop();
      sound.setVolume(0.5);
      oceanAmp.setInput(sound); // 👈 link waves to ocean sound ONLY
    }
    birdAmp.setInput(soundBird); // 👈 bird has its own analyzer, but we won’t use it for waves
  });

  const toggleBtn = document.getElementById('toggle-sound-2');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (!sound.isPlaying()) {
        sound.play();
        sound.setLoop(true);
        oceanAmp.setInput(sound);
      } else {
        sound.stop();
      }
    });
  }

  const vol = document.getElementById('vol');
  const volVal = document.getElementById('volVal');
  if (vol && volVal) {
    vol.addEventListener('input', () => {
      const v = parseFloat(vol.value);
      sound.setVolume(v);
      volVal.textContent = v.toFixed(2);
    });
  }

  const colorBtn = document.getElementById('random-circle-color');
  if (colorBtn) {
    colorBtn.addEventListener('click', () => {
      circleColor = color(random(255), random(255), random(255));
    });
  }
}

function draw() {
  clear();
  image(bg, 0, 0, canvasSize, canvasSize); 

  let scaleFactor = canvasSize / baseW;
  push();
  scale(scaleFactor); 

  drawWaves(rows);
  drawFish();

  // bird stays fixed
  image(birdImg, 150, 220, 100, 100);

  // particles
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

  let level = oceanAmp.getLevel();  // 👈 ONLY ocean sound affects waves
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
  let waveLevel = oceanAmp.getLevel();  // 👈 fish follows only the ocean
  let waveOffset = map(waveLevel, 0, 0.3, 0, 20); 

  fishY = fishBaseY + sin(frameCount * 0.05) * fishAmplitude - waveOffset;

  fill(circleColor);
  noStroke();
  ellipse(fishX, fishY, 60, 35);
  ellipse(fishX - 25, fishY, 25, 25);

  fishX += fishSpeed;
  if (fishX > baseW + 60) {
    fishX = -100;
    fishBaseY = random(400, 500);
  }
}

function mousePressed() {
  let scaleFactor = canvasSize / baseW;
  let mouseXScaled = mouseX / scaleFactor;
  let mouseYScaled = mouseY / scaleFactor;

  if (mouseXScaled > 150 && mouseXScaled < 250 && mouseYScaled > 220 && mouseYScaled < 320) {
    chirp = !chirp;
    if (chirp) {
      soundBird.loop();
    } else {
      soundBird.stop();
    }
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vy = random(-0.5, -1.5);
    this.alpha = 200;
    this.size = random(3, 8);
  }
  update() { this.y += this.vy; this.alpha -= 5; }
  show() { noStroke(); fill(255, 255, 255, this.alpha); ellipse(this.x, this.y, this.size); }
  isFinished() { return this.alpha <= 0; }
}

function windowResized() {
  updateCanvasSize();
}

function updateCanvasSize() {
  canvasSize = min(windowWidth, windowHeight, baseW); 
  let canvas = createCanvas(canvasSize, canvasSize);
  if (document.getElementById('sketch')) canvas.parent('sketch');
}





