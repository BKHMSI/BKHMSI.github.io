/* @pjs preload="back-arrow.png"; */
/* @pjs preload="../Right-Arrow.png"; */
/* @pjs preload="../Left-Arrow.png"; */
/* @pjs preload="../objects/Turret.png"; */
/* @pjs preload="../objects/Crusher.png"; */
/* @pjs preload="../objects/Wave.png"; */
/* @pjs preload="../objects/Teleporter.png"; */
/* @pjs preload="../objects/WindMill.png"; */
/* @pjs preload="../objects/Snake_2.png"; */

int score=0, stage=0, l=1, footerY;
boolean start = false;
int s;
int foodX, foodY;
boolean randomL = false;
PImage objects;
PImage rightArrow, leftArrow, backArrow;
PImage TurretImg, CrusherImg, WaveImg, TeleporterImg, MillImg, snakeImg;
boolean pause = false;
//snake object
lines snake = new lines(500, 500);
//menu switches
startMenu main_menu = new startMenu();
LevelsMain lMenu = new LevelsMain();
HowTo howMenu = new HowTo();
GameInterface initiate = new GameInterface(); 
//level selectors
Lselector level = new Lselector();


void setup()
{
  size(600, 600);
  lMenu.setup();
  key='r';
  footerY = height;
  foodX = int(random(0, width)); 
  foodY = int(random(45, height-50));
  backArrow = loadImage("back-arrow.png");
  rightArrow = loadImage("Right-Arrow.png");
  leftArrow = loadImage("Left-Arrow.png");
  TurretImg = loadImage("objects/Turret.png");
  CrusherImg = loadImage("objects/Crusher.png");
  WaveImg = loadImage("objects/Wave.png");
  TeleporterImg = loadImage("objects/Teleporter.png");
  MillImg = loadImage("objects/WindMill.png");
  snakeImg = loadImage("objects/Snake_2.png");
  smooth(32);
 
}

void draw()
{
  background(255);
  switch(stage)
  {
  case -2:  
    initiate.win();
    level.reset();
    break;
  case -1:
    initiate.gameOver();
    level.reset(); 
    break;
  case 0: //main menu
    main_menu.initialize();  
    foodX = int(random(0, width)); 
    foodY = int(random(45, height-50));  
    initiate.mySecond = 0;
    break;
  case 1: //level switch
    initiate.drawGrid();
    initiate.drawHeader();
    level.drawFood(); 
    level.call_level(l);
    level.reset();
    initiate.drawFooter();
    break;
  case 2:
    lMenu.draw();
    break;
  case 3:
    howMenu.draw();
    break;
  }

  if (randomL) {
    if (!start) {
      s = second();
      l = int(random(1, 10));
      start = true;
    }
    if (abs(second()-s) >= 20) {
      start = false;
    }
  }
}

void mousePressed() {
  // Back button
  if (stage == 1 || stage == 2 || stage == 3) {
    if (mouseX>=20 && mouseX<=20+30) {
      if (mouseY>=5 && mouseY<=5+30) {
        stage = 0;
      }
    }
  }

  // Pause
  if (stage == 1) {
    if (mouseX>=width-40 && mouseX<=width-25) {
      if (mouseY>=10 && mouseY<=30) {
        {
          pause=!pause;
          
        }
        if (!pause)
        {
          loop();
        } else if (pause)
        {
          initiate.drawPause();
          noLoop();
        }
      }
    }
  }

  if (stage == 2) {
    lMenu.mousePressed();
  }
  howMenu.changePageWithArrow();
}

void keyPressed()
{
  if (key=='p')
  {
    pause=!pause;
  }
  if (!pause)
  {
    loop();
  } else if (pause)
  {
    initiate.drawPause();
    noLoop();
  }
  howMenu.changePageWithKey();
}

int getScore(){
  return score;
}
class Lselector
{
  Crusher crush1 = new Crusher(100, 40, 100, 300, true);
  Crusher crush2 = new Crusher(400, 40, 100, 300, true);
  Crusher crush3 = new Crusher(250, 40, 100, 300, true);

  WaveCrusher wC1 = new WaveCrusher(0, 300, 70, 50);
  WaveCrusher wC2 = new WaveCrusher(460, 300, 70, 50);

  Turret level5_Turret1 = new Turret();

  Turret level7_Turret1 = new Turret();
  Turret level7_Turret2 = new Turret();

  Turret level8_Turret1 = new Turret();
  Turret level8_Turret2 = new Turret();

  Turret level10_Turret1 = new Turret();
  Turret level10_Turret2 = new Turret();
  Turret level10_Turret3 = new Turret();
  Turret level10_Turret4 = new Turret();

  Teleporter t1 = new Teleporter(100, 300, 450, 500);
  Teleporter t2 = new Teleporter(500, 100, 100, 500);


  staticLines line1 = new staticLines();

  WindMill mill1 = new WindMill(140, 300, 8, 20, 20, 10);
  WindMill mill11= new WindMill(50, 150, 4, 20, 20, 5);
  WindMill mill12= new WindMill(400, 150, 4, 20, 20, 5);
  WindMill mill13= new WindMill(50, 450, 4, 20, 20, 5);
  WindMill mill14= new WindMill(400, 450, 4, 20, 20, 5);

  Wave wave1 = new Wave();

  wave2 wave_sultan = new wave2(152, 448);

  float startX=500, startY=500;


  void wincheck(float limiter) //wade7 men esmo
  {
    if (score==limiter)
    {
      l++;
      score=0;
      stage=-2;
    }
  }

  void reset() 
  {
    if (key=='r') {
      snake = new lines(startX, startY);
      snake.faster=5;    
      snake.c=10;
      score=0;
      stage=1;
    } 
    if (key=='b' && stage > -1 ) {      
      stage=0;
      key='0';
    }
  }

