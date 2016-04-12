var app = angular.module("ArmSim", []);
app.directive('CodeFormat', function() {
  return {
    restrict: 'E',
    scope: {
      info: '='
    },
    templateUrl: 'templates/CodeFormat.html'
  };
});
