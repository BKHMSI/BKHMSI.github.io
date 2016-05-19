app.controller('MainController', ['$scope', 'scoreService', function($scope, scoreService) {
  $scope.error = 'e';
  $scope.filter = '';
  $scope.major = majorService;
  $scope.update = new Date().toLocaleString();
}]);
