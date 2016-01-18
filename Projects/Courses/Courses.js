var pos = 0;

var A = [];
var B = [];
var common = [];


var CEConc =  [["106","CSCE 106/1001 - Fundamentals of Computer Science (3 cr.)"],["110","CSCE 110/1101 - Programming Fundamentals (3 cr.)"],["210","CSCE 210/2201 - Data Structures and Algorithms (3 cr.)"],["230","CSCE 230/2301 - Digital Design I (3 cr.)"],["231","CSCE 231/2303 - Computer Organization and Assembly Language Programming (3 cr.)"],["239","CSCE 239L/2302 - Digital Design I Lab (1 cr.)"],["253","CSCE 253/2501 - Fundamentals of Database Systems (3 cr.)"],["321","CSCE 321/3201 - Analysis and Design of Algorithms (3 cr.)"],["330","CSCE 330/3301 - Computer Architecture (3 cr.)"],["332","CSCE 332/3303 - Fundamental Microelectronics (3 cr.)"],["337","CSCE 337/3304 - Digital Design II (3 cr.)"],["339","CSCE 339L/3302 - Computer Architecture Lab (1 cr.)"],["341","CSCE 341/3701 - Software Engineering (3 cr.)"],["345","CSCE 345/3401 - Operating Systems (3 cr.)"],["363","CSCE 363/3611 - Digital Signal Processing (3 cr.)"],["432","CSCE 432/4301 - Embedded Systems (3 cr.)"],["435","CSCE 435/4311 - Wide Area Networks (3 cr.)"],["438","CSCE 438L/4302 - Embedded Systems Lab (1 cr.)"],["439","CSCE 439L/4312 - Wide Area Networks Lab (1 cr.)"],["445","CSCE 445/4411 - Fundamentals of Distributed Systems (3 cr.)"],["490","CSCE 490/4950 - Industrial Training (1 cr.)"],["491","CSCE 491/4980 - Senior Project I (1 cr.)"],["492","CSCE 492/4981 - Senior Project II (2 cr.)"],["215","PHYS 215/2211 - Introduction to Electronics (3 cr.)"],["222","PHYS 222L/2213 - Electronics lab for Computer Scientists & Computer Engineers (1 cr.)"],["307","MGMT 307/3201 - Management Fundamentals (3 cr.)"]];

var CSConc = [["106","CSCE 106/1001 - Fundamentals of Computer Science (3 cr.)"],["110","CSCE 110/1101 - Programming Fundamentals (3 cr.)"],["210","CSCE 210/2201 - Data Structures and Algorithms (3 cr.)"],["230","CSCE 230/2301 - Digital Design I (3 cr.)"],["231","CSCE 231/2303 - Computer Organization and Assembly Language Programming (3 cr.)"],["239","CSCE 239L/2302 - Digital Design I Lab (1 cr.)"],["321","CSCE 321/3201 - Analysis and Design of Algorithms (3 cr.)"],["325","CSCE 325/3104 - Concepts of Programming Languages (3 cr.)"],["330","CSCE 330/3301 - Computer Architecture (3 cr.)"],["339","CSCE 339L/3302 - Computer Architecture Lab (1 cr.)"],["341","CSCE 341/3701 - Software Engineering (3 cr.)"],["345","CSCE 345/3401 - Operating Systems (3 cr.)"],["422","CSCE 422/4201 - Theory of Computing (3 cr.)"],["447","CSCE 447/4101 - Compiler Design (3 cr.)"],["490","CSCE 490/4950 - Industrial Training (1 cr.)"],["491","CSCE 491/4980 - Senior Project I (1 cr.)"]["492","CSCE 492/4981 - Senior Project II (2 cr.)"]];


function getCourse(cID, x){
    console.log(cID);
    switch(cID){
        case "1":
            if(x==1){
                A = CSConc;
            }else{
                B = CSConc;
            }
            break;
        case "2":
            if(x==1){
                A = CEConc;
            }else{
                B = CEConc;
            }
            break;
        case "3":
            break;
        case "4":
            break;
    }
}

function binarySearch(A, top, bottom, req){
    var flag = false;
    var notFound = false;
    do{
        var  m = (top+bottom)/2;
        m = Math.floor(m);
        if (A[m][0] == req) {
            pos = m;
            flag = true;
        }else if(bottom>top){
            notFound = true;
            pos = -1;
        }else if(A[m][0]<req){
            bottom = m+1;
        }else if(A[m][0]>req){
            top = m-1;
        }
    }while(flag == false && notFound == false);
}

function btnSearchCommon(){
    getPos(A,B);
}

function getPos(c1,c2){
    document.getElementById("displayCourses").innerHTML = " ";
    var j = 0;
    for(var i = 0; i<c1.length; i++){
        binarySearch(c1,c1.length,0,c2[i][0]);
        if(pos!=-1){
            j++;
          document.getElementById("displayCourses").innerHTML += "<br/> &nbsp; <b>" + j + ". " + c2[pos][1] + "<hr>";
        }
    }
}
