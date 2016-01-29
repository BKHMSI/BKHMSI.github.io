int sz = 20;
int vSz = 0;
int eSz = 0;
int btnSz = 9;
int draggedNode = -1; // To Prevent Overlap when Dragging
boolean addingEdge = false;
boolean nodeSelected = false;
float ex = 0, ey = 0, exx = 0, eyy = 0;
int eSt = -1, eEnd = -1;
boolean isTraversing = false;
int[][]adjMatrix;
boolean[]vis;
int val[];
int order = 0, counter = 0;
String status = "Hi There!! Select an Action to Begin Building";

Vertex[]nodes; 
Edge[]edges;
Button[]buttons;

float timer, stopwatch;
boolean draggingEdge = false;



void setup() {
  size(700, 600);
  smooth();
  nodes = new Vertex[sz];
  vis = new boolean[sz];
  val = new int[sz];
  edges = new Edge[sz*sz];
  buttons = new Button[btnSz];
  createButtons();
  adjMatrix = new int[sz][sz];
  for (int i = 0; i<sz; i++) for (int j = 0; j<sz; j++) adjMatrix[i][j] = 0;
  for (int i = 0; i<sz; i++) {
    nodes[i] = new Vertex(-100, -100, i+1);
  }
}

void draw() {
  background(200);
  drawGrid();
  
  for (int i = 0; i<eSz; i++) {
    edges[i].drawEdge();
  }
  
  for (int i = 0; i<vSz; i++) {
    nodes[i].drawVertex();
  }
 

  timer = millis();
  if (isTraversing) {
    if (abs(timer-stopwatch)>500) {
      nodes[val[counter++]].changeColor(color(34, 53, 26));
      stopwatch = millis();
    }
    if (counter>order) {
      order = counter = 0;
      isTraversing = false;
      dfsFlag = false;
      status = "Algorithm Finished Running";
      printStatus("Algorithm Finished Running");
    }
  }
  
  if(draggingEdge){
      stroke(0);
      strokeWeight(2);
      line(ex,ey,mouseX,mouseY);
  }
  //
  // drawStatus();
  //
  //  // Draw Buttons
  //  for (int i = 0; i<btnSz; i++) {
  //    buttons[i].display();
  //  }
}

void drawGrid()
{
  strokeWeight(1);
  for (int gridX=0; gridX<width; gridX+=50)
  {
    stroke(192);
    line(gridX, 0, gridX, 1000);
  }
  for (int gridY=40; gridY<height; gridY+=50)
  {
    stroke(192);
    line(0, gridY, 1000, gridY);
  }
}

void drawStatus() {
  fill(0, 220);
  rect(0, 0, width, 50);
  textAlign(CENTER);
  fill(255);
  text("Status: "+status, width/2, 30);
}

void createButtons() {
  String[] title = {
    "Add Node", "Add Edge", "Clear", "Tree", "Graph", "DFS", "BFS", "DIJ", "KRU"
  };
  float x = 100, y = height-50;
  for (int i = 0; i<btnSz; i++) {
    if (i%5==0 && i!=0) x = 150;
    if (i<5) {
      buttons[i] = new Button(x, y - 50, 90, 40.0, title[i]);
    } else {
      buttons[i] = new Button(x, y, 90, 40.0, title[i]);
    }
    x+=100;
  }
}

void mouseDragged() {
  if (!addingEdge) {
    for (int i = 0; i<sz; i++) {
      if (draggedNode == -1 || draggedNode == i)
        if (nodes[i].overCircle()) {
          for (int j = 0; j<eSz; j++) {
            if (edges[j].st == nodes[i].tag) {
              edges[j].moveStart(mouseX, mouseY);
            } else if (edges[j].end == nodes[i].tag) {
              edges[j].moveEnd(mouseX, mouseY);
            }
          }
          nodes[i].move(mouseX, mouseY);
          nodes[i].isDragged = true;
          draggedNode = i;
        } else {
          nodes[i].isDragged = false;
          draggedNode = -1;
        }
    }
  }
}

void addToMatrix(int i, int j, int w) {
  adjMatrix[i][j] = w;
  adjMatrix[j][i] = w;
}

void printAdjMatrix() {
  for (int i = 0; i<sz; i++) {
    for (int j = 0; j<sz; j++) {
      print(adjMatrix[i][j]+" ");
    }
    print('\n');
  }
}

void setEdgeWeight(int w) {
  edges[eSz++] = new Edge(ex, ey, exx, eyy, eSt, eEnd, w);
  addingEdge = false;
  addToMatrix(eSt-1, eEnd-1, w);
  printStatus("Edge added");
}

