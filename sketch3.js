let bg, img, secImg, hop, rustle, chirps, door, fairy, deerImg;
let leaves = [];
let sparks = [];

// Bunny vars
let bunnyX, bunnyY;
let vy = 0;
let gravity = 0.6;
let jumpPower = -12;
let onGround = true;
let scaleX = 1;
let scaleY = 1;

// Door & Fairy
let doorX, doorY;
let doorW = 100;
let doorH = 100;
let doorOpen = false;
let doorSliding = false;
let doorSlideProgress = 0;
let fairyX, fairyY;
let fairySize = 60;

// Deer vars
let deerX, deerY;
let deerSpeed = 2;
let gallopFrame = 0;

// Sound control
let soundPlaying = true;

function preload() {
  bg = loadImage('forest.png');
  img = loadImage('tree.png');
  secImg = loadImage('tree.png');
  hop = loadImage('bunny.png');
  door = loadImage('door.png');
  fairy = loadImage('fairy.png');
  deerImg = loadImage('deer.png');
  rustle = loadSound('rustle.mp3');
  chirps = loadSound('forestbirds.mp3');
}

function setup() {
  let cnv = createCanvas(600, 600);
  cnv.parent('sketch');
  imageMode(CENTER);

  // Initial positions
  bunnyX = 100;
  bunnyY = 400;
  doorX = 185;
  doorY = 470;
  fairyX = doorX;
  fairyY = doorY;
  deerX = -150;
  deerY = 480;

  chirps.loop();

  // Sound button
  const btn = select('#toggle-sound-3');
  if (btn) {
    btn.mousePressed(() => {
      if (soundPlaying) {
        chirps.pause();
        soundPlaying = false;
      } else {
        chirps.loop();
        soundPlaying = true;
      }
    });
  }
}

function draw() {
  background(0);

  // --- Background ---
  imageMode(CENTER);
  image(bg, width / 2, height / 2, width, height);

  // --- Trees ---
  imageMode(CORNER);
  image(img, 245, 190, 200, 300);
  image(secImg, 210, 320, 150, 175);

  // --- Bunny physics ---
  vy += gravity;
  bunnyY += vy;

  if (bunnyY > 500) {
    bunnyY = 500;
    vy = 0;
    if (!onGround) {
      scaleY = 0.7;
      scaleX = 1.3;
    }
    onGround = true;
  } else {
    onGround = false;
  }

  scaleY = lerp(scaleY, 1, 0.2);
  scaleX = lerp(scaleX, 1, 0.2);

  // --- Draw Bunny ---
  imageMode(CENTER);
  push();
  translate(bunnyX, bunnyY);
  scale(scaleX, scaleY);
  image(hop, 0, 0, 100, 100);
  pop();

  // --- Door + Fairy ---
  if (doorSliding) {
    doorSlideProgress += 0.05;
    if (doorSlideProgress >= 1) {
      doorSlideProgress = 1;
      doorSliding = false;
      doorOpen = true;
    }
  }

  // Fairy behind door when closed
  if (!doorOpen) {
    image(fairy, fairyX, fairyY, fairySize, fairySize);
  }

  // Door sliding
  if (!doorOpen || doorSliding) {
    let offsetX = lerp(0, 80, doorSlideProgress);
    image(door, doorX + offsetX, doorY, doorW, doorH);
  }

  // Fairy flying when door is open
  if (doorOpen) {
    fairyY -= 2;
    fairyX += sin(frameCount * 0.05) * 1.5;

    sparks.push(new Spark(fairyX, fairyY));
    for (let i = sparks.length - 1; i >= 0; i--) {
      sparks[i].update();
      sparks[i].show();
      if (sparks[i].isFinished()) sparks.splice(i, 1);
    }

    image(fairy, fairyX, fairyY, fairySize, fairySize);

    if (fairyY < -50) {
      fairyY = doorY;
      fairyX = doorX;
      doorOpen = false;
      doorSlideProgress = 0;
      sparks = [];
    }
  }

  // --- Deer ---
  deerX += deerSpeed;
  gallopFrame += 0.15;
  let gallopHeight = sin(gallopFrame) * 15;
  image(deerImg, deerX, deerY + gallopHeight, 120, 80);
  if (deerX > width + 150) {
    deerX = -150;
    gallopFrame = 0;
  }

  // --- Leaves ---
  for (let i = leaves.length - 1; i >= 0; i--) {
    leaves[i].update();
    leaves[i].show();
    if (leaves[i].isOffScreen()) leaves.splice(i, 1);
  }
}

function mousePressed() {
  // Bunny hop
  if (mouseX > bunnyX - 50 && mouseX < bunnyX + 50 &&
      mouseY > bunnyY - 50 && mouseY < bunnyY + 50) {
    if (onGround) {
      vy = jumpPower;
      scaleY = 1.3;
      scaleX = 0.7;
    }
  }

  // Tree 1 click
  if (mouseX > 245 && mouseX < 445 && mouseY > 190 && mouseY < 490) {
    for (let i = 0; i < 20; i++) {
      leaves.push(new Leaf(random(245, 445), random(190, 490)));
    }
    if (rustle.isPlaying()) rustle.stop();
    rustle.play();
  }

  // Tree 2 click
  if (mouseX > 210 && mouseX < 360 && mouseY > 320 && mouseY < 495) {
    for (let i = 0; i < 20; i++) {
      leaves.push(new Leaf(random(210, 360), random(320, 495)));
    }
    if (rustle.isPlaying()) rustle.stop();
    rustle.play();
  }

  // Door click
  if (!doorOpen && !doorSliding &&
      mouseX > doorX - doorW / 2 && mouseX < doorX + doorW / 2 &&
      mouseY > doorY - doorH / 2 && mouseY < doorY + doorH / 2) {
    doorSliding = true;
  }
}

// --- Leaf class ---
class Leaf {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(10, 18);
    this.vx = random(-0.3, 0.3);
    this.vy = random(1, 2);
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.05, 0.05);
    this.color = color(
      random(100, 200),
      random(150, 255),
      random(50, 150),
      random(180, 230)
    );
  }
  update() {
    this.x += this.vx + sin(frameCount * 0.01) * 0.3;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
  }
  show() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    fill(this.color);
    noStroke();
    ellipse(0, 0, this.size, this.size * 1.5);
    pop();
  }
  isOffScreen() {
    return this.y > height + 20;
  }
}

// --- Spark class ---
class Spark {
  constructor(x, y) {
    this.x = x + random(-5, 5);
    this.y = y + random(-5, 5);
    this.size = random(4, 8);
    this.alpha = 255;
  }
  update() {
    this.y -= random(0.5, 1.5);
    this.x += random(-0.5, 0.5);
    this.alpha -= 5;
  }
  show() {
    noStroke();
    fill(255, 255, 200, this.alpha);
    ellipse(this.x, this.y, this.size);
  }
  isFinished() {
    return this.alpha <= 0;
  }
}