  void call_level(int level)
  {    

    switch(level) {

    case 1:

      startX=350;
      startY=500;
      snake.display(true, true);
      wincheck(70);
      line1.callVerticle(width/2, true, false);
      line1.callHorizontal(height/2, false, true);
      snake.display(true, true); 
      break;

    case 2: 

      startX=350;
      startY=500;
      snake.display(true, true);
      crush1.draw(true, false);
      crush2.draw(false, true);
      wincheck(70);
      snake.display(true, true);
      break;

    case 3:

      startX=250;
      startY=500;
      snake.display(true, true);
      wave1.draw(true, true);
      wincheck(70);
      snake.display(true, true);
      break;

    case 4:

      startX=250;
      startY=500;
      snake.display(true, true);
      mill1.draw();
      wincheck(70);
      snake.display(true, true);
      break;

    case 5:

      startX=250;
      startY=500;    
      snake.display(true, true);
      level5_Turret1.display(width/2, height/2, 3, true, true, false);
      startX = 400;
      startY = 400;
      wincheck(30);
      snake.display(true, true);
      break;

    case 6:

      startX = 500;
      startY = 500;
      snake.display(true, true);
      line1.callVerticle(width/2, true, false);
      line1.callHorizontal(height/2, false, true);
      mill11.draw();
      mill12.draw();
      mill13.draw();
      mill14.draw();
      wincheck(45);
      snake.display(true, true);
      break;

    case 7:
    
      startX=250;
      startY=500;
      snake.display(true, false);
      level7_Turret1.display(0, 90, 2, true, false, false);
      level7_Turret2.display(width, 90, 3, false, false, false);
      line1.callHorizontal(width/2+100, false, true);
      t1.draw();
      wincheck(70);
      snake.display(true, false);
      break;

    case 8:

      startX = 500;
      startY = 500;
      snake.display(false, true);
      level8_Turret1.display(width/4, height/2, 2, true, false, false);
      level8_Turret2.display(width*0.75, height/2, 2, false, false, false);
      crush3.draw(false, true);
      t2.draw();
      wincheck(70);
      snake.display(false, true);
      break;

    case 9:

      startX = 500;
      startY = 500;
      snake.display(true, false);
      wC1.draw();
      wC2.draw();
      wave_sultan.display();
      wincheck(70);
      snake.display(true, false);
      break;  

    case 10:

      startX=300;
      startY=300;
      snake.display(true, true);
      level10_Turret1.display(0, 90, 2, true, false, true);
      level10_Turret2.display(width, 90, 3, false, false, true);
      level10_Turret3.display(0, 510, 3, false, false, true);
      level10_Turret4.display(width, 510, 3, false, true, true);
      wincheck(100);
      snake.display(true, true);
      break;
    case 11:
      randomL = true;
      break;
    }
  }

  void drawFood() {
    fill(255, 0, 0);
    stroke(255, 0, 0);
    ellipse(foodX, foodY, 10, 10);
  }
}

class Turret {
  float theta=0, step=0.05;
  float x=100, y=height/2-50;
  float r=2.5;
  float[] xpos = new float[126], ypos = new float[126];
  float[] distance = new float[126]; 
  float minD;
  float[] bulletA=new float[10], bulletB=new float[10];
  float timer=0, Bullet_angle;
  int i=0;
  int ammo=3;
  float speedX;
  float speedY;
  boolean clear;
  float tempX, tempY;
  boolean in_Safezone(float circle_x, float circle_y, float circle_diameter) {
    float disX = circle_x - snake.x;
    float disY = circle_y - snake.y;
    noStroke();
    fill(0, 0, 220, 90);
    ellipse(circle_x, circle_y, circle_diameter, circle_diameter);
    fill(i*10/2, i*50/5, i*40/25);
    if (sqrt(sq(disX) + sq(disY)) < circle_diameter/2 ) {
      clear=true;
      return clear;
    } else {
      clear=false;
      return clear;
    }
  }


  void display(float locationX, float locationY, int difficulty, boolean FirstObject, boolean LastObject, boolean safezone_On) {
    x=locationX;
    y=locationY-50;

    if (snake.eaten()) {

      if (FirstObject==true)
      {
        score+=5;
        foodX = int(random(width));
        foodY = int(random(45, height-45));
      }
      if (foodX <=locationX+60 && foodX >= locationX-60 && foodY <=locationY+60 && foodY >= locationY-60)
      {
        if (locationX>=width/2 && locationY>=height/2)
        {
          foodX-=100;
          foodY-=100;
        } else if (locationY<width/2 && locationY<height/2)
        {
          foodX+=100;
          foodY+=100;
        } else if (locationX>=width/2 && locationY<=height/2)
        {
          foodX-=100;
          foodY+=100;
        } else if (locationX<=width/2 && locationY>=height/2)
        {
          foodX+=100;
          foodY-=100;
        }
      }
      if (LastObject==true)
      {
        snake.collide = false;
      }
    }
    switch(difficulty)
    {
    case 0:
      speedX=1; 
      speedY=1; 
      break;
    case 1:
      speedX=1.5; 
      speedY=1.5; 
      break;
    case 2:
      speedX=2; 
      speedY=2; 
      break;
    case 3:
      speedX=2.5; 
      speedY=2.5; 
      break;
    }
    if (theta<2*PI)
    {
      for (int i=0; i<126; i++)
      {
        x+=r*cos(theta);
        y+=r*sin(theta);
        theta+=step;
        xpos[i]=x;
        ypos[i]=y;
      }
    }

    for (int i=0; i<126; i++)
    {
      distance[i]=dist(xpos[i], ypos[i], snake.x, snake.y);
      minD=min(distance);
    }
    for (int i=0; i<126; i++)
    {
      if (dist(xpos[i], ypos[i], snake.x, snake.y)==minD)
      {
        x=xpos[i];
        y=ypos[i];
        displayHead(locationX, locationY);
      }
    }
    collisionDetection();
    fire(locationX, locationY, difficulty);

    if (safezone_On==true)
    {
      in_Safezone(width/2, height/2, 100);
    }
  }

