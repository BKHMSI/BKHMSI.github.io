Board board;
AI aiPlayer;
Grid[][] grid;
int gridSize = 3;
boolean turn = false;
PImage xImg, oImg;
/* @pjs preload="xImg.png,oImg.png"; */
void setup() {
  size(600, 600);
  smooth();
  board = new Board(gridSize);
  aiPlayer = new AI();
  grid = new Grid[gridSize][gridSize];
  xImg = loadImage("xImg.png");
  oImg = loadImage("oImg.png");
  for (int x = 0, i = 0; x<width; x+=width/gridSize, i++) {
    for (int y = 0, j = 0; y<height; y+=height/gridSize, j++) {
      grid[i][j] = new Grid(x, y, width/gridSize);
    }
  }
}

void draw() {
  background(255);
  for (int i = 0; i<gridSize; i++) {
    for (int j = 0; j<gridSize; j++) {
      grid[i][j].display();
    }
  }
  if (turn)
    aiPlay();
}

void aiPlay() {
  AI.AIMove move = aiPlayer.makeMove(board, player_2);
  turn = false;
  grid[move.x][move.y].setCell(false);

  int result = board.checkWin(player_1);
  
//  switch(result) {
//  case draw:
//    printResult("Draw!!");
//    break;
//  case win:
//    printResult("You Win!!");
//    break;
//  case lose:
//    printResult("Computer Wins!!");
//    break;
//  default:
//    printResult("");
//    break;
//  }
}

void keyPressed() {
  if (keyCode == ENTER)
    playAgain();
  else if(key == 'f' || key == 'F')
    setGridSize(4);
  else if(key == 'g' || key == 'g')
    setGridSize(5);
}

void playAgain() {
  board.clearBoard();
  //printResult("");
  for (int i = 0; i<gridSize; i++)
    for (int j = 0; j<gridSize; j++)
      grid[i][j].empty = true;
}

void setGridSize(int sz) {
  playAgain();
  gridSize = sz;
  board = new Board(gridSize);
  grid = new Grid[gridSize][gridSize];
  for (int x = 0, i = 0; x<width; x+=width/gridSize, i++) {
    for (int y = 0, j = 0; y<height; y+=height/gridSize, j++) {
      grid[i][j] = new Grid(x, y, width/gridSize);
    }
  }
}

void mousePressed() {
  if (board.checkWin(player_1) == nothing) {
    for (int i = 0; i<gridSize; i++) {
      for (int j = 0; j<gridSize; j++) {
        if (grid[i][j].overRect() && !turn) {
          if (board.isEmpty(i, j)) {
            grid[i][j].setCell(true);
            turn = true;
            board.setVal(i, j, player_1);
          }
        }
      }
    }
  }
}
class AI{
  int inf = 100000;
  class AIMove{
    int x,y,score;
    AIMove(){}
    AIMove(int _s){score = _s;}
    AIMove(int _x, int _y){x = _x; y = _y; score = 0;}
    AIMove(int _x, int _y, int _s){x = _x; y = _y; score = _s;}
  }
  
  AIMove makeMove(Board board, int player){
    AIMove bestMove = getBestMove(board, new AIMove(-inf), new AIMove(inf),7,player);
    board.setVal(bestMove.x,bestMove.y,player);
    return bestMove;
  }
  
  private AIMove getBestMove(Board board, AIMove alpha, AIMove beta, int depth, int player){
    int gameState = board.checkWin(player);
    if(gameState == win){
        return new AIMove(10);
    }else if(gameState == lose){
        return new AIMove(-10);
    }else if(gameState == draw || depth == 0){
        return new AIMove(0);
    }
    
    if(player == player_1){
        for (int i = 0; i<board.getSize(); i++) {
            for (int j = 0; j<board.getSize(); j++) {
                if(board.isEmpty(i,j)){
                    AIMove move = new AIMove(i,j);
                    board.setVal(i, j, player);
                    move.score = getBestMove(board, alpha, beta, depth-1, player_2).score;
                    board.setVal(i,j,empty);
                    if (move.score > alpha.score)
                        alpha = move;
                    if(alpha.score>=beta.score)
                        return alpha;
                }
            }
        }
        return alpha;
    }else{
        for (int i = 0; i<board.getSize(); i++) {
            for (int j = 0; j<board.getSize(); j++) {
                if(board.isEmpty(i,j)){
                    AIMove move = new AIMove(i,j);
                    board.setVal(i, j, player);
                    move.score = getBestMove(board, alpha, beta, depth-1, player_1).score;
                    board.setVal(i,j,empty);
                    if (move.score < beta.score)
                        beta = move;
                    if(alpha.score>=beta.score)
                        return beta;
                }
            }
        }
        return beta;
    }
  }
}