void keyPressed() {
  if (key == 'e' || key == 'E') {
    addingEdge = true;
    status = "Adding edge, select parent vertex";
  } else if (keyCode >= '1' && keyCode <= '9' && addingEdge) {
    edges[eSz++] = new Edge(ex, ey, exx, eyy, eSt, eEnd, keyCode-48);
    addingEdge = false;
    addToMatrix(eSt-1, eEnd-1, keyCode-48);
    printStatus("Edge added");
    status = "Edge added";
  } else if (keyCode == RETURN || keyCode == ENTER ) {
    addNode();
  } else if (key == 'p' || key == 'P') {
    printAdjMatrix();
  } else if (key == 'd' || key == 'D') {
    isTraversing = true;
    stopwatch = millis();
    falseVis();
    dfs(0);
  } else if (key == 'g' || key == 'G') {
    generateGraph();
  } else if (key == 't' || key == 'T') {
    generateTree();
  }else if(key == 'X' || key == 'x'){
    print(exportAdjMatrix());
  }
}

void mousePressed() {
  // Adding Edge
  if (addingEdge && eSz+2<sz)
    addEdge();
    
  //
  //  for (int i = 0; i<btnSz; i++) {
  //    if (buttons[i].overRect()) {
  //      switch(i) {
  //      case 0:
  //         addNode();
  //        break;
  //      case 1:
  //        printStatus("Adding edge, select parent vertex");
  //        status = "Adding edge, select parent vertex";
  //        break;
  //      case 2:
  //         clearCanvas();
  //         printStatus("Canvas Cleared");
  //         status = "Canvas Cleared";
  //        break;
  //      case 3:
  //         generateTree();
  //         printStatus( "Binary Tree Added");
  //         status = "Binary Tree Added";
  //        break;
  //      case 4:
  //        generateGraph();
  //        printStatus("Graph Added");
  //        status = "Graph Added";
  //        break;
  //      case 5:
  //        printStatus("Running DFS");
  //        status = "Running DFS";
  //        dfs(0);
  //        break;
  //      case 6:
  //        isTraversing = true;
  //        bfs(0);
  //        break;
  //       case 7:
  //        status = "Dijkestra still not available";
  ////        isTraversing = true;
  ////        status = "Running Dijkestra";
  ////        stopwatch = millis();
  ////        dij(0);
  //        break;
  //       case 8:
  //        status = "Kruskal still not available";
  //        break;
  //      }
  //    }
  //  }
}

void mouseReleased() {
  for (int i = 0; i<sz; i++) {
    nodes[i].isDragged = false;
  }
}

void setAddingEdge(boolean flag) {
  addingEdge = flag;
}

void addEdge() {
  for (int i = 0; i<sz; i++) {
    if (nodes[i].overCircle()) {
      if (!nodeSelected) {
        ex = nodes[i].x;
        ey = nodes[i].y;
        eSt = nodes[i].tag;
        nodes[i].isDragged = true;
        draggingEdge = true;
        printStatus("Vertex "+nodes[i].tag+" selected, then select child vertex");
        status = "Vertex "+nodes[i].tag+" selected, then select child vertex";
      } else {
        exx = nodes[i].x;
        eyy = nodes[i].y;
        eEnd = nodes[i].tag;
        nodes[i].isDragged = true;
        if (eEnd == eSt) {
          printStatus("You must choose another vertex");
          status = "You must choose another vertex";
        } else {
          draggingEdge = false;
          printStatus("Vertex "+nodes[i].tag+" selected, enter a weight to add edge");
          status = "Vertex "+nodes[i].tag+" selected, choose a weight (1 to 9) to add edge";
          displayPrompt();
        }
      }
      nodeSelected = !nodeSelected;
    }
  }
}

void addNode() {
  nodes[vSz++].setPos(random(width), random(height-200));
  printStatus("Node "+vSz+" added");
  status = "Node "+vSz+" added";
}

void readAdjMatrix() {
  int size = 0;
  for (int i = 0; i<size; i++) {
    for (int j = 0; j<size; j++) {
      // addToMatrix(i,j,A[i][j]);
    }
  }
}

void generateGraph() {
  nodes[vSz++].setPos(100, 100);
  nodes[vSz++].setPos(200, 100);
  nodes[vSz++].setPos(250, 300);
  nodes[vSz++].setPos(350, 200);
  edges[eSz++] = new Edge(100, 100, 200, 100, 1, 2, 4);
  edges[eSz++] = new Edge(200, 100, 250, 300, 2, 3, 1);
  edges[eSz++] = new Edge(100, 100, 250, 300, 1, 3, 5);
  edges[eSz++] = new Edge(200, 100, 350, 200, 2, 4, 4);
  addToMatrix(0, 1, 4);
  addToMatrix(1, 2, 1);
  addToMatrix(0, 2, 5);
  addToMatrix(1, 3, 4);
}

