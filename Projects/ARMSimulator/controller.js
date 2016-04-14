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
    $scope.memory = memory;
    $scope.error = 'e';
    $scope.speed = 4;
    $scope.regs = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    $scope.flags = [
      0,0,0,0
    ];
    $scope.output = Array(20);
    var index = 0, ic = 0;
    var pc, sp, lr;

    $scope.reset = function () {
        pc = sp = lr = 0;
        $("#sourceCode").val("");
        $("#result").val("");
        $scope.selectedLine = -1;
        for(var i = 0; i<16; i++) $scope.regs[i] = 0;
        index = 0;
    };

    load = function(){
      // load instructions into memory
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
      for(var i = index; i<instr.length; i++)
         memory.store(i,instr[i]);

      sp = parseInt(memory.loadWord(0));
      pc = parseInt(memory.loadWord(4));
    };

    isMemoryLoaded = function(){
      for(var i = 0; i<memory.data.length; i++)
          if(parseInt(memory.load(i)))
              return true;
      return false;
    }


    $scope.run = function(){
      // Decoding Then Executing Each Instruction
      load();
      var instr = parseInt(memory.loadHalf(pc));
      while(instr != 0xDEAD){
        decode(instr,$scope.regs,memory,$scope.flags,$scope.output,pc,sp);
        pc+=2;
        instr = parseInt(memory.loadHalf(pc));
      }
    };

    $scope.getChar = function (value) {
      var text = String.fromCharCode(value);

      if (text.trim() === '') {
          return '\u00A0\u00A0';
      } else {
          return text;
      }
    };

    $scope.step = function(){
      if(!isMemoryLoaded())
          load();
      var instr = parseInt(memory.loadHalf(pc));
      if(instr != 0xDEAD){
        decode(instr,$scope.regs,memory,$scope.flags, $scope.output,pc,sp);
        pc+=2;
      }
    };

    $scope.clear = function(){
      $("#result").val("");
    };

}]);

function LoadReg(idx,regs,val){
  regs[idx] = val;
}
