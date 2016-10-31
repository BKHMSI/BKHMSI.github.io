app.controller('MainController', ['$scope', '$window', function($scope,$window) {
  
  
  $scope.nav = ["Education","Experience","Skills","Projects","Contact"];
  $scope.mobile = false;
  
  $scope.education = [
    {
     name:"American University in Cairo",
     sub:"(Bachelor of Science)",
     location:"Cairo Egypt",
     from:"September 2014",
     to:"Present",
     desc:"Expecting to graduate in May 2019. Current GPA 4.0. Majoring in Computer Engineering with additional coursework in Computer Science and the humanities. ",
     color:"white",
     textColor:"black-text"
    },
    {
     name:"Stony Brook University",
     sub:"(Semester Abroad)",
     location:"New York, United States",
     from:"Fall 2016",
     to:"",
     desc:"Studying abroad during Fall 2016 in SBU. Taking Computer Vision and A.I. among other things",
     color:"white",
     textColor:"black-text"
    },
    {
      name:"Manor House School",
      sub:"(IGCSE)",
      location:"Cairo Egypt",
      from:"June 2014",
      to:"",
      desc:"General Certificate of Education - Advanced Levels in Computing, Mathematics and Arabic, and Advanced Subsidiary Levels in Physics and Chemistry.",
      color:"white",
      textColor:"black-text"
    }
  ];
  
  $scope.experience = [
    {
      title:"SDE Intern",
      org:"Microsoft ATL Cairo",
      location:"Cairo Egypt",
      from:"January 2016",
      to:'',
      desc:"Interning at Microsoft Advanced Technology Lab in Cairo for a month in January 2016 working with the LUIS Team",
      color:"white",
      textColor:"black-text",
      break:true
    },
    {
      title:"Undergrad Teaching Assistant",
      org:"American University in Cairo",
      location:"Cairo Egypt",
      from:"September 2015",
      to:"June 2016",
      desc:"Assist instructor of Programming Fundamentals class in setting the syllabus, designing exams, grading assignments and projects. Hold regular office hours to help students.",
      color:"white",
      textColor:"black-text",
      break:false
    },
    {
      title:"SDE Summer Intern",
      org:"Microsoft ATL Cairo",
      location:"Cairo Egypt",
      from:"June 2015",
      to:"August 2015",
      desc:"Designed and Implemented a feature; Application importing and exporting in Microsoft Language Understanding Intelligent Service (LUIS).",
      color:"white",
      textColor:"black-text",
      break:true
    }
  ];

  $scope.activities = [
    {
      resp: "Organizer",
      org: "Creative Coding Cairo",
      location:"Cairo Egypt",
      from: "July 2016",
      to: "Present",
      desc:"Volunteer in Creative Coding Cairo under FabLab Egypt. Organize monthly meet ups for the community.",
      link:"Check out <a href='http://ccc.fablabegypt.com'>Creative Coding Cairo</a>",
      color:"white",
      textColor:"black-text"
    },
    {
      resp: "Competitor",
      org: "ACM",
      location:"Alexandria Egypt",
      from: "November 2015",
      to: "",
      desc:"Competitor in the 2015 Egyptian Collegiate Programming Contest (ECPC)",
      link:"",
      color:"white",
      textColor:"black-text"
    },
    {
      resp: "Organizer",
      org: "CSEA",
      location:"Cairo Egypt",
      from: "Fall 2015",
      to: "Spring 2016",
      desc:"Member in the academic and entertainment committees in the Computer Science and Engineering Association at AUC, assist in organizing workshops, sessions and talks related to different fields in Computer Science and Engineering. Organize trips and events for the CSCE department at AUC.",
      link:"",
      color:"white",
      textColor:"black-text"
    },
    {
      resp: "Volunteer",
      org: "Doum Culture Foundation",
      location:"Cairo Egypt",
      from: "2012",
      to: "May 2016",
      desc:"Developed a Database System for the foundation using MS Access VB and SQL. Sending HTML emails for Doum’s News-list. Managing their website and their digital presence. Volunteer as well in organizing workshops and cultural events",
      link:"Check out <a href=''>Doum</a>",
      color:"white",
      textColor:"black-text"
    },
    {
      resp: "Organizer",
      org: "Astronomy Club in AUC",
      location:"Cairo Egypt",
      from: "Fall 2014",
      to: "",
      desc:"Member of the academic committee in the astronomy club, assisted in the organization of the 2nd Astronomy Conference in AUC.",
      link:"",
      color:"white",
      textColor:"black-text"
    },
    {
      resp: "Delegate",
      org: "CISV Summer Camp",
      location:"Paris France",
      from: "Summer 2010",
      to: "",
      desc:"A member of the Egyptian delegation who participated in organizing a summer camp in Paris, basing activities on 4 educational pillars; diversity, conflict resolution, sustainable development and human rights through experiential learning.",
      link:"",
      color:"white",
      textColor:"black-text"
    },
    {
      resp: "Jury of Long and Short Films",
      org: "Cairo International Film Festival for Children",
      location:"Cairo Egypt",
      from: "2007,2008,2010",
      to: "",
      desc:"A member of the children jury delegation of long and short films, our role was to select a winner for each prize in the film festival.",
      link:"",
      color:"white",
      textColor:"black-text"
    },
    {
      resp: "Water Polo Player",
      org: "Gezira Sporting Club",
      location:"Cairo Egypt",
      from: "2009",
      to: "2013",
      desc:"Participated in the Egyptian National Tournament",
      link:"",
      color:"white",
      textColor:"black-text"
    }
  ];

  $scope.contact = [
    {
      image:"Images/Contact/email.png",
      tip:"Email",
      link:"mailto:badr@khamissi.com"
    },
    {
      image:"Images/Contact/github.png",
      tip:"Github",
      link:"https://github.com/BKHMSI"
    },
    {
      image:"Images/Contact/linkedin.png",
      tip:"LinkedIn",
      link:"https://eg.linkedin.com/in/bkhmsi"
    },
    {
      image:"Images/Contact/twitter.png",
      tip:"Twitter",
      link:"https://twitter.com/BKhamissi"
    },
    {
      image:"Images/Contact/fb.png",
      tip:"Facebook",
      link:"https://www.facebook.com/badr.khamissi"
    },   
    {
      image:"Images/Contact/a2oj.png",
      tip:"Coder Profile",
      link:"https://a2oj.com/profile?Username=Bkhmsi"
    },
  ];
  
  
  $scope.projects = [
    {
      image:"Images/Projects/Korastak.png",
      name:"Korastak",
      link:"http://korastak.com/#/",
      desc:"Document sharing platform called Korastak (means: Your Notebook in Arabic) for students in AUC to be able to share notes easily with each other",
      tags:"JS,Angular,Firebase,HTML,CSS,PHP,Platform"
    },
    {
      image:"Images/Projects/assembly.png",
      name:"Assembler & Simulator",
      link:"https://bkhmsi.github.io/ARMThumb_Sim/#/",
      desc:"Online assembler and simulator for the ARM-Thumb instruction set architecture. Support many features including debugging and GFX display. You can save your assembly projects on the website",
      tags:"JS,Angular,Firebase,HTML,CSS,ARM,Assembly"
    },
    {
      image:"Images/Projects/Snake_2.png",
      name:"Snake-حنش",
      link:"https://bkhmsi.github.io/Snake/",
      desc:"Re-imagined snake game using ProcessingJS. One of my first projects that I am really proud of, done before joining university",
      tags:"ProcessingJS,JS,HTML,CSS,Game"
    },
    {
      image:"Images/Projects/PhotoGenerator.png",
      name:"PhotoGenerator",
      link:"",
      desc:"Generating a selected image using small number of selected images",
      tags:"Processing, Image Processing, Java"
    },
    {
      image:"Images/Projects/Graph_Builder.png",
      name:"Graph Builder",
      link:"https://bkhmsi.github.io/Graph_Builder/",
      desc:"Build customizable graphs and run algorithms (DFS,BFS) on them",
      tags:"Processing,Visualization,JS,HTML,CSS"
    },
    {
      image:"Images/Projects/Quicky_2.png",
      name:"Quicky: Chrome Extension",
      link:"https://chrome.google.com/webstore/detail/quicky/kjcffaoelnehhcdgfnmdeomnmafmiomj",
      desc:"Quicky is a chrome extension that allows you to share links and quick posts on the fly",
      tags:"Chrome,Web Extension,Extension,JS,HTML,CSS" 
    },
    {
      image:"Images/Projects/TicTacToe.png",
      name:"TicTacToe",
      link:"",
      desc:"Implementing a minimax A.I. for TicTacToe with variable board size",
      tags:"Web,JS,Game,ProcessingJS,HTML,CSS,A.I."  
    },
    {
      image:"Images/Projects/trivia.png",
      name:"Trivia iOS Game",
      link:"",
      desc:"Unfinished iOS trivia game for Doum Cultural Foundation",
      tags:"Mobile,iOS,Game"  
    }
  ];


  $scope.goTo = function(idx){
    switch(idx){
      case 0: $window.location.href = "#ed"; break;
      case 1: $window.location.href = "#ex"; break;
      case 2: $window.location.href = "#sk"; break;
      case 3: $window.location.href = "#pr"; break;
      case 4: $window.location.href = "#ct"; break;
    }
  };
  
  var animateScroll = function(){
    $('#scroll a span').animate({'top': '15px'}, {
      duration: 1000, 
      complete: function() {
          $('#scroll a span').animate({top: 0}, {
              duration: 1000, 
              complete: animateScroll});
      }});
  }
  
  $scope.openLink = function(idx){
    
  }
  
  animateScroll();

  $(window).resize(function(){
    $scope.$apply(function(){
       //do something to update current scope based on the new innerWidth and let angular update the view.
       $scope.mobile = (window.innerWidth < 768);
    });
  });
  
}]);


$(document).ready(function(){
  $('.parallax').parallax();
  $('.flexslider').flexslider({animation: "slide",});
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
