let bg, mainImg, box1Img, box2Img, secImg, bookImg, textImg;
let soundTrack, tea;
let lightOn = false;
let teaSound = false;
let showText = false;

const baseW = 600;
const baseH = 600;

let scaleFactor = 1;

function preload() {
  bg = loadImage('IMG_0240.jpg');
  mainImg = loadImage('main.png');
  secImg = loadImage('sec.png');
  bookImg = loadImage('books.png');
  box1Img = loadImage('image1.png');
  box2Img = loadImage('image2.png');
  textImg = loadImage('text.png');
  soundTrack = loadSound('music.mp3');
  tea = loadSound('tea.mp3');
}

function setup() {
  updateCanvasSize();

  userStartAudio().then(() => {
    if (!soundTrack.isPlaying()) soundTrack.loop();
  });

  const btn = document.getElementById('toggle-sound-1');
  btn.addEventListener('click', () => {
    if (soundTrack.isPlaying()) soundTrack.stop();
    else soundTrack.loop();
  });
}

function draw() {
  background(0);

  push();
  scale(scaleFactor); 

  image(bg, 0, 0, baseW, baseH);

  if (!lightOn) {
    fill(0, 0, 0, 120);
    noStroke();
    rect(0, 0, baseW, baseH);
  }

  image(mainImg, 130, 260, 290, 290);
  image(secImg, 270, 460, 100, 100);
  image(bookImg, 353, 420, 100, 100);
  image(box1Img, 340, 240, 120, 175);
  image(box2Img, 455, 240, 120, 175);

  if (showText) {
    image(textImg, 0, 0, baseW, baseH);
  }

  pop();
}

function mousePressed() {

  let mx = mouseX / scaleFactor;
  let my = mouseY / scaleFactor;

  if (mx > 200 && mx < 320 && my > 300 && my < 490) {
    lightOn = !lightOn;
  }

  if (mx > 270 && mx < 390 && my > 480 && my < 560) {
    teaSound = !teaSound;
    if (teaSound) tea.loop();
    else tea.stop();
  }

  if (!showText && mx > 353 && mx < 453 && my > 420 && my < 520) {
    showText = true;
  } else if (showText) {
    showText = false;
  }

  if (mx > 340 && mx < 460 && my > 240 && my < 415) {
    window.location.href = "sketch2.html";
  }
  if (mx > 455 && mx < 575 && my > 240 && my < 415) {
    window.location.href = "sketch3.html";
  }
}

function windowResized() {
  updateCanvasSize();
}

function updateCanvasSize() {

  let w = min(windowWidth, baseW);
  let h = min(windowHeight, baseH);
  let canvas = createCanvas(w, h);
  canvas.parent('sketch');


  scaleFactor = min(width / baseW, height / baseH);
}
















