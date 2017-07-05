var app = angular.module("Portfolio", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
        // route for auc home page
        .when('/', {
              templateUrl : 'views/home.html',
              controller  : 'MainController'
         })

        .when('/home', {
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

app.controller('MainController', ['$scope', '$http', '$routeParams', function($scope,$http,$routeParams) {

  $scope.projects = null;
  $scope.experience = null;
  $scope.projects_sz = 4;

  $scope.$on('$routeChangeSuccess', function() {
    
  });

  $http.get('data/projects.json').success(function(data) {
      $scope.projects = data;
  });

  $http.get('data/experience.json').success(function(data) {
      $scope.experience = data;
  });

}]);

