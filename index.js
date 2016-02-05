  window.addEventListener("scroll", function(event) {
  var top = this.scrollY, left =this.scrollX;
  var welcomeTop = $('#welcome').offset().top;
  var resumeTop = $('#resume').offset().top;
  var skillsTop = $('#skills').offset().top;
  var projectsTop = $('#projects').offset().top;
  var contactsTop = $('#contact').offset().top;

  if(top>=contactsTop-400){
    // Contacts
    $("#r").css("background-color", "");
    $("#p").css("background-color", "");
    $("#s").css("background-color", "");
    $("#c").css("background-color", "white");
  }else if(top>=projectsTop-200){
    // Projects
    $("#r").css("background-color", "");
    $("#c").css("background-color", "");
    $("#s").css("background-color", "");
    $("#p").css("background-color", "white");
  }else if(top>=skillsTop-200){
    // Skills
    $("#r").css("background-color", "");
    $("#c").css("background-color", "");
    $("#p").css("background-color", "");
    $("#s").css("background-color", "white");
  }else if(top>=resumeTop-200){
    // Resume
    $("#c").css("background-color", "");
    $("#p").css("background-color", "");
    $("#s").css("background-color", "");
    $("#r").css("background-color", "white");
  }else if(top>=welcomeTop-100){
    // Me
    $("#c").css("background-color", "");
    $("#p").css("background-color", "");
    $("#r").css("background-color", "");
    $("#s").css("background-color", "");
  }
}, false);

$(document).ready(function() {
  $('#slide1_controls').on('click', 'span', function(){
    $("#slide1_images").css("transform","translateX("+$(this).index() * -600+"px)");
    $("#slide1_controls span").removeClass("selected");
    $("#slide1_controls span").css('background-color',"white");
    $("#slide1_controls span").css('color',"black");

    if(this.id == "tools"){
      $("#slide1_container").css('height',"350px");
    }else{
      $("#slide1_container").css('height',"220px");
    }

    $(this).addClass("selected");
    $(this).css('background-color',"gray");
    $(this).css('color',"white");
  });
});

$(document).ready(function() {
  $('#slide2_controls').on('click', 'span', function(){
    $("#slide2_images").css("-webkit-transform","translateX("+$(this).index() * -600+"px)");
    $("#slide2_controls span").removeClass("selected");
    $("#slide2_controls span").css('background-color',"#F3EFE1");
    $("#slide2_controls span").css('color',"black");

    if(this.id == "experience"){
      $("#slide2_container").css('height',"400px");
    }else if(this.id == "activities"){
      $("#slide2_container").css('height',"660px");
    }else{
      $("#slide2_container").css('height',"260px");
    }

    $(this).addClass("selected");
    $(this).css('background-color',"#21CDB1");
    $(this).css('color',"white");
  });
});


$(document).ready(function() {
$(".App_Projects").hover( function() {
    $(this).css('color',"rgba(12,241,15,90)");
  });
});

$("#TriviaApp").on({
  mouseenter: function() {
    $(this).src("Images/Doum_Trivia_GIF.gif");
    $(this).width("265px");
  }, mouseleave: function(){
    $(this).src("Images/Trivia_iPhone.png");
    $(this).width("240px");
}});


$(document).ready(function() {
  $('#iOS_Apps').on('click', 'div', function(){
    console.log($("#iOS_Apps").height());
    if($("#iOS_Apps").height() == 100){
      $("#iOS_Apps").css('height',"800px");
    }else{
      $("#iOS_Apps").css('height',"100px");
    }
  });
  $('#Processing_Apps').on('click', 'div', function(){
    console.log($("#Processing_Apps").height());
    if($("#Processing_Apps").height() == 100){
      $("#Processing_Apps").css('height',"1800px");
    }else{
      $("#Processing_Apps").css('height',"100px");
    }
  });
  $('#Extension_Apps').on('click', 'div', function(){
    console.log($("#Extension_Apps").height());
    if($("#Extension_Apps").height() == 100){
      $("#Extension_Apps").css('height',"450");
    }else{
      $("#Extension_Apps").css('height',"100px");
    }
  });
});

// Edit to start and play gif changes static image to gif
$(document).ready(function () {
    $('#targetDIV_three').bind('click mousedown', function () {
        srcToGif2 = "http://demo.pink-squid.co.uk/christmas/s3.gif";
        $("#divthree_three").attr('src', srcToGif2);
    });
});