void generateTree() {
  int startY = 150;
  nodes[vSz++].setPos(width/2, startY);
  nodes[vSz++].setPos(width/2-100, startY+100);
  nodes[vSz++].setPos(width/2+100, startY+100);
  nodes[vSz++].setPos(width/4, startY+200);
  nodes[vSz++].setPos(width/4+120, startY+200);
  nodes[vSz++].setPos((3*width/4)-120, startY+200);
  nodes[vSz++].setPos((3*width/4), startY+200);
  edges[eSz++] = new Edge(width/2, startY, width/2-100, startY+100, 1, 2, 1);
  edges[eSz++] = new Edge(width/2, startY, width/2+100, startY+100, 1, 3, 1);
  edges[eSz++] = new Edge(width/2-100, startY+100, width/4, startY+200, 2, 4, 1);
  edges[eSz++] = new Edge(width/2-100, startY+100, width/4+120, startY+200, 2, 5, 1);
  edges[eSz++] = new Edge(width/2+100, startY+100, (3*width/4)-120, startY+200, 3, 6, 1);
  edges[eSz++] = new Edge(width/2+100, startY+100, (3*width/4), startY+200, 3, 7, 1);

  addToMatrix(0, 1, 1);
  addToMatrix(0, 2, 1);
  addToMatrix(1, 3, 1);
  addToMatrix(1, 4, 1);
  addToMatrix(2, 5, 1);
  addToMatrix(2, 6, 1);
}

void clearCanvas() {
  vSz = eSz = 0;
  for (int i = 0; i<sz; i++) for (int j = 0; j<sz; j++) adjMatrix[i][j] = 0;
}

String exportAdjMatrix(){
   String out = "\n ";
   for(int i = 0; i<vSz; i++){
      for(int j = 0; j<vSz; j++){
          out+=(" "+adjMatrix[i][j]+" ");
     } 
     out+="\n";
   } 
   return out;
}

boolean dfsFlag = false;

void dfs(int node) {
  if(!dfsFlag){isTraversing = true;falseVis();stopwatch = millis();dfsFlag = true;}
  vis[node] = true;
  val[order++] = node;
  for (int i = 0; i<vSz; i++) {
    if (adjMatrix[node][i] != 0 && !vis[i]) {
      dfs(i);
    }
  }
}

void bfs(int node){
   Queue q = new Queue(100);
   falseVis();
   q.push(node);
   vis[node] = true;
   isTraversing = true;
   stopwatch = millis();
   order = 0;
   while(!q.isEmpty()){
     int k = q.front();
     q.pop();
     val[order++] = k;
     for(int i = 0; i<vSz; i++){
       if(adjMatrix[k][i] != 0){
           if(!vis[i]){
               q.push(i);
               vis[i] = true;
           }
       }
     }
   }
}


void dij(int st){
  int[]dist;
  dist = new int[vSz];
  for (int i = 0; i<vSz; i++) dist[i] = 100000;
  falseVis();
  dist[st] = 0;
  PriorityQueue pq = new PriorityQueue();
  pq.push(new Pair(0,st));
    while (!pq.isEmpty()) {
        int v = pq.top();
        pq.pop();
        if (vis[v]) continue;
        vis[v] = true;;

        for(int j = 0; j<vSz; j++){
            if (!vis[j] && adjMatrix[v][j] !=0){
                if(dist[v]+adjMatrix[v][j] < dist[j]){
                    dist[j] = dist[v] + adjMatrix[v][j];
                    pq.push(new Pair(-dist[j],j));
                    val[order++] = v;
                }
            }
        }
    }
  
}

void falseVis() {
  for (int i = 0; i<vSz; i++) {
    vis[i] = false;
    val[i] = 0;
  }
}
class Vertex {
  float x, y, radius;
  boolean isDragged;
  boolean inProcess;
  color c;
  int tag;
  Vertex(float _x, float _y, int _t) {
    x = _x;
    y = _y;
    radius = 50;
    isDragged = false;
    inProcess = false;
    tag = _t;
  }

  Vertex(float _x, float _y, float _r, int _t) {
    x = _x;
    y = _y;
    radius = _r;
    tag = _t;
  }
  
