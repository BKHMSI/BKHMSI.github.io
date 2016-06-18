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
    $scope.hideGen = true;
    $scope.isDev = true;
    $scope.regs = [0,0,0,0,0,0,0,0,0,0,0];
    $scope.flags = [0,0,0,0];
    $scope.output = Array(25);
    $scope.memDisplaySize = 255;
    $scope.pc = 0;
    $scope.sp = 200;
    $scope.lr = 0;
    $scope.continue = "Run";
    $scope.sourceCode = [];

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
        $("#assemblyCode").val("");
        $scope.continue = "Run";
        $scope.error = '';
        $scope.selectedLine = -1;
        $scope.sourceCode = [];
        $scope.isDev = true;
        for(var i = 0; i<11; i++) $scope.regs[i] = 0;
        for(var i = 0; i< 4; i++) $scope.flags[i] = 0;
        for(var i = 0; i<25; i++) $scope.output[i] = "";
        $scope.memory.reset();
        index = outputIdx = ic = 0;
        lastSWI = -1;
    };

    $scope.expandAssmbly = function(){
      if(!$scope.hideMachineCode){
        $("#assemblyCode").attr('rows','30');
      }else{
        $("#assemblyCode").attr('rows','21');
      }
    };

    load = function(){
      // load instructions into memory
      $scope.isDev = false;
      instType = parseInt($( "#instType option:selected" ).val())
      var instructions = $("#sourceCode").val();
      var assemblyInstr = $("#assemblyCode").val().split("\n");
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

      var j = 0;
      for(var i = 8; i<instr.length-4; i+=2)
        $scope.sourceCode.push({address:i,code:memory.loadHalf(i),source:assemblyInstr[j++],color:"none"});

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
      var breakFlag = false;
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
            for(var i = 0; i<$scope.sourceCode.length; i++)
               if($scope.pc-2 == $scope.sourceCode[i].address && $scope.sourceCode[i].break)
                  breakFlag = true;
            if(breakFlag) break;
            instr = parseInt(memory.loadHalf($scope.pc));
            if(isSWI(instr)) {breakFlag = true; break;}
          }
          updateSpecialRegs();
        }catch(err){
          $scope.error = err.message;
        }
      }
      if(!breakFlag)
        $scope.continue = "Run";
    };

    $scope.step = function(){
      var machineCode = $("#sourceCode").val();
      if(machineCode == ""){
        alert("You have to assemble program first!! Assemble button is at the bottom of the code area")
      }else{
        try{
          if(!isMemoryLoaded())
              load();
          var instr = parseInt(memory.loadHalf($scope.pc));
          if(instr != 0xDEAD && !isSWI(instr) && lastSWI == -1 && !exit){
            $scope.continue = "Continue";
            for(var i = 0; i<$scope.sourceCode.length; i++)
              $scope.sourceCode[i].color = $scope.pc == $scope.sourceCode[i].address ? "green":"none";
            decode(instr,$scope);
            $scope.pc+=2;
          }else{
            $scope.continue = "Run";
          }
          updateSpecialRegs();
        }catch(err){
          $scope.error = err.message;
        }
      }
    };

    updateSpecialRegs = function(){
      $scope.regs[10] = $scope.pc;
      $scope.regs[9] = $scope.lr;
      $scope.regs[8] = $scope.sp;
    };


    $scope.processSWI = function(e){
      // 1101111100000011
      // var textarea = $("#result")[0];
      // var lineNumber = textarea.value.substr(0, textarea.selectionStart).split("\n").length;
      // selectLine(lineNumber);
      var code = (e.keyCode ? e.keyCode : e.which);
      if (code == 13) {
        var instructions = $("#swi").val();
        var instr = instructions.split("\n");
        var swi = instr[instr.length-1].split(":");
        var value = swi[swi.length-1].trim();
        switch (lastSWI) {
          case 2:
            $scope.regs[0] = parseInt(value);
            $scope.continue = "Continue";
            lastSWI = -1;
            break;
          case 3:
            $scope.regs[0] = value.charCodeAt(0);
            $scope.continue = "Continue";
            lastSWI = -1;
            break;
          case 4:
            var adrs = $scope.regs[0];
            for(var i = 0; i<value.length; i++){
              var ascii = value.charCodeAt(i);
              memory.store(adrs++,ascii);
            }
            memory.store(adrs++,0);
            $scope.continue = "Continue";
            lastSWI = -1;
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
      for(var i = 0; i<$scope.sourceCode.length; i++)
        $scope.sourceCode[i].color = $scope.pc == $scope.sourceCode[i].address ? "green":"none";

        if(((instr) >> 13) == 6){
          if(((instr>>8) & 0x1F) == 0x1F){
            $scope.pc+=2;
            index++;
            var value8 = instr & 0xFF;
            appendSWI("SWI\t {0}\n".format(value8));
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
                appendSWI("Enter Integer: ");
                break;
              case 3:
                appendSWI("Enter Char: ");
                break;
              case 4:
                appendSWI("Enter String: ");
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
                appendSWI("Bye Bye\n");
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
        $("#sourceCode").val("");
        var instructions = $("#assemblyCode").val();
        var instr = instructions.toLowerCase().split("\n");
        appendHeader();
        assembler.parse(instr);
      } catch (e) {
        $scope.error = e;
        // selectLine(parseInt(e.split(" ")[e.length-1]));
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