  void displayHead(float locationX1, float locationY1)
  {
    stroke(0);
    fill(timer+100, 0, 0);
    ellipse(x, y, 25, 25);
    fill(0);
    ellipse(locationX1, locationY1, 100, 100);
  }

  void collisionDetection()
  {
    if (dist(snake.x, snake.y, x, y)<=10)
    {
      stage=-1;
    }
  }

  void fire(float locationX2, float locationY2, float difficulty)
  {

    timer++;
    strokeWeight(3);
    stroke(timer+100, 0, 0);

    if (timer>45)
    {
      if (snake.xpos[snake.c/2]>0) {
        line(x, y, snake.xpos[snake.c/2], snake.ypos[snake.c/2]);
      }
    }

    stroke(0, 0, 0);
    if (timer==((difficulty+1)*10)+(120/(difficulty)))
    {     
      bulletA[i]=x;
      bulletB[i]=y;
      i++;
      if (i==ammo) {
        i=0;
      }
      timer=0;
    }
    move_bullets(locationX2, locationY2);
  }

  void move_bullets(float locationX3, float locationY3)
  {
    Bullet_angle = atan2(snake.y-locationY3, snake.x-locationX3);
    tempX=speedX*cos(Bullet_angle);
    tempY=speedY*sin(Bullet_angle);


    for (int i=0; i<ammo; i++) {
      bulletA[i]+=tempX;
      bulletB[i]+=tempY;

      stroke(0);
      fill(255, 0, 0);
      ellipse(bulletA[i], bulletB[i], 10, 10);

      if (!clear)
      {
        for (int d=0; d<snake.c; d++) {
          if (dist(snake.xpos[d], snake.ypos[d], bulletA[i], bulletB[i])<=5)
          {
            stage=-1;
          }
        }
      }
    }
  }
}

class staticLines
{
  void callHorizontal(float Ylocation, boolean firstObject, boolean lastObject) {
    float[] colX= new float[100];
    float[] colY= new float[100];
    ;
    strokeWeight(3);
    stroke(0);
    // Obstacle
    line(0, Ylocation, width, Ylocation);
    // Food
    ;

    for (int i=0; i<=snake.c; i++) {          
      colX[i]=snake.xpos[i];
      colY[i]=Ylocation;
      if (dist(snake.xpos[i], snake.ypos[i], colX[i], colY[i])<=3)
      {
        stage=-1;
      }
    }

    if (snake.eaten()) {

      if (firstObject==true) {
        foodX = int(random(0, width));
        foodY = int(random(45, height-50));
        score+=5;
      }

      if (dist(foodX, foodY, foodX, Ylocation)<=10)
      {
        foodY+=21;
      }
      if (dist(foodX, foodY, foodX, Ylocation)>10 && lastObject==true)
      {
        snake.collide=false;
      }
    }
  }


  void callVerticle(float Xlocation, boolean firstObject, boolean lastObject)
  {
    float[] colX= new float[100];
    float[] colY= new float[100];
    ;
    strokeWeight(3);
    stroke(0);
    // Obstacle
    line(Xlocation, 41, Xlocation, height);

    for (int i=0; i<=snake.c; i++) {          
      colX[i]=Xlocation;
      colY[i]=snake.ypos[i];
      if (dist(snake.xpos[i], snake.ypos[i], colX[i], colY[i])<=3)
      {
        stage=-1;
      }
    }    

    if (snake.eaten()) {
      //score+=5;
      if (firstObject==true) {
        foodX = int(random(0, width));
        foodY = int(random(45, height-50));
        score+=5;
      }

      if (dist(foodX, foodY, Xlocation, foodY)<=10)
      {
        foodX+=21;
      }
      if (dist(foodX, foodY, Xlocation, foodY)>10 && lastObject==true) 
      {           
        snake.collide=false;
      }
    }
  }
}




class Crusher {
  float rectX, rectY, rectW, rectH, tmpH, tmpW;
  boolean moveUp = false, moveDown = false, V;
  Balls[] balls;

  Crusher(float _X, float _Y, float _W, float _H, boolean _V) {
    rectX = _X;
    rectY = _Y;
    rectW = _W;
    rectH = _H;
    tmpH = _H;
    tmpW = _W;
    V = _V;
    balls = new Balls[10];
    for (int i = 0; i<balls.length; i++) {
      balls[i] = new Balls(random(rectX, rectX+rectW), 300, random(5, 10));
    }
  }

  void display() {
    noStroke();
    fill(100);
    rect(rectX, rectY, rectW, rectH);
  }

  void crush() {
    if (V) {
      if (rectH >= tmpH) {
        moveUp = true;
        moveDown = false;
      } else if (rectH<=50) {
        moveUp = false;
        moveDown = true;
      }

      if (moveUp) {
        rectH-=2;
        for (int i = 0; i<balls.length; i++) {
          balls[i].display();
          if (balls[i].x <= rectX+20) {
            balls[i].moveRight();
          } else {
            balls[i].moveLeft();
          }
        }
      } else if (moveDown) {
        rectH+=15;
        for (int i = 0; i<balls.length; i++) {
          balls[i].x = random(rectX, rectX+rectW);
          balls[i].y = 320;
          balls[i].speed = 1;
        }
      }
    } else {
      if (rectW >= tmpW) {
        moveUp = true;
        moveDown = false;
      } else if (rectW<=50) {
        moveUp = false;
        moveDown = true;
      }

      if (moveUp) {
        rectW-=2;
        for (int i = 0; i<balls.length; i++) {
          balls[i].display();
          if (balls[i].x <= rectY+20) {
            balls[i].moveRight();
          } else {
            balls[i].moveLeft();
          }
        }
      } else if (moveDown) {
        rectW+=15;
        for (int i = 0; i<balls.length; i++) {
          balls[i].x = random(rectX, rectX+rectW);
          balls[i].y = 320;
          balls[i].speed = 1;
        }
      }
    }
  }