  void setPos(float _x, float _y){
    x = _x;
    y = _y;
  }
  
  void changeColor(color _c){
    c = _c;
  }
  void move(float _x, float _y) {
    x = _x;
    y = _y;
    isDragged = true;
  }

  void drawVertex() {
    if(!isTraversing){
    if(!isDragged) c = color(255, 0, 0);
    else c = color(0, 255, 0); 
    }
    fill(c);
    stroke(0);
    ellipse(x, y, radius, radius);
    fill(255);
    textAlign(CENTER);
    text(tag,x,y+4);
  }

  boolean overCircle() {
    float disX = x - mouseX;
    float disY = y - mouseY;
    if (sqrt(sq(disX) + sq(disY)) < radius ) {
      return true;
    } else {
      return false;
    }
  }
}

class Edge {
  float x, y, xx, yy, w;
  int st, end;
  Edge(float _x, float _y, float _xx, float  _yy) {
    x = _x;
    y = _y;
    xx = _xx;
    yy = _yy;
    w = 1;
    st = end = -1;
  }

  Edge(float _x, float _y, float _xx, float  _yy, int _st, int _e, int _w) {
    x = _x;
    y = _y;
    xx = _xx;
    yy = _yy;
    w = _w;
    st = _st;
    end = _e;
  }

  void moveStart(float _x, float _y){
    x = _x;
    y = _y;
  }
  
  void moveEnd(float _xx, float _yy){
    xx = _xx;
    yy = _yy;
  }
  
  void move(float _x, float _y, float _xx, float  _yy) {
    x = _x;
    y = _y;
    xx = _xx;
    yy = _yy;
  }
  
  void drawEdge() {
    fill(0);
    stroke(0);
    strokeWeight(2);
    text(w,((x+xx)/2),((y+yy)/2)-10);
    line(x, y, xx, yy);
  }
}

class Button{
  float x, y, w, h;
  color c;
  String txt;
  Button(float _x, float _y, float _w, float _h, String s){
    x = _x; y = _y; w = _w; h = _h; txt = s;
    c = color(random(200), random(200), random(200));
  }
  
  void display(){
    if(overRect()){
      fill(c,180);
    }else{
      fill(c);
    }
    rect(x,y,w,h);
    fill(255);
    textAlign(CENTER);
    text(txt,x+w/2,y+4+h/2);
  }
  
  boolean overRect(){
    if(mouseX>=x && mouseX<=x+w && mouseY>=y && mouseY<=y+h)  return true;
    else return false;
  }
}

class Queue{
  int[]arr;
  int head, tail, count, size;

   Queue(){
    size = 50;
    arr = new int[size];
    head = 1;
    tail = count = 0;
  }
  
  Queue(int sz){
    size = sz;
    arr = new int[size];
    head = 1;
    tail = count = 0;
  }
  
  boolean isFull(){return count>=size;}
  boolean isEmpty(){return count == 0;}
  
  void push(int w){
    if(!isFull()){
        tail = (tail+1)%size;
        arr[tail] = w;
        count++;
    }else println("Queue is Full!!"); 
  }
  
  void pop(){
      if(!isEmpty()){
          head = (head+1)%size;
          count--;
      }else println("Queue is Empty");
  }
  
  int front(){
    if(!isEmpty()) return arr[head];
    else return -1;
  }
  
  int getSize(){return count;}
}

class PriorityQueue{
  Pair[]arr; int size, idx, minVal = -10000; 
  PriorityQueue(){
    size = 100;
    arr = new Pair[size];
    for(int i = 0; i<size; i++) arr[i] = new Pair(0,0);
    idx = 0;
    arr[0].a = minVal;
  }
  
  void push(Pair v){
    arr[idx++] = v;
    upheap(v.a);
  }
  
  void pop(){
    arr[1] = arr[idx--];
    downheap(1);
  }
  
  void upheap(int k){
   Pair v = arr[k];
    while (arr[k/2].a >= v.a) {
        arr[k]= arr[k/2];
        k/=2;
    }
    arr[k] = v;
  }
  
  void downheap(int k){
    int j = 2*k;
    Pair v = arr[k];
    while (j<=idx) {
        if((j<idx)&&(arr[j].a>arr[j+1].a))
            j++;
        if(v.a <= arr[j].a)
            break;
        arr[j/2] = arr[j];
        j*=2;
    }
    arr[j/2] = v;
  }
  
  int top(){return arr[1].b;}
  boolean isEmpty(){return idx == 0;}
}

class Pair{
  int a, b;
  Pair(){}
  Pair(int _a, int _b){a = _a; b = _b;}
}

