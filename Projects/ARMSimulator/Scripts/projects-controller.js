app.controller('ProjectsController', ['$scope', '$window', function($scope, $window) {
  $scope.error = '';
  $scope.filter = "";
  $scope.user = { name: "",  email: "", image: "" };
  $scope.loading = false;
  $scope.nothing = false;
  $scope.user = {email:"",fname:"",lname:""};
  $scope.project = {key:"",title: "",desc:"",isPublic:true};
  $scope.projects = [
  ];

  $scope.navTitles = ["New Project","My Projects","All Projects","Sign Out"];

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC0RqVCfBUDd-IsZXJ-v8-g0MpGKxuM1ig",
    authDomain: "armthumb-sim.firebaseapp.com",
    databaseURL: "https://armthumb-sim.firebaseio.com",
    storageBucket: "armthumb-sim.appspot.com",
  };
  firebase.initializeApp(config);

  $window.onload = function() {
    if(window.location.href.indexOf("projects-all") != -1){
      // Fetch all public projects
      $scope.fetchAllProjects();
    }else{
      $scope.fetchProjects();
    }
  };

  $scope.editPressed = function(idx){
    $scope.project = {
      key: $scope.projects[idx].key,
      title: $scope.projects[idx].title,
      desc: $scope.projects[idx].desc,
      isPublic: $scope.projects[idx].isPublic == "Yes" ? true:false
    };
    showEditDialog();
  };

  /*** Save Dialog ***/
  showEditDialog = function(){
    $( "#dialog-form" ).dialog({
      height: 320,
      width: 350,
      modal: true,
      "open": function() {
          $( "#page" ).addClass( "blur" );
          $("#dialog-form").show();
        },
      buttons: { "Update Project": editProject, Cancel: function() { hideEditDialog(); }}
    });
  }

  editProject = function(){
    var key = $scope.project.key;
    firebase.database().ref('projects/'+key).update({
      title: $scope.project.title,
      description: $scope.project.desc,
      isPublic: $scope.project.isPublic
    }).then(function(){
      $scope.projects = [];
      $scope.fetchProjects();
      hideEditDialog();
    });
  }

  function hideEditDialog(){
    $("#dialog-form").dialog( "close" );
  }

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      getUserName();
    } else {
      alert("You must log in to view the projects");
      window.location.href = "Simulator.html";
    }
  });

  getUserName = function(){
    firebase.database().ref('users/' + getUserId()).on('value', function(snapshot) {
       var val = snapshot.val();
       $scope.user = { email: val.email, fname: val.fname, lname: val.lname};
       $scope.$apply();
    });
  }

  getUserId = function(){
    return firebase.auth().currentUser.uid;
  }

  $scope.goToLink = function(i){
    var user = firebase.auth().currentUser;
    if(firebase.auth().currentUser != null){
      switch (i) {
        case 0: window.location.href = "Simulator.html"; break;
        case 1: window.location.href = "projects.html"; break;
        case 2: window.location.href = "projects-all.html"; break;
        case 3: $scope.signOut(); break;
        default:
      }
    }else{
      switch (i) {
        case 1: window.location.href = "sign-in.html"; break;
        default:
      }
    }
  };

  $scope.fetchProjects = function(){
    var count = 0;
    firebase.database().ref('projects').on('child_added', function(data) {
       var val = data.val();
       if(val.user == getUserId()){
         count++;
         var description = val.description;
         var ispublic = val.isPublic ? "Yes":"No";
         var dateCreation = new Date(val.created_at);
         $scope.projects.push({key:data.key,title:val.title, desc:description, isPublic:ispublic, user:val.name,date:dateCreation});
       }
       $scope.nothing = $scope.projects.length == 0;
       $scope.loading = true;
       $scope.$apply();
    });
  };

  $scope.fetchAllProjects = function(){
    var count = 0;
    firebase.database().ref('projects').on('child_added', function(data) {
       var val = data.val();
       if(val.isPublic){
         count++;
         var description = val.description;
         var ispublic = val.isPublic ? "Yes":"No";
         var dateCreation = new Date(val.created_at);
         $scope.projects.push({key:data.key,title:val.title, desc:description, isPublic:ispublic, user:val.name,date:dateCreation});
       }
       $scope.loading = true;
       $scope.$apply();
    });
  };

  $scope.deleteProject = function(idx){
    if(confirm("Are you sure you want to delete this project?")){
      firebase.database().ref('projects/'+$scope.projects[idx].key).remove();
      $scope.projects.splice(idx,1);
      $scope.$apply();
    }
  };

  $scope.openProject = function(idx){
    var id = $scope.projects[idx].key;
    var link = "Simulator.html#/project/"+id;
    $window.open(link);
  };


  $scope.getProjects = function(){
    var filteredProjects = [];
    return $scope.projects;
  };


  $scope.signOut = function(){
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      window.location.href = "sign-in.html";
    }, function(error) {
      // An error happened.
    });
  };


}]);