class Grid{
  int x, y, size;
  boolean isX, empty;
  Grid(int _x, int _y, int sz){
    x = _x; y = _y; size = sz;
    isX = true;
    empty = true;
  }
  
  void display(){
    if(!overRect())  fill(255);
    else   fill(240);
    stroke(0);
    strokeWeight(2);
    rect(x,y,size,size);
    drawText();
  }
  
  void setCell(boolean flag){
    empty = false;
    isX = flag;
  }
  
  void drawText(){
    if(!empty){
      imageMode(CENTER);
      if(isX)
        image(xImg, x+size/2,y+size/2,size/2,size/2);
      else
        image(oImg, x+size/2,y+size/2,size/2,size/2);
    }
  }
  
 boolean overRect(){
    if(mouseX>=x && mouseX<=x+size && mouseY>=y && mouseY<=y+size)  
      return true;
    else 
      return false;
  }
}
int player_1 = 1, player_2 = 2, empty = 0;
int nothing = -1, win = 10, lose = -10, draw = 1;

class Board {
  int size, count;
  boolean turn;
  char[][] matrix;
  
  Board(){
    size = 3;
    turn = false;
    count = 0;
    matrix = new char[size][size];
    initMatrix();
  }
  
  Board(int sz) {
    size = sz;
    turn = false;
    count = 0;
    matrix = new char[size][size];
    initMatrix();
  }
  
  void initMatrix(){
    for(int i = 0; i<size; i++){
       for(int j = 0; j<size; j++){
          matrix[i][j] = ' ';
      }
    }
  }

  void setVal(int x, int y, int p) {
    if (p!=empty) {
      matrix[x][y] = p == player_1 ? 'X':'O'; 
      count++;
    } else {
      matrix[x][y] = ' '; 
      count--;
    }
  }

  int checkWin(int p) {
    if (count == size*size)
      return draw;

    // Check Horizontal
    for (int j = 0; j<size-1; j++)
      if (checkH(j))
        return p != player_1 ? win:lose;

    // Check Vertical
    for (int j = 0; j<size; j++)
      if (checkV(j))
        return p != player_1 ? win:lose;

    // Check Diagonal Left to Right
    if (checkD1())
      return p != player_1 ? win:lose;

    // Check Diagonal Right to Left
    if (checkD2())
      return p != player_1 ? win:lose;

    return nothing;
  }

  boolean checkH(int j) {
    for (int i = 0; i<size-1; i++)
      if (matrix[j][i] != matrix[j][i+1] || matrix[j][i] == ' ')
        return false;
    return true;
  }

  boolean checkV(int j) {
    for (int i = 0; i<size-1; i++)
      if (matrix[i][j] != matrix[i+1][j] || matrix[i][j] == ' ')
        return false;
    return true;
  }

  boolean checkD1() {
    for (int i = 0; i<size-1; i++)
      if (matrix[i][i] != matrix[i+1][i+1] || matrix[i][i] == ' ')
        return false;
    return true;
  }

  boolean checkD2() {
    for (int i = 0; i<size-1; i++)
      if (matrix[i][size-1-i] != matrix[i+1][size-i-2] || matrix[i][size-1-i] == ' ')
        return false;
    return true;
  }
  
  int getSize(){
    return size;
  }
  
  boolean isEmpty(int x, int y){
      return matrix[x][y] == ' ';
  }

  void clearBoard() {
    count = 0;
    for (int i = 0; i<size; i++)
      for (int j = 0; j<size; j++)
        matrix[i][j] = ' ';
  }
}

