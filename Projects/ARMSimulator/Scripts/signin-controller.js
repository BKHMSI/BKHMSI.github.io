app.controller('SignInController', ['$scope', '$window', function($scope,$window) {
  $scope.error = '';
  $scope.uid = "";
  $scope.user = { fname: "", lname:"",  email: "", password:""};

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC0RqVCfBUDd-IsZXJ-v8-g0MpGKxuM1ig",
    authDomain: "armthumb-sim.firebaseapp.com",
    databaseURL: "https://armthumb-sim.firebaseio.com",
    storageBucket: "armthumb-sim.appspot.com",
  };

  firebase.initializeApp(config);
  var database = firebase.database();

  $scope.signIn = function(){
    $scope.signOut();
    firebase.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(){
      window.location.href = 'Simulator.html'
    }).catch(function(error) {
    // Handle Errors here.
    $scope.error = "Error: "+error.code;
    alert(error);
    var errorCode = error.code;
    var errorMessage = error.message;
    });
  };

  getUserId = function(){
    return firebase.auth().currentUser.uid;
  }

  function writeUserData(userId,email,fname,lname) {
    firebase.database().ref('users/' + userId).set({
      fname: fname,
      lname: lname,
      email: email
    });
  }

  $scope.getUserProfile = function(){
    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid;

    if (user != null) {
      name = user.displayName;
      email = user.email;
      photoUrl = user.photoURL;
      uid = user.uid;
    }
  }

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
    } else {
      // No user is signed in.
    }
  });


  $scope.registerWithEmail = function(){
    firebase.auth().createUserWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(){
      writeUserData(getUserId(), $scope.user.email,$scope.user.fname,$scope.user.lname);
      alert("Sign Up Successfully");
      window.location.href = "Simulator.html";
      // Create a User Record Then go to Simulator
    }).catch(function(error) {
      // Handle Errors here.
      $scope.error = "Error: "+error.code;
      alert(error);
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  };

  $scope.resetPassword = function(){
    var auth = firebase.auth();
    var emailAddress = $scope.user.email;
    console.log(emailAddress);
    if(emailAddress == ""){
      alert("Please write down your email address");
    }else{
      auth.sendPasswordResetEmail(emailAddress).then(function() {
        // Email sent.
        alert("Email Sent");
      }, function(error) {
        // An error happened
        alert(error);
      });
    }
  };

  $scope.signOut = function(){
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }, function(error) {
      // An error happened.
    });
  };

}]);
