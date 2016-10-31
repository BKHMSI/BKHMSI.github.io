app.controller('MajorController', ['$scope', '$window','majorService','signInService', function($scope,$window,majorService,signInService) {
  $scope.filter = '';
  $scope.auth = signInService;
  $scope.update = new Date().toLocaleString();
  $scope.user = { username: "",  email: "", password: "", major:"Major", image: "" };
  $scope.restoreState = majorService.get();
  $scope.navItem = 0;


  var ref = firebase.database().ref();

  $scope.majors = [
  	{
    	name: 'Biology',
    	cover: '../Images/bio.png',
  	},
  	{
      name: 'Chemistry',
      cover: '../Images/chem.png',
  	},
  	{
      name: 'Physics',
      cover: '../Images/phys.png',
  	},
    {
      name: 'Computer Engineering',
      cover: '../Images/ce.png',
    },
    {
      name: 'Business',
      cover: '../Images/bus.jpg',
    },
    {
      name: 'Sociology',
      cover: '../Images/default.png',
    },
    {
      name: 'Anthropology',
      cover: '../Images/anthro.jpg',
    },
  	{
      name: 'Computer Science',
      cover: '../Images/cs.jpg',
  	},
    {
      name: 'Mechanical Engineering',
      cover: '../Images/meng.jpg',
  	},
    {
      name: 'Accounting',
      cover: '../Images/accounting.jpg',
  	},
    {
      name: 'Arabic Studies',
      cover: '../Images/arabic.jpg',
  	},
    {
      name: 'Economics',
      cover: '../Images/default.png',
    },
    {
      name: 'Egyptology',
      cover: '../Images/default.png',
    },
    {
      name: 'English and Comparative Literature',
      cover: '../Images/default.png',
    },
    {
      name: 'Film',
      cover: '../Images/default.png',
    },
    {
      name: 'Graphic Design',
      cover: '../Images/default.png',
    },
    {
      name: 'History',
      cover: '../Images/default.png',
    },
    {
      name: 'Integrated Marketing Communication',
      cover: '../Images/default.png',
    },
    {
      name: 'Middle East Studies',
      cover: '../Images/default.png',
    },
    {
      name: 'Multimedia Journalism',
      cover: '../Images/default.png',
    },
    {
      name: 'Music Technology',
      cover: '../Images/default.png',
    },
    {
      name: 'Philosophy',
      cover: '../Images/default.png',
    },
    {
      name: 'Political Science',
      cover: '../Images/default.png',
    },
    {
      name: 'Psychology',
      cover: '../Images/default.png',
    },
    {
      name: 'Theatre',
      cover: '../Images/default.png',
    },
    {
      name: 'Visual Arts',
      cover: '../Images/default.png',
    },
    {
      name: 'MICT',
      cover: '../Images/default.png',
    },
    {
      name: 'Performance',
      cover: '../Images/default.png',
    },
    {
      name: 'Actuarial Science',
      cover: '../Images/as.jpg',
    },
    {
      name: 'Architectural Engineering',
      cover: '../Images/architecture.jpg',
    },
    {
      name: 'Construction Engineering',
      cover: '../Images/default.png',
    },
    {
      name: 'Electronics and Communications Engineering',
      cover: '../Images/default.png',
    },
    {
      name: 'Mathematics',
      cover: '../Images/default.png',
    },
    {
      name: 'Mechanical Engineering',
      cover: '../Images/default.png',
    },
    {
      name: 'Petroleum Engineering',
      cover: '../Images/default.png',
    }
  ];

  $scope.changeCourse = function(crs){
      majorService.set(crs);
      majorService.route();
  };

  $scope.goToUpload = function(){
    $window.location.href = "#/upload";
  };

  $scope.getMajors = function(){
    var filteredMajors = [];
    var filter = $scope.filter;
    if(filter == '') return $scope.majors;
    for(var i = 0; i<$scope.majors.length; i++){
      var major = $scope.majors[i].name.toLowerCase();
      filter = filter.toLowerCase();
      if(major.indexOf(filter) != -1)
        filteredMajors.push($scope.majors[i]);
    }
    return filteredMajors;
  };

}]);