  void base() {
    if (V) {
      rect(rectX, rectY+tmpH, rectW, tmpH);
    } else {
      rect(rectX+tmpW, rectY, tmpW, rectH);
    }
  }

  void draw(boolean FirstObject, boolean LastObject) {
    display();
    crush();
    base();
    checkCollision();
    if (foodX>=rectX && foodX<=rectX+rectW) {
      if (foodY>=rectY && foodY<=rectY+rectH || foodY>=rectY+300 && foodY<=rectY+600) {
        foodX+=20;
      }
    }
    if (snake.eaten()) {

      if (LastObject==true)
      {
        snake.collide = false;
      }
      if (FirstObject==true)
      { 
        score+=5;
        foodX = int(random(0, width));
        foodY = int(random(45, height-50));
      }
    }
  }

  void checkCollision() {
    for (int i = 0; i<=snake.c; i++) {
      if (snake.xpos[i]>=rectX && snake.xpos[i]<=rectX+rectW) {
        if (snake.ypos[i]>=rectY && snake.ypos[i]<=rectY+rectH || snake.ypos[i]>=rectY+300 && snake.ypos[i]<=height) {
          stage=-1;
        }
      }
    }
  }

  class Balls {
    float x, y, size;
    float gravity = 0.1, speed = 1;
    Balls(float _X, float _Y, float _S) {
      x = _X;
      y = _Y;
      size = _S;
    }

    void display() {
      noStroke();
      fill(0);
      ellipse(x, y, size, size);
    }

    void moveRight() {
      x-=0.25;
      y+=speed;
      speed+=gravity;
    }

    void moveLeft() {
      x+=0.25;
      y+=speed;
      speed+=gravity;
    }
  }
}
class Wave {
  int time = 0;
  int gap = 50;
  int numberOfPoints = 10;
  int amplitude = 50;
  int size = 20;
  float x = 90;

  Points[] points;

  Wave()
  {
    setup();
  }

  void setup() {
    points = new Points[numberOfPoints];

    for (int i = 0; i<points.length; i++) {
      points[i] = new Points(x, 300, size, 2);
      x+=gap;
    }
  }

  void draw(boolean FirstObject, boolean LastObject) {
    for (int i = 0; i<points.length; i++) {
      points[i].display();
      points[i].checkCollision();
      if (time>i*10) {
        points[i].move();
      }
    }
    time++;
    ;
    if (snake.eaten()) {
      score+=5;
      if (LastObject==true)
      {
        snake.collide = false;
      }
      if (FirstObject==true) {
        foodX = int(random(45, width-45));
        foodY = int(random(150, 350));
      }
    }
  }


  class Points {
    float x, y, size, dY;

    Points(float _x, float _y, float _size, float _dY) {
      x = _x;
      y = _y;
      size = _size;
      dY = _dY;
    }

    void display() {
      fill(0);
      ellipseMode(CENTER);
      ellipse(x, y, size, size);
    }

    void move() {
      if (y == amplitude+250 ) {
        dY = -dY;
      } else if (y == 250-amplitude) {
        dY = -dY;
      }
      y+=dY;
    }

    void checkCollision() {
      if (overCircle(x, y, size)) {
        stage = -1;
      }
    }


    boolean overCircle(float x, float y, float diameter) {
      boolean returnValue = false;
      for (int i = 0; i<=snake.c; i++) {
        float disX = x - snake.xpos[i];
        float disY = y - snake.ypos[i];
        if (sqrt(sq(disX) + sq(disY)) < diameter/2 ) {
          returnValue = true;
          break;
        }
      }
      return returnValue;
    }
  }
}

class WindMill {
  float pos = 0.01;
  int numberOfBalls;
  float x, y, r, gap, size;
  Balls[] balls;
  boolean start = false;
  boolean flag = false;

  WindMill(float _X, float _Y, float _R, float _G, float _S, int _Num) {
    x = _X;
    y = _Y;
    r = _R;
    gap = _G;
    size = _S;
    numberOfBalls = _Num;
    setup();
  }

  void setup() {
    balls = new Balls[numberOfBalls];
    for (int i = 0; i<balls.length; i++) {
      balls[i] = new Balls(x, y, r, size);
      x+=size; // gap;
      r--;
    }
  }

  void draw() { 
    for (int i = 0; i<numberOfBalls; i++) {
      balls[i].display();
      balls[i].move();
      if (balls[i].overCircle()) {
        stage = -1;
      }
      if (balls[i].r == 0 ) {
      }
    }
    stroke(0);
    strokeWeight(5);
    float lastX = balls[numberOfBalls-1].x;
    float lastY = balls[numberOfBalls-1].y;
    line(balls[0].x, balls[0].y, lastX, lastY);
    ellipse(lastX, lastY, 20, 20);
    fill(100);
    ellipse(300, 300, 35, 35);
    pos+=0.05;
    if (snake.eaten()) {
      score+=5;
      foodX = int(random(width));
      foodY = int(random(45, height-45));
      if (sqrt(sq(300-foodX) + sq(300-foodY)) < 35) {
        snake.collide = true;
      } else {
        snake.collide = false;
      
    }
  }
  }

  class Balls {
    float x, y, r, size;

    Balls(float _X, float _Y, float _R, float _S) {
      x = _X;
      y = _Y;
      r = _R;
      size = _S;
    }

    void display() {
      noStroke();
      ellipseMode(CENTER);
      fill(0);
      //ellipse(x, y, size, size);
    }

    void move() {
      x+=r*sin(pos);
      y-=r*cos(pos);
      // - pos.
    }

    boolean overCircle() {
      boolean returnValue = false;
      for (int i = 0; i<snake.c-1; i++) {
        float disX = x - snake.xpos[i];
        float disY = y - snake.ypos[i];
        if (sqrt(sq(disX) + sq(disY)) < 10 ) {
          returnValue = true;
          break;
        }
      }
      return returnValue;
    }
  }
}


class Teleporter {
  int x, y, x2, y2;
  Teleporter( int _X, int _Y, int _X2, int _Y2) {
    x = _X;
    y = _Y;
    x2 = _X2;
    y2 = _Y2;
  }

