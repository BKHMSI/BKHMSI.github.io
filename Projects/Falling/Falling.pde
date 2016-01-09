float x;
float y = 70;
float ballR = 2.5;
float rectX1 = 0, rectH = 2;
float points = 0;
float s = 0;
float timer = 0;
float speed  = 1.5;
int level = 0;
Land[] l;
int difference = 190;
int counter = 0;
boolean displaySpeed = false, pressed = false, playGame = false;
color red = color(255, 0, 0);
color green = color(0, 192, 0);
PImage reset, play;

/* @pjs preload="reset.png"; */
/* @pjs preload="play.png"; */


void setup() {
  size(400, 400);
  smooth();
  noCursor();
  l = new Land[4];
  for (int i = 0; i<l.length; i++) {
    l[i] = new Land(difference, random(width-20));
    difference+=100;
  }

  reset = loadImage("reset.png");
  play = loadImage("play.png");
}

void draw() {
  if(playGame){
    game();
  }else{
    losing(1);
  }
}

void game(){
  background(200);
  drawGrid();
  timer = (millis()-s)/1000;

  strokeWeight(10);
  x = mouseX;
  y = mouseY;
  fill(255, 0, 0);
  stroke(255, 0, 0);
  ellipseMode(CENTER);
  ellipse(x, y, ballR*2, ballR*2);

  for (int i = 0; i<l.length; i++) {
    l[i].display();
    l[i].move();
  }

  //Check Collision
  for (int i = 0; i<l.length; i++) {
    if (l[i].collision()) {
       losing(2);
    }
  }

  //Speeding Up
  if (timer >= 10+level && timer<10+level+0.1) {
    speed+=0.5;
    level+=10;
    displaySpeed = true;
  }

  if (displaySpeed) {
    displaySpeeding();
    counter++;
  }

  if (counter>30) {
    displaySpeed = false;
    counter = 0;
  }
  
  noStroke();
  if(!pressed){
  drawHeader(green);
  }else{
      drawHeader(red);
  } 
}


class Land {
  float rectY, rectW1;
  float rectX2, rectW2;

  Land(float _rectY, float _rectW) {
    rectY = _rectY;
    rectW1 = _rectW;
  }

  void display() {
    stroke(0);
    strokeWeight(5);
    rectX2 = rectW1 + 50;
    rectW2 =  width - rectX2;
    rect(rectX1, rectY, rectW1, rectH);
    rect(rectX2, rectY, rectW2, rectH);
  }

  void move() {
    rectY-=speed;
    if (rectY<0 ) {
      rectY = height;
      rectW1 = random(width-20);
      rectX2 = rectW1 + random(30, 60);
      rectW2 = width - rectX2;
    }
  }

  boolean collision() {
    boolean returnValue = false;
    if ( ballLeft()<=rectW1 && ballBottom()>=rectY && ballTop()<=rectY+rectH) {
      returnValue = true;
    } 

    if ( ballRight()>=rectX2 && ballBottom()>=rectY && ballTop()<=rectY+rectH) {
      returnValue = true;
    }
    return returnValue;
  }
}

void displaySpeeding() {
  noStroke();
  fill(0, 0, 0, 90);
  rect(0, 0, width, height);
  fill(random(255), random(255), random(255));
  textAlign(CENTER);
  textSize(50);
  text("Speeding Up!!", width/2, height/2);
}
void drawHeader(color c) {
  fill(c);
  noStroke();
  rectMode(CORNER);
  rect(0, 0, width, 40);
  fill(255);
  textAlign(CENTER);
  textSize(20);
  text(timer, width/2, 30);
}

void drawGrid()
{
  strokeWeight(1);
  for (int gridX=0; gridX<width; gridX+=20)
  {
    stroke(192);
    line(gridX, 0, gridX, 1000);
  }
  for (int gridY=40; gridY<height; gridY+=20)
  {
    stroke(192);
    line(0, gridY, 1000, gridY);
  }
}

float ballLeft() {
  return x - ballR;
}

float ballRight() {
  return x + ballR;
}

float ballTop() {
  return y-ballR;
}

float ballBottom() {
  return y+ballR;
}

void losing(int x){
  pressed = true;
  imageMode(CENTER);
  fill(0);
  noStroke();
  fill(250, 250, 250,250);
  rect(0,0,width,height);
  if(x == 1){
    image(play,width/2,height/2-50,100,126);
    fill(0);
    textAlign(CENTER);
    textSize(20);
    text("CLICK ANYWHERE TO PLAY",width/2,height/2+75);
  }else{
    image(reset,width/2,height/2,250,250);
  }
  for (int i = 0; i<l.length; i++) {
    l[i] = new Land(difference, random(width-20));
    difference+=100;
  }
  noLoop();
}


void restart() {
  y = 70;
  ballR = 2.5;
  rectX1 = 0; rectH = 2;
  points = 0;
  s = 0;
  timer = 0;
  speed  = 1.5;
  level = 0;
  Land[] l;
  difference = 300;
  counter = 0;
  displaySpeed = false;
  s = millis();
  pressed = false;
  playGame = true;
}

void mousePressed() {
  if(pressed){
   loop();
  }
  restart();
}

void keyPressed(){
   if(key == 'p' || key == 'P'){
     noLoop();
   }
}

