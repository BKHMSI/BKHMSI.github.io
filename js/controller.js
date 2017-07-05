var app = angular.module("Portfolio", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
        // route for auc home page
        .when('/', {
              templateUrl : 'views/home.html',
              controller  : 'MainController'
         })

        .when('/projects', {
              templateUrl : 'views/projects.html',
              controller  : 'MainController'
        })

        .when('/blog', {
              templateUrl : 'views/blog.html',
              controller  : 'MainController'
        })
});

app.controller('MainController', ['$scope', '$window', function($scope,$window) {

    var shrink = 4;
    $scope.projects_sz = shrink;

    $scope.experience = [
      {
        image: "images/experience/stonybrook.jpg",
        title: "Semester abroad in Stony Brook University, New York, United States",
        date: "Fall 2016",
        desc: "Studying abroad for a semester during Fall 2016 in SBU"
      },
      {
        image: "images/experience/microsoft.jpg",
        title: "SDE Intern at Microsoft Advanced Technology Lab in Cairo",
        date: "June to Aug 2015 and January 2016",
        desc: "I worked with the Language Understanding Intelligent Service (LUIS) team during both of my internships"
      },
      {
        image: "images/experience/auc.png",
        title: "Undergraduate teaching assistant in The American University in Cairo",
        date: "Fall 2015 and Spring 2016",
        desc: "Assist instructor of Programming Fundamentals class in setting the syllabus, designing exams, grading assignments and projects. Hold regular office hours to help students"
      },
    ]

    $scope.projects = [
    {
      image:"images/projects/sketchback.png",
      name:"Sketch Back",
      link:"https://github.com/BKHMSI/Sketchback#sketchback-convolutional-sketch-inversion-using-keras",
      desc:"Sketch inversion of faces and building sketches using deep convolutional neural networks",
      tags:"Vision,ML,Python,Research"
    },
    {
      image:"images/projects/korastak.png",
      name:"Korastak",
      link:"http://korastak.com/#/",
      desc:"Document sharing platform called Korastak (means: Your Notebook in Arabic) for students in my univresity to be able to share notes easily with each other",
      tags:"JS,Angular,Firebase,HTML,CSS,PHP,Platform"
    },
    {
      image:"images/projects/eigenfaces.png",
      name:"Eigen Faces",
      link:"https://github.com/BKHMSI/Eigenfaces",
      desc:"Facial Detection and Recognition using Singular Value Decomposition",
      tags:"Vision,ML,Linear Algebra,Python"
    },
    {
      image:"images/projects/mips_sim.png",
      name:"MIPS R400 Pipelined Simulator",
      link:"https://bkhmsi.github.io/mips-r4000-sim/#/editor",
      desc:"Online assembler and simulator for the ARM-Thumb ISA. Support many features including debugging and GFX display. You can save your assembly projects on the website",
      tags:"JS,CPU,Architecture,HTML,CSS,MIPS,Assembly"
    },
    {
      image:"images/projects/scripty.png",
      name:"Scripty",
      link:"https://github.com/BKHMSI/Scripty",
      desc:"Scripty is an Amazon Alexa skill that teaches children how to code using voice commands.",
      tags:"Alexa,Amazon,NodeJS,Lambda,Hackathon"
    },
    {
      image:"images/projects/sa7_wala_ghalat.png",
      name:"Doum Trivia Bot",
      link:"https://github.com/BKHMSI/Doum_Trivia_Bot",
      desc:"True or False trivia game Messenger Bot for Doum Cultural Foundation",
      tags:"JS,NodeJS,Messenger,Bot,Heroku"
    },
    {
      image:"images/projects/graphs.png",
      name:"Graph Builder",
      link:"https://bkhmsi.github.io/Graph_Builder/",
      desc:"Web application for graph lovers: build customizable graphs or use pre-sets and run algorithms (DFS,BFS) on them",
      tags:"Processing,Visualization,JS,HTML,CSS"
    },
    {
      image:"images/projects/assembler.png",
      name:"Assembler & Simulator",
      link:"https://bkhmsi.github.io/ARMThumb_Sim/#/",
      desc:"Online assembler and simulator for the ARM-Thumb instruction set architecture. Support many features including debugging and GFX display",
      tags:"JS,Angular,Firebase,HTML,CSS,ARM,Assembly"
    },
    {
      image:"images/projects/quicky.png",
      name:"Quicky: Chrome Extension",
      link:"https://chrome.google.com/webstore/detail/quicky/kjcffaoelnehhcdgfnmdeomnmafmiomj",
      desc:"Quicky is a chrome extension that allows you to share links and quick posts on the fly",
      tags:"Chrome,Web Extension,Extension,JS,HTML,CSS"
    },
    {
      image:"images/projects/collage.png",
      name:"PhotoGenerator",
      link:"",
      desc:"Generating a selected image using small number of selected images",
      tags:"Processing, Image Processing, Java"
    },
    {
      image:"images/projects/tictactoe.png",
      name:"TicTacToe",
      link:"",
      desc:"Implementing a minimax A.I. for TicTacToe with variable board size",
      tags:"Web,JS,Game,ProcessingJS,HTML,CSS,A.I."
    },
    {
      image:"images/projects/snake.png",
      name:"Snake-حنش",
      link:"https://bkhmsi.github.io/Snake/",
      desc:"Re-imagined snake game using ProcessingJS. One of my first projects that I am really proud of, done before joining university",
      tags:"ProcessingJS,JS,HTML,CSS,Game"
    }
  ];
}]);

var animateScroll = function(){
   $('#scroll a span').animate({'top': '10px'}, {
    duration: 1000, 
    complete: function() {
        $('#scroll a span').animate({top: 0}, {
            duration: 1000, 
            complete: animateScroll});
    }});
}

$(document).on('scroll', function() {
    // do your things like logging the Y-axis
    var hover = {
      "-webkit-transition":"all .5s ease-in-out",
      "-moz-transition":"all .5s ease-in-out",
      "-o-transition":"all .5s ease-in-out",
      "transition":"all .5s ease-in-out",
      "-webkit-box-shadow": "0px 0px 10px 0px rgba(255,255,255,0.75)",
      "-moz-box-shadow": "0px 0px 10px 0px rgba(255,255,255,0.75)",
      "box-shadow": "0px 0px 10px 0px rgba(255,255,255,0.75)",
      "background-color": "rgb(34,34,34)",
      "color":"white"
    }
});

$(function() {
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});

// $scope.expandProjects = function(){
//     $scope.projects_sz = $scope.projects_sz  == shrink ? $scope.projects.length:shrink;
//     if($scope.projects_sz != shrink){
//       $('html, body').animate({
//         scrollTop: $('#four').offset().top
//       }, 1000);
//       $('#scroll a span.s').css('transform','rotate(180deg)');
//     }else{
//       $('html, body').animate({
//         scrollTop: $('#three').offset().top
//       }, 1000);
//       $('#scroll a span.s').css('transform','rotate(0deg)');
//     }
// };