  void display() {
    // First Tele
    noStroke();
    fill(0, 0, 200, 90);
    rect(x, y, 20, 20);
    fill(0);
    rect(x, y, 5, 20);
    rect(x, y, 20, 5);
    rect(x, y+20, 20, 5);

    // Second Tele
    fill(0, 0, 200, 90);
    rect(x2, y2, 20, 20);
    fill(0);
    rect(x2+15, y2, 5, 20);
    rect(x2, y2, 20, 5);
    rect(x2, y2+20, 20, 5);
  }

  void teleportSnake() {
    if (snake.x <= (x+10) && snake.x>=x) {
      if (snake.y >= y && snake.y <= y + 20 ) {
        snake.x = x2;
        snake.y = y2+10;
      }
    } else if (snake.x <= (x2+10) && snake.x>=x2) {
      if (snake.y >= y2 && snake.y <= y2 + 20 ) {
        snake.x = x+10;
        snake.y = y+10;
      }
    }
  }

  void draw() {
    display();
    teleportSnake();
  }
}

class wave2
{

  float[] xpos = new float[50];
  float[] ypos = new float[50];
  float speedX=7;
  float speedY=1.2;
  float theta=0, step=0.1;
  float Min, Max;

  wave2(float _Min, float _Max)
  {
    Min=_Min;
    Max=_Max;
    initialize();
  }

  void initialize()
  {
    for (int i=0; i<50; i++)
    {
      xpos[i]=300;
      ypos[i]=315;
    }
  }

  void display()
  {
    xpos[49]+=speedX;
    ypos[49]+=speedY*sin(theta);

    if (snake.eaten()) {
      score+=5;
      foodX = int(random(width));
      foodY = int(random(70, height-50));
      snake.collide = false;
    }
    if (xpos[49]<Min || xpos[49]>Max)
    {
      speedX*=-1;
    }

    theta+=step;


    for (int i=0; i<49; i++)
    {
      xpos[i]=xpos[i+1];
      ypos[i]=ypos[i+1];
    }
    fill(0);
    for (int i=0; i<50; i+=10)
    {
      fill(i*10/2, i*50/5, i*40/25);
      ellipse(xpos[i], ypos[i], 20, 20);
    }
    collisionDetection();
  }
  void collisionDetection()
  {
    for (int i=0; i<50; i+=10)
    {
      for (int j=0; j<snake.c; j++)
      {
        if (dist(snake.xpos[j], snake.ypos[j], xpos[i], ypos[i])<=10)
        {
          stage=-1;
        }
      }
    }
  }
}

class WaveCrusher {
  float rectX, rectY, rectW, rectH, tmpW;
  float rectX2, rectW2;
  int timer = 0;
  color c = 0;
  boolean moveR = true, moveL = false;

  WaveCrusher(float _X, float _Y, float _W, float _H) {
    rectX = _X;
    rectY = _Y;
    rectW = _W;
    rectH = _H;
    rectX2 = rectX + rectW;
    rectW2 = _W;
    tmpW = _W;
  }

  void display() {
    noStroke();
    fill(c);
    rect(rectX, rectY, rectW, rectH);
    rect(rectX2, rectY, rectW2, rectH);
  }

  void crush() {
    if (rectW >= tmpW) {
      moveR = true;
      moveL = false;
    } else if ( timer == 50 ) {
      moveL = true;
      moveR = false;
    }
    if (moveR) {
      c = 100;
      rectW--;
      rectX2++;
      rectW2--;
      timer++;
    } else if (moveL) {
      c = 0;
      rectW+=0.7;
      rectW2+=0.7;
      rectX2-=0.7;
      timer = 0;
    }
  }

  void checkCollision() {
    for (int i = 0; i<=snake.c; i++) {
      if (snake.xpos[i]>=rectX && snake.xpos[i]<=rectX+rectW || snake.xpos[i]>=rectX2 && snake.xpos[i]<=rectX2+rectW2 ) {
        if (snake.ypos[i]>=rectY && snake.ypos[i]<=rectY+rectH) {
          stage=-1;
        }
      }
    }
  }

  void draw() {
    display();
    crush();
    checkCollision();
    if (snake.eaten()) {
      score+=5;
      foodX = int(random(width));
      foodY = int(random(70, height-50));
      snake.collide = false;
    }
    if (foodX>=0 && foodX<=width) {
      if (foodY>=300 && foodY<=350) {
        foodY+=40;
      }
    }
  }
}

class startMenu
{
  float  menuX = 150, menuY = 100, menuSize = 140;
  boolean menu1 = false, menu2 = false, menu3 = false;
  color redHover = color(192, 0, 0);
  color red = color(255, 0, 0);
  color green = color(78, 245, 20);
  color greenHover = color(0, 204, 102);
  int[] snakeX = new int[50];
  int[] snakeY = new int[50];
  int x = 50, y = 100, speed = 1, c = 50;
  int pointX = int(random(height)), pointY = int(random(width)), pointR = 5;
  boolean collide = false;

  void setup() {
    smooth();
    for (int i = 0; i<snakeX.length-1; i++) {
      snakeX[i] = 0;
      snakeY[i] = 0;
    }
    pointX = int(random(width));
    pointY = int(random(height));
  }

