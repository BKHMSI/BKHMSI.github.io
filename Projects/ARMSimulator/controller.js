var app = angular.module("ArmSim", ['BinFilter','HexFilter']);

angular.module('BinFilter', []).filter('BinFilter', function() {
  return function(input) {
    return pad(Dec2Bin(input),16);
  };
});

angular.module('HexFilter', []).filter('HexFilter', function() {
  return function(input) {
    return "0x"+pad(Dec2Hex(input),4);
  };
});

app.controller('MainController', ['$scope', '$timeout', 'memory', function ($scope, $timeout, memory){
    $scope.isRunning = false;
    $scope.error = 'e';
    $scope.speed = 4;
    $scope.regs = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var index = 0;

    $scope.reset = function () {
        $("#sourceCode").val("");
        $("#result").val("");
        $scope.selectedLine = -1;
        for(var i = 0; i<16; i++) $scope.regs[i] = 0;
        index = 0;
    };

    $scope.load = function(){
      // load instructions into memory
    };

    $scope.run = function(){
      instType = parseInt($( "#instType option:selected" ).val())
      var instructions = $("#sourceCode").val();
      var instr = instructions.split("\n");
      if(instType == 0)
        for(var i = 0; i<instr.length; i++)
          instr[i] = pad(Bin2Dec(instr[i]),16);
      else if(instType == 1)
        for(var i = 0; i<instr.length; i++)
          instr[i] = pad(Hex2Dec(instr[i]),16);

      // Decoding Then Executing Each Instruction
      for(var i = index; i<instr.length; i++)
         decode(instr[i],$scope.regs);

    };

    $scope.step = function(){
      instType = parseInt($( "#instType option:selected" ).val())
      var instructions = $("#sourceCode").val();
      var instr = instructions.split("\n");
      if(instType == 0)
        for(var i = 0; i<instr.length; i++)
          instr[i] = Bin2Dec(instr[i]);
      else if(instType == 1)
        for(var i = 0; i<instr.length; i++)
          instr[i] = Hex2Dec(instr[i]);

      // Decoding Then Executing Each Instruction
      if(index<instr.length)
        decode(instr[index++],$scope.regs);
    };

    $scope.clear = function(){
      $("#result").val("");
    };

}]);

function LoadReg(idx,regs,val){
  regs[idx] = val;
}
