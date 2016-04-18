var app = angular.module("ArmSim", ['BinFilter','HexFilter','MemFilter']);

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

angular.module('MemFilter', []).filter('MemFilter', function() {
  return function(input) {
    return "0x"+pad(Dec2Hex(input),2);
  };
});

app.controller('MainController', ['$scope', '$timeout', 'memory', function ($scope, $timeout, memory){
    $scope.isRunning = false;
    $scope.memory = memory;
    $scope.displayMemory = memory.subset(0,255);
    $scope.error = 'e';
    $scope.speed = 4;
    $scope.regs = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    $scope.flags = [
      0,0,0,0
    ];
    $scope.output = Array(25);
    $scope.memDisplaySize = 255;
    $scope.pc = 0;
    $scope.sp = 0;
    $scope.lr = 0;

    var index = 0, ic = 0, exit = 0;
    var lastSWI = -1, outputIdx = 0;

    $scope.reset = function () {
        //$scope.pc = $scope.sp = $scope.lr = 0;
        $("#sourceCode").val("");
        $("#result").val("");
        $scope.selectedLine = -1;
        for(var i = 0; i<16; i++) $scope.regs[i] = 0;
        for(var i = 0; i< 4; i++) $scope.flags[i] = 0;
        for(var i = 0; i<25; i++) $scope.output[i] = "";
        $scope.memory.reset();
        index = outputIdx = ic = 0;
        lastSWI = -1;
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

      $scope.sp = parseInt(memory.loadWord(0));
      $scope.pc = parseInt(memory.loadWord(4));
    };

    $scope.test = function(){
      instType = parseInt($( "#instType option:selected" ).val())
      var instructions = $("#sourceCode").val();
      var instr = instructions.split("\n");
      if(instType == 0)
        for(var i = 0; i<instr.length; i++)
          instr[i] = parseInt(Bin2Dec(instr[i]));
      else if(instType == 1)
        for(var i = 0; i<instr.length; i++)
          instr[i] = parseInt(Hex2Dec(instr[i]));

      if(instr[index] != 0xDEAD && !isSWI(instr[index++]) && lastSWI == -1){
        decode(instr[index++],$scope);
      }
    };

    isMemoryLoaded = function(){
      for(var i = 0; i<memory.data.length; i++)
          if(parseInt(memory.load(i)))
              return true;
      return false;
    }


    $scope.run = function(){
      // Decoding Then Executing Each Instruction
      if(!isMemoryLoaded())
          load();
      var instr = parseInt(memory.loadHalf($scope.pc));
      while(instr != 0xDEAD && lastSWI == -1 && !exit){
        decode(instr,$scope);
        $scope.pc+=2;
        instr = parseInt(memory.loadHalf($scope.pc));
        if(isSWI(instr)) break;
      }
      updateSpecialRegs();
    };

    $scope.step = function(){
      if(!isMemoryLoaded())
          load();
      var instr = parseInt(memory.loadHalf($scope.pc));
      if(instr != 0xDEAD && !isSWI(instr) && lastSWI == -1 && !exit){
        decode(instr,$scope);
        $scope.pc+=2;
      }
      updateSpecialRegs();
    };

    updateSpecialRegs = function(){
      $scope.regs[15] = $scope.pc;
      $scope.regs[14] = $scope.lr;
      $scope.regs[13] = $scope.sp;
    };

    getChar = function (value) {
      var text = String.fromCharCode(value);

      if (text.trim() === '') {
          return '\u00A0\u00A0';
      } else {
          return text;
      }
    };

    $scope.processSWI = function(e){
      // 1101111100000011
      var code = (e.keyCode ? e.keyCode : e.which);
      if (code == 13) {
        var instructions = $("#result").val();
        var instr = instructions.split("\n");
        var swi = instr[instr.length-1].split(":");
        var value = swi[swi.length-1].trim();
        switch (lastSWI) {
          case 2:
            $scope.regs[1] = parseInt(value);
            break;
          case 3:
            $scope.regs[1] = value.charCodeAt(0);
            break;
          case 4:
            var adrs = $scope.regs[0];
            for(var i = 0; i<value.length; i++){
              var ascii = value.charCodeAt(i);
              memory.store(adrs++,ascii);
            }
            break;
          default:
        }

      }
    };

    isSWI = function(instr){
      /*
      1101111100000100
      1101111100000101
      */
        if(((instr) >> 13) == 6){
          if(((instr>>8) & 0x1F) == 0x1F){
            $scope.pc+=2;
            var value8 = instr & 0xFF;
            appendResult("SWI\t {0}\n".format(value8));
            lastSWI = value8;
            switch (value8) {
              case 0: $scope.output[outputIdx++] = String.fromCharCode($scope.regs[0]); break;
              case 1: $scope.output[outputIdx++] = $scope.regs[0]; break;
              case 2:
                appendResult("Enter Integer: ");
                break;
              case 3:
                appendResult("Enter Char: ");
                break;
              case 4:
                appendResult("Enter String: ");
                break;
              case 5:
                // Print Null Terminated String
                // Assume Base Address is at 0
                var adrs = $scope.regs[0];
                var c = memory.load(adrs++);
                while(c){
                  $scope.output[outputIdx++] = getChar(c);
                  c = memory.load(adrs++);
                }
                break;
              case 6:
                appendResult("Bye Bye\n");
                exit = 1;
                break;
              default:
            }
            return true;
          }else{
            return false;
          }
        }else{
          return false;
        }
    };

    printMatch = function(match){
        for(var i = 0; i<match.length; i++){
          if(match[i]){
            console.log(match[i]);
          }
        }
    }

    $scope.clear = function(){
      $("#result").val("");
      var regex = /^[\t ]*(?:([.A-Za-z]\w*)[:])?(?:[\t ]*([A-Za-z]{2,4})(?:[\t ]+(\[(\w+((\+|-)\d+)?)\]|\".+?\"|\'.+?\'|[.A-Za-z0-9]\w*)(?:[\t ]*[,][\t ]*(\[(\w+((\+|-)\d+)?)\]|\".+?\"|\'.+?\'|[.A-Za-z0-9]\w*))?)?)?/;
      var instr = "MOV  R0, R1;"
      var match = regex.exec(instr);
      printMatch(match);
    };

}]);

test = function(scope){
    scope.regs[0] = 100;
    scope.flags[0] = 1;
    scope.flags[3] = 1;
    scope.output[0] = 'A';
    scope.output[1] = 0;
    scope.output[2] = 'B';
    scope.memory.storeHalf(4,1511);
}
