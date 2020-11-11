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

         .when('/experience', {
            templateUrl : 'views/experience.html',
            controller  : 'MainController'
        })

        .when('/projects', {
              templateUrl : 'views/projects.html',
              controller  : 'MainController'
        })

        .when('/playground', {
            templateUrl : 'views/playground.html',
            controller  : 'MainController'
        })

        .when('/activities', {
              templateUrl : 'views/activities.html',
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
    $scope.activities = null;
    $scope.projects_sz = 4;
    $scope.playground_sz = 4;
    $scope.activities_sz = 3;
    $scope.experience_sz = 3;


    $scope.$on('$routeChangeSuccess', function() {
        
    });

    $http.get('data/projects.json').success(function(data) {
        $scope.projects = data;
    });

    $http.get('data/playground.json').success(function(data) {
        $scope.playground = data;
    });

    $http.get('data/experience.json').success(function(data) {
        $scope.experience = data;
    });

    $http.get('data/activities.json').success(function(data) {
        $scope.activities = data;
    });

}]);