  void initialize()
  {
    background(200);
    drawGrid();
    update(mouseX, mouseY);  
    snake();
    noStroke();
    textAlign(CENTER);
    ellipseMode(CENTER);
    textSize(35);
    if (collide) {
      pointX = int(random(10, width-10));
      pointY = int(random(50, height-10));
    }

    if (menu1) {
      fill(redHover);
    } else { 
      fill(red);
    }
    ellipse(menuX, menuY, menuSize, menuSize);
    if (menu2) {
      fill(greenHover);
    } else { 
      fill(green);
    }
    ellipse(menuX, menuY+200, menuSize, menuSize);
    if (menu3) {
      fill(104, 104, 104);
    } else { 
      fill(80, 80, 80);
    }
    ellipse(menuX, menuY+400, menuSize, menuSize);
    fill(255);
    text("Play", menuX, menuY+15);
    text("Levels", menuX, menuY+165+50);
    text("How", menuX, menuY+315+100);
    textSize(100);
    fill(x, y, x-y);
    text("Snake", width-180, 220);
    textSize(50);
    text("حنش", width-180, 290);
    textSize(22);
    fill(255);
    text("Created by\n Ba-Dev", width-180, 450);
    collide = false;
    if (mousePressed) {
      if (main_menu.menu1) {
        stage = 1;
        randomL = false;
        key='r';
      } else if (main_menu.menu2) {
        stage = 2;
        randomL = false;
      } else if (main_menu.menu3) {
        stage = 3;
        randomL = false;
      }
    }
  }


  boolean overCircle(float x, float y, float diameter) {
    float disX = x - mouseX;
    float disY = y - mouseY;
    if (sqrt(sq(disX) + sq(disY)) < diameter/2 ) {
      return true;
    } else {
      return false;
    }
  }

  void update(int x, int y) {
    if ( overCircle(menuX, menuY, menuSize) ) {
      menu1 = true;
      menu2 = false;
      menu3 = false;
    } else if ( overCircle(menuX, menuY+200, menuSize) ) {
      menu1 = false;
      menu2 = true;
      menu3 = false;
    } else if (overCircle(menuX, menuY+400, menuSize)) {
      menu1 = false;
      menu2 = false;
      menu3 = true;
    } else {
      menu1 = false;
      menu2 = false;
      menu3 = false;
    }
  }



  void drawGrid()
  {
    strokeWeight(1);
    for (int gridX=0; gridX<width; gridX+=20)
    {
      stroke(192);
      line(gridX, 0, gridX, 1000);
    }
    for (int gridY=0; gridY<height; gridY+=20)
    {
      stroke(192);
      line(0, gridY, 1000, gridY);
    }
  }

  void displayPoints() {
    fill(255, 0, 0);
    stroke(255, 0, 0);
    ellipse(pointX, pointY, pointR*2, pointR*2);
  }

  void snake() {
    snakeX[c-1] = x;
    snakeY[c-1] = y;

    for (int i = 0; i<c-1; i++) {
      snakeX[i] = snakeX[i+1];
      snakeY[i] = snakeY[i+1];
    }

    for (int i = 0; i < c; i++) {
      noStroke();
      fill(i*10/2, i*50/5, i*40/25);
      ellipse(snakeX[i], snakeY[i], 10, 10);
    }

    if (x>pointX) {
      x-=speed;
    } else if (x<pointX) {
      x+=speed;
    }
    if (y>pointY) {
      y-=speed;
    } else if (y<pointY) {
      y+=speed;
    }
    displayPoints();
    checkCollision();
  }


  void checkCollision() {
    if (dist(x, y, pointX, pointY)<=7) {
      collide = true;
    }
  }
}

class LevelsMain {
  int y = 160, gap = 120;
  int speed = 5; 
  float gravity = 1; 
  String level;
  boolean fallBool = false, open = true;
  LevelsMenu[] lArray;
  int j = 5, h = 9, timer = 0;

  void setup() {
    lArray = new LevelsMenu[12];
    for (int i = 1; i<5; i++) {
      level = "Level "+i;
      lArray[i] = new LevelsMenu(gap*i, y, level);
    }
    for (int i = 1; i<5; i++) {
      level = "Level "+j;
      lArray[j] = new LevelsMenu(gap*i, y+150, level);
      j++;
    }
    for (int i = 1; i<4; i++) {
      level = "Level "+h;
      if ( h == 11 ) {
        level = "Bonus";
      }
      lArray[h] = new LevelsMenu(gap*i+65, y+300, level);
      h++;
    }
  }

  void draw() {
    background(255);
    lMenu.drawGrid();
    lMenu.drawHeader();
    for (int i = 1; i<lArray.length; i++) {
      lArray[i].display();
      lArray[i].hover();
      lArray[i].fall();
      if (lMenu.open) {
        lArray[i].onOpen();
      }
    }

    if (fallBool) {
      timer++;
      if (timer>=20) {
        stage = 1;
        timer = 0;
        for (int i = 1; i<5; i++) {
          lArray[i].y = 160;
          lArray[i].size = 1;
        }
        for (int i = 5; i<9; i++) {
          lArray[i].y = 160+150;
          lArray[i].size = 1;
        }
        for (int i = 9; i<12; i++) {
          lArray[i].y = 160+150+150;
          lArray[i].size = 1;
        }
        speed = 5;
        fallBool = false;
        open = true;
      }
    }
  }

  void mousePressed() {
    for (int i = 1; i<lArray.length; i++) {
      if (lArray[i].hover()) {
        l = i;
        key='r';
        fallBool = true;
      }
    }
  }

  class LevelsMenu {
    int x, y, size =1;
    String level;
    color c, tmp;
    LevelsMenu( int _X, int _Y, String _L) {
      x = _X;
      y = _Y;
      level = _L;
      if ( level == "Bonus") {
        c = color(204, 204, 0);
      } else {
        c = color(x/5, y/4, x/10);
      }
      tmp = c;
    }

    void display() {
      noStroke();
      fill(c);
      ellipse(x, y, size, size);
      fill(255);
      textAlign(CENTER);
      textSize(20);
      text(level, x, y+7);
    }

    boolean overCircle(int x, int y, int diameter) {
      float disX = x - mouseX;
      float disY = y - mouseY;
      if (sqrt(sq(disX) + sq(disY)) < diameter/2 ) {
        return true;
      } else {
        return false;
      }
    }

    boolean hover() {
      boolean returnValue = false;
      if (overCircle(x, y, size)) {
        c = color(100);
        returnValue = true;
      } else {
        c = tmp;
      }
      return returnValue;
    }

