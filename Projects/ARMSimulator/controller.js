var app = angular.module("ArmSim", ['BinFilter','HexFilter','MemFilter','RegNum']);

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

angular.module('RegNum', []).filter('RegNum', function() {
  return function(input) {
    if(input<8) return input;
    else if(input == 8) return "SP";
    else if(input == 9) return "LR";
    else return "PC";
  };
});

app.controller('MainController', ['$scope', '$timeout','$window','memory','assembler', function ($scope, $timeout,$window,memory,assembler){
    $scope.isRunning = false;
    $scope.memory = memory;
    $scope.assembler = assembler;
    $scope.displayMemory = memory.subset(0,255);
    $scope.error = '';
    $scope.speed = 4;
    $scope.hideMachineCode = false;
    $scope.regs = [0,0,0,0,0,0,0,0,0,0,0];
    $scope.flags = [0,0,0,0];
    $scope.output = Array(25);
    $scope.memDisplaySize = 255;
    $scope.pc = 0;
    $scope.sp = 200;
    $scope.lr = 0;
    $scope.continue = "Run";

    var index = 0, ic = 0, exit = 0;
    var lastSWI = -1, outputIdx = 0;

    $scope.bug = function(){
      $window.location.href = "mailto:badr@khamissi.com?subject=ARM%20Simultor%20Bug&body=Error:%20"+$scope.error;
    };

    $scope.getLabels = function(){
        var labelsObj = [];
        var labels = $scope.assembler.labels;
        for (var key in labels) {
          var value = labels[key];
          labelsObj.push({name: key, address: value*2});
        }
        return labelsObj;
    };

    $scope.reset = function () {
        $("#sourceCode").val("");
        $("#result").val("");
        $scope.continue = "Run";
        $scope.error = '';
        $scope.selectedLine = -1;
        for(var i = 0; i<11; i++) $scope.regs[i] = 0;
        for(var i = 0; i< 4; i++) $scope.flags[i] = 0;
        for(var i = 0; i<25; i++) $scope.output[i] = "";
        $scope.memory.reset();
        index = outputIdx = ic = 0;
        lastSWI = -1;
    };

    $scope.expandAssmbly = function(){
      if(!$scope.hideMachineCode){
        $("#result").attr('rows','30');
      }else{
        $("#result").attr('rows','21');
      }
    };

    load = function(){
      // load instructions into memory
      $("#result").val("");
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
      if(instr[index] != 0xDEAD && !isSWI(instr[index]) && lastSWI == -1){
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
      var machineCode = $("#sourceCode").val();
      if(machineCode == ""){
        alert("You have to assemble program first!! Assemble button is at the bottom of the code area")
      }else{
        try{
          if(!isMemoryLoaded())
              load();
          var instr = parseInt(memory.loadHalf($scope.pc));
          while(instr != 0xDEAD && !isSWI(instr) && lastSWI == -1 && !exit){
            decode(instr,$scope);
            $scope.pc+=2;
            instr = parseInt(memory.loadHalf($scope.pc));
            if(isSWI(instr)) break;
          }
          updateSpecialRegs();
        }catch(err){
          $scope.error = err.message;
        }
      }
    };

    $scope.step = function(){
      try{
        $scope.continue = "Continue";
        if(!isMemoryLoaded())
            load();
        var instr = parseInt(memory.loadHalf($scope.pc));
        if(instr != 0xDEAD && !isSWI(instr) && lastSWI == -1 && !exit){
          decode(instr,$scope);
          $scope.pc+=2;
        }
        updateSpecialRegs();
      }catch(err){
        $scope.error = err.message;
      }
    };

    updateSpecialRegs = function(){
      $scope.regs[10] = $scope.pc;
      $scope.regs[9] = $scope.lr;
      $scope.regs[8] = $scope.sp;
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
            $scope.regs[0] = parseInt(value);
            break;
          case 3:
            $scope.regs[0] = value.charCodeAt(0);
            break;
          case 4:
            var adrs = $scope.regs[0];
            for(var i = 0; i<value.length; i++){
              var ascii = value.charCodeAt(i);
              memory.store(adrs++,ascii);
            }
            memory.store(adrs++,0);
            break;
          default:
        }
        $scope.continue = "Continue";
        lastSWI = -1;
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
            index++;
            var value8 = instr & 0xFF;
            appendResult("SWI\t {0}\n".format(value8));
            lastSWI = value8;
            switch (value8) {
              case 0: $scope.output[outputIdx++] = String.fromCharCode($scope.regs[0]); break;
              case 1:
                var value = $scope.regs[0].toString();
                for(var i = 0; i<value.length; i++){
                  $scope.output[outputIdx++] = value[i];
                }
                break;
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

    $scope.assemble = function(){
      try {
        var instructions = $("#result").val();
        var instr = instructions.toLowerCase().split("\n");
        appendHeader();
        assembler.parse(instr);
      } catch (e) {
        $scope.error = e;
      }
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
