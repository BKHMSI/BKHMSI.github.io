float carX = 50, carY;
float timer = 0, s = 0, speed = 1.5;
color green = color(0, 192, 0);
color red = color(255, 0, 0);
boolean lostBool = false, startGameBool = true;
Objects[] ob;

void setup() {
  size(400, 500);
  smooth();
  s = millis();
  ob = new Objects[10];
  carY = height -100; 
  initObs();
}

void draw() {
  if(startGameBool){
    splashScreen();
  }else{
   play();
  }
}


void drawLanes() {
  fill(255);
  rectMode(CENTER);
  int y = 0;
  for (int i = 100; i<400; i+=100) {
    rect(i, 0, 10, height*2);
  }
}

void drawCar() {
  noStroke();

  //Body
  fill(255, 0, 0);
  rect(carX, height-100, 30, 60);

  //Roof
  fill(255, 100, 100);
  rect(carX, carY, 25, 25);


  //Wheels
  fill(0);
  rect(carX-20, carY-10, 10, 15);
  rect(carX-20, carY+15, 10, 15);
  rect(carX+20, carY-10, 10, 15);
  rect(carX+20, carY+15, 10, 15);
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

void initObs() {
  float diffY=0;
  for (int i = 0; i<ob.length; i++) {
    color cParam = color(random(255), random(255), random(255));
    color cRoof = color(random(255), random(255), random(255));
    float x = random(0, 500);
    if (x<50) {
      x = 50;
    } else if (x>50 && x<150) {
      x=150;
    } else if (x>150 && x<250) {
      x=250;
    } else if (x>250 && x<350) {
      x=350;
    }else if(x>350 && x<400){
      x = 100;
    }else if(x>400 && x<450){
      x = 200;
    }else if(x>450 && x<500){
      x = 300;
    }
    ob[i] = new Objects(x, diffY, cParam, cRoof);
    diffY-=100;
  }
}

void resetGame(){
  lostBool = false;
  startGameBool = false;
  speed = 1.5;
  s = millis();
  initObs();
}

void splashScreen(){
  rectMode(CORNER);
  fill(mouseX,mouseY,mouseX+mouseY);
  rect(0,0,width,height);
  fill(255,220);
  rect(0,0,width,height);
  fill(0);
  textAlign(CENTER);
  textSize(15);
  text("Use The LEFT and RIGHT arrow keys to move the car",width/2,height/2);
  text("Use the UP and DOWN arrow keys \n to change the car's speed",width/2,height/2+50);
  textSize(20);
  text("CLICK ANYWHERE TO PLAY",width/2,height/2+200);
  drawLosingCar(red);
}

void playInTheBG(){
  
}


void lost(){
  lostBool = true;
  rectMode(CORNER);
  fill(red);
  rect(0,0,width,height);
  textAlign(CENTER);
  fill(255);
  textSize(20);
  text("CLICK ANYWHERE TO RESTART",width/2,height/2);
  textSize(15);
  text("YOU SURVIVED FOR "+timer+" seconds",width/2,height/2+50);
  drawLosingCar(color(255));
  noLoop();
}

void drawLosingCar(color cL){
   noStroke(); 
   rectMode(CENTER);
   float losingCarX = width/2, losingCarY = height/2-150;

  //Body
  fill(cL);
  rect(losingCarX, losingCarY, 60, 120);

  //Roof
  fill(0, 0, 0);
  rect(losingCarX, losingCarY, 50, 50);


  //Wheels
  fill(0);
  rect(losingCarX-40, losingCarY-20, 20, 30);
  rect(losingCarX-40, losingCarY+30, 20, 30);
  rect(losingCarX+40, losingCarY-20, 20, 30);
  rect(losingCarX+40, losingCarY+30, 20, 30);
}

void play(){
  background(100);
  timer = (millis()-s)/1000;
  drawLanes();
  drawCar();
  
  for (int i = 0; i<ob.length; i++) {
    ob[i].display();
    ob[i].move();

    if (ob[i].collision()) {
      drawHeader(red);
      lostBool = true;
    }
  }

  drawHeader(green);
  
  if(lostBool){
    lost();
  }
}

void keyPressed() {
  if (carX!=350) {
    if (keyCode == RIGHT) {
      carX+=50;
    }
  } 
  if (carX!=50) {
    if (keyCode == LEFT) {
      carX-=50;
    }
  }

  if (keyCode == UP) {
    speed+=1;
  } else if (keyCode == DOWN) {
    speed-=1;
  }
  
  if(key == 'p' || key == 'P'){
    noLoop();
  }
}

void mousePressed(){
  if(lostBool || startGameBool){
    resetGame();
    loop();
  }
}
class Objects {
  float objectX, objectY;
  color cB, cR;
  
  Objects(float _obX, float _obY, color _CB, color _CR) {
    objectX = _obX;
    objectY = _obY;
    cB = _CB;
    cR = _CR;
  }

  void display() {
  noStroke();
  rectMode(CENTER);
  
  //Body
  fill(cB);
  rect(objectX, objectY, 30, 60);
  
  //Roof
  fill(cR);
  rect(objectX, objectY, 25, 25);
  

  //Wheels
  fill(0);
  rect(objectX-20, objectY-10, 10, 15);
  rect(objectX-20, objectY+15, 10, 15);
  rect(objectX+20, objectY-10, 10, 15);
  rect(objectX+20, objectY+15, 10, 15);
  }

  void move() {
    objectY+=speed;
    if (objectY>height) {
      reset();
    }
  }
  
  void reset(){
    float x = random(0, 500);
    float diffY=0;
    if (x<50) {
      objectX =50;
    } else if (x>50 && x<150) {
      objectX=150;
    } else if (x>150 && x<250) {
      objectX=250;
    } else if (x>250 && x<350) {
      objectX=350;
    }else if(x>350 && x<400){
      objectX = 100;
    }else if(x>400 && x<450){
      objectX = 200;
    }else if(x>450 && x<500){
      objectX = 300;
    }
      objectY = -200;
  }

  boolean collision() {
    boolean returnValue = false;
      if(dist(objectX, objectY, carX, carY)<=45){
        returnValue = true;
      }
    return returnValue;
  }
}