    void fall() {
      if (fallBool) {
        if (y<height+50) {
          y+=speed;
          speed+=gravity;
        }
      }
    }

    void onOpen() {
      if (open) {
        if (size<=90) {
          size+=7;
        } else {
          open = false;
        }
      }
    }
  } 

  void drawHeader() {
    fill(0, 102, 0);
    rectMode(CORNER);
    rect(0, 0, width, 40);
    fill(255);
    textAlign(CENTER);
    textSize(25);
    text("Levels", width/2, 30);
    image(backArrow, 20, 5, 30, 30);
  }

  void drawGrid()
  {
    background(200);
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
}


class HowTo {
  int x = 50, y = 50;
  int x2 = 700, y2 = 50;
  int x3 = 1400, y3 = 50;
  boolean pos1 =false, pos2 = false, pos3 = false;
  boolean clickOnLeftArrow = false, clickOnRightArrow = false;
  void draw() {
    background(120);
    drawGrid();
    drawHeader();
    drawBody1();
    drawBody2();
    drawBody3();
    imageMode(CENTER);
    image(rightArrow,(width/2)+100,height-35,60,46);
    image(leftArrow,(width/2)-100,height-35,60,46);    
    imageMode(CORNER);
    clickOnLeftArrow = overArrow((width/2)-100,height-35,60);
    clickOnRightArrow = overArrow((width/2)+100,height-35,60);
    if(pos() == 3){
      stroke(255,0,0);
      strokeWeight(5);
      line((width/2)+100-30,height-35-20,(width/2)+100+30,height-20);
      line((width/2)+100+30,height-35-20,(width/2)+100-30,height-20);
    }else if(pos() == 1){
      stroke(255,0,0);
      strokeWeight(5);
      line((width/2)-100-30,height-35-20,(width/2)-100+30,height-20);
      line((width/2)-100+30,height-35-20,(width/2)-100-30,height-20);
    }
  }

  int pos() {
    int returnValue = 0;
    if (x == 50) {
      returnValue = 1;
    } else if (x == -600) {
      returnValue = 2;
    } else if (x == -1150) {
      returnValue = 3;
    }
    return returnValue;
  }


  void changePageWithKey() {
    if (keyCode == RIGHT) {
      switch(pos()) {
      case 1:
        x  = -600;
        x2 = 50;
        x3 = 700;
        break;
      case 2:
        x = - 1150;
        x2 = -600;
        x3 = 50;
        break;
      }
    } else if (keyCode == LEFT) {
      switch(pos()) {
      case 2: 
        x = 50;
        x2 = 700;
        x3 = 1250;
        break;
      case 3:
        x = -600;
        x2 = 50;
        x3 = 700;
        break;
      }
    }
  }
   void changePageWithArrow() {
    if (clickOnRightArrow) {
      switch(pos()) {
      case 1:
        x  = -600;
        x2 = 50;
        x3 = 700;
        break;
      case 2:
        x = - 1150;
        x2 = -600;
        x3 = 50;
        break;
      }
    } else if (clickOnLeftArrow) {
      switch(pos()) {
      case 2: 
        x = 50;
        x2 = 700;
        x3 = 1250;
        break;
      case 3:
        x = -600;
        x2 = 50;
        x3 = 700;
        break;
      }
    }
  }
  
    boolean overArrow(int x, int y, int diameter) {
      float disX = x - mouseX;
      float disY = y - mouseY;
      if (sqrt(sq(disX) + sq(disY)) < diameter/2 ) {
        return true;
      } else {
        return false;
      }
    }

  void drawBody1() {
    fill(255);
    textSize(12);
    textAlign(LEFT);
    text("Press 'P' to pause at anytime",x+250,y+20);
    text("Press 'B' to return to the main-menu at anytime",x+250,y+40);
    image(snakeImg,x,y,511,329);   
    textAlign(CENTER); 
    textSize(20);
    text("Borders: \n Similar to borders in any snake game \n But take care in some levels borders can kill you",x+250,y+300);
    text("As a general rule \n anything that moves other than you will probably be lethal",x+250,y+420);
    textSize(15);
    //text("Use the RIGHT and LEFT arrows on your keyboard \n to navigate between the pages and discover the objects",x+250,y+500);
  }

  void drawBody2() {
    fill(255);
    textAlign(CENTER);
    textSize(25);
    image(TurretImg, x2+40, y2-15, 500, 265);
    image(CrusherImg, x2, y2+220, 500, 260);
  }

  void drawBody3() {
    image(TeleporterImg, x3, y3+20,319,132);
    image(MillImg, x3+100, y3+130,500,200);
    image(WaveImg, x3, y3+340,550,145);
  }

  void drawHeader() {
    noStroke();
    fill(50);
    rectMode(CORNER);
    rect(0, 0, width, 40);
    fill(255);
    textAlign(CENTER);
    textSize(25);
    text("How To Play", width/2, 30);
    image(backArrow, 20, 5, 30, 30);
  }

  void drawGrid()
  {
    strokeWeight(1);
    for (int gridX=0; gridX<width; gridX+=20)
    {
      stroke(100);
      line(gridX, 0, gridX, 1000);
    }
    for (int gridY=40; gridY<height; gridY+=20)
    {
      stroke(100);
      line(0, gridY, 1000, gridY);
    }
  }
}


class GameInterface {
  boolean footer = false;
  int mySecond = 0;
  void drawFooter() {
    footer = true;
    noStroke();
    fill(255);
    rectMode(CORNER);
    rect(0, footerY, width, 50);
    mySecond++;
    if (score<5 || mySecond<100) {
      if (footerY>height-50) {
        footerY-=0.5;
      } else if (l<=11) {
        textAlign(CENTER);
        fill(0);
        text("Level: "+l, width/2, height-20);
      } else {
        fill(0);
        text("You completed the game, Congratulations!", width/2, height-20);
      }
    } else if (score>=5 || mySecond>=100) {
      hideFooter();
    }
  }

