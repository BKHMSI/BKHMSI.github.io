app.controller('MainController', ['$document', '$scope', '$timeout', 'memory', function ($document, $scope, $timeout, memory) {
    $scope.memory = memory;
    $scope.isRunning = false;
    $scope.error = '';
    $scope.speed = 4;

    $scope.reset = function () {
        memory.reset();
        $scope.selectedLine = -1;
    };

    $scope.executeStep = function () {
      if (!$scope.checkPrgrmLoaded()) {
        $scope.error = "Program is not assembled";
      }
      try {
          // cpu.step();
          return true;
      } catch (e) {
          $scope.error = e;
          return false;
      }
    };

    var runner;
    $scope.run = function () {
        if (!$scope.checkPrgrmLoaded()) {
          $scope.error = "Program is not assembled";
        }

        $scope.isRunning = true;
        runner = $timeout(function () {
            if ($scope.executeStep() === true) {
                $scope.run();
            } else {
                $scope.isRunning = false;
            }
        }, 1000 / $scope.speed);
    };

    $scope.stop = function () {
        $timeout.cancel(runner);
        $scope.isRunning = false;
    };

    $scope.checkPrgrmLoaded = function () {
        for (var i = 0, l = memory.data.length; i < l; i++) {
            if (memory.data[i] !== 0) {
                return true;
            }
        }
        return false;
    };

    $scope.getChar = function (value) {
        var text = String.fromCharCode(value);

        if (text.trim() === '') {
            return '\u00A0\u00A0';
        } else {
            return text;
        }
    };


    $scope.jumpToLine = function (index) {
        $document[0].getElementById('sourceCode').scrollIntoView();
        // $scope.selectedLine = $scope.mapping[index];
    };

}]);