  void hideFooter() {
    if (footerY<height+50) {
      footerY++;
    }
    footer = false;
  }

  void drawHeader() {
    noStroke();
    fill(0, 192, 0);
    rectMode(CORNER);
    rect(0, 0, width, 40);
    fill(255);
    textAlign(CENTER);
    textSize(20);
    if (randomL ) {
      text("Score: "+score, width/2 - 100, 30);
      text("Seconds: "+(second()-s), width/2+100, 30);
    } else {
      text("Score: "+score, width/2, 30);
    }
    image(backArrow, 20, 5, 30, 30);
    stroke(0);
    strokeWeight(4);
    line(width-40, 10, width-40, 30);
    line(width-25, 10, width-25, 30);
  }

  void drawPause() {
    fill(0, 0, 0, 120);
    rect(0, 0, width, height);
    stroke(255);
    strokeWeight(15);
    line(250, 200, 250, 400);
    line(350, 200, 350, 400);
  }

  void gameOver() {
    background(255, 0, 0);
    noStroke();
    fill(0, 0, 0, 50);
    rect(0, 0, width, height);
    fill(255);
    textAlign(CENTER);
    textSize(40);
    text("You Lose, Gameover!", width/2, height/2-50);
    textSize(20);
    text("Press R to restart", width/2, height/2);
    textSize(15);
    if(randomL){
     text("You scored " + score + " in Bonus", width/2, height/2+40);
    }else{
     text("You scored " + score + " in level "+ l, width/2, height/2+40);
    }
  }

  void win()
  {
    background(0, 255, 0);
    noStroke();
    fill(0, 0, 0, 50);
    rect(0, 0, width, height);
    fill(255);
    textAlign(CENTER);
    textSize(40);
    text("You Win, Congratulations!", width/2, height/2-50);
    textSize(20);
    text("Press R to Go to next level", width/2, height/2);
  }

  void drawGrid()
  {
    background(200);
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
}


class lines
{// *-----------------------------------*//
  float x, y;
  float[] xpos= new float[100], ypos= new float[100];
  float speed=1;
  float faster=5;
  int c=10;
  int direction=0;
  boolean flagfast=false; //the thing that makes the game actually fun
  boolean collide = false;
  lines(float a, float b) {
    for (int i=0; i<100; i++)
    {
      xpos[i]=-10;
      ypos[i]=b+1;
    }
    x=a;
    y=b;
  }
  // *-----------------------------------*//
  // most of this you already know
  void display(boolean xBorder, boolean yBorder)//float max, float min, boolean kill)
  {
    xpos[c]=x;
    ypos[c]=y;
    for (int i=0; i<c-1; i++)
    {
      fill(i*10/2, i*50/5, i*40/25);
      noStroke();
      ellipse(xpos[i], ypos[i], 10, 10);
    }
    ellipse(x, y, 10, 10);

    for (int i=0; i<c; i++)
    {
      xpos[i]=xpos[i+1];
      ypos[i]=ypos[i+1];
    }

    snakeReorient(xBorder, yBorder);
    directionChange();
    collisionDetection();
  }


  void snakeReorient(boolean xBorders, boolean yBorders) {
    if (xBorders) {
      if ( x>width ) {
        x = 0;
      } else if (x<0) {
        x = width;
      }
    } else {
      if ( x>width-20 ) {
        stage = -1;
      } else if (x<20) {
        stage = -1;
      }
    }
    if (yBorders) {
      if (!initiate.footer) {
        if (y>height) {
          y = 45;
        } else if (y<45) {
          y = height;
        }
      } else if (initiate.footer) {
        if (y>height-55) {
          y = 45;
        } else if (y<45) {
          y = height-55;
        }
      }
    } else {
      if (y>height-20) {
        stage = -1;
      } else if (y<40+20) {
        stage = -1;
      }
    }

    if (!yBorders) {
      fill(0);
      noStroke();
      rect(0, 40, width, 20);
      rect(0, height-20, width, 20);
    }
    if (!xBorders) {
      fill(0);
      noStroke();
      rect(width-20, 40, 40, height);
      rect(0, 40, 20, height);
    }
  }

  void directionChange() //Prevents snake from reversing direction
  {
    if (keyCode==UP && direction != 2) {
      direction=1;
    }
    if (keyCode==DOWN && direction != 1) {
      direction=2;
    }
    if (keyCode==RIGHT && direction != 4) {
      direction=3;
    }
    if (keyCode==LEFT && direction != 3) {
      direction=4;
    }
    switch (direction) {
    case 1:
      y-=int(speed); 
      break;   
    case 2:
      y+=int(speed); 
      break;   
    case 3:
      x+=int(speed); 
      break;   
    case 4:
      x-=int(speed); 
      break;
    }
    keyBoost();
  }
  
  void keyBoost()//the golden keyfunction, allows you to get a speed boost until you switch direction
  {
    if (key  == 'z' || key == 'Z')
    {
      flagfast = !flagfast;
      if (flagfast==true) {
        switch (direction) {
        case 1:
          y-=int(faster); 
          break;   
        case 2:
          y+=int(faster); 
          break;   
        case 3:
          x+=int(faster); 
          break;   
        case 4:
          x-=int(faster); 
          break;
        }
      }
    }
  }

  void collisionDetection() //self collision detection
  {
    if (keyCode != 0) {
      for (int i=0; i<c; i++)
      {
        if (dist(x, y, xpos[i], ypos[i])<=0.7) {
          speed=0;
          stage=-1;
        }
      }
    }
  }

  void AI()
  {
    if (snake.x>foodX) {
      snake.x-=6;
    } else if (snake.x<foodX) {
      snake.x+=6;
    }
    if (snake.y>foodY) {
      snake.y-=6;
    } else if (snake.y<foodY) {
      snake.y+=6;
    }
  }

  boolean eaten() {
    if (dist(x, y, foodX, foodY)<=10) {      
      collide = true;
      if (c<50) {
        c+=5;
      }
    }
    return collide;
  }
}



