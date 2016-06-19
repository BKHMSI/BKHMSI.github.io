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
    $scope.hideDataLabels = true;
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
    $scope.dataLabels = {};
    $scope.assemblyInstr = [];

    var index = 0, ic = 0, exit = 0;
    var lastSWI = -1, outputIdx = 0;
    var codeSegmentIndex = 0, dataSegmentIndex = 0; // Position of .text/.code and .data in editor

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

    $scope.returnToEditor = function(){
      $("#sourceCode").val("");
      clearResult();
      codeSegmentIndex = dataSegmentIndex = 0;
      $scope.continue = "Run";
      $scope.error = '';
      $scope.selectedLine = -1;
      $scope.sourceCode = [];
      $scope.dataLabels = {};
      $scope.isDev = true;
      for(var i = 0; i<11; i++) $scope.regs[i] = 0;
      for(var i = 0; i< 4; i++) $scope.flags[i] = 0;
      for(var i = 0; i<25; i++) $scope.output[i] = "";
      $scope.memory.reset();
      index = outputIdx = ic = 0;
      lastSWI = -1;
    };

    $scope.reset = function () {
        $("#sourceCode").val("");
        clearResult();
        var editor = $($("#assemblyCode")[0]).data('CodeMirrorInstance');
        var instructions = editor.setValue("// Write Assembly Code Here");
        $scope.continue = "Run";
        $scope.error = '';
        $scope.selectedLine = -1;
        $scope.sourceCode = [];
        $scope.dataLabels = {};
        $scope.isDev = true;
        for(var i = 0; i<11; i++) $scope.regs[i] = 0;
        for(var i = 0; i< 4; i++) $scope.flags[i] = 0;
        for(var i = 0; i<25; i++) $scope.output[i] = "";
        $scope.memory.reset();
        index = outputIdx = ic = 0;
        lastSWI = -1;
        codeSegmentIndex = dataSegmentIndex = 0;
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
      instType = parseInt($( "#instType option:selected" ).val())
      var instructions = $("#sourceCode").val();
      var assemblyInstr = $scope.assemblyInstr;
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
      for(var i = 8; i<instr.length-4; i+=2){
        while(assemblyInstr[j].indexOf("//") != -1){
          var comment = assemblyInstr[j].substring(assemblyInstr[j].indexOf("//"),assemblyInstr[j].length);
          assemblyInstr[j] = assemblyInstr[j].replace(comment,"");
          if(assemblyInstr[j].trim() != "") break;
          j++;
        }
        while(assemblyInstr[j] == ""){ j++;}
        $scope.sourceCode.push({address:i,code:memory.loadHalf(i),source:assemblyInstr[j++],color:"none"});
      }

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
            for(var i = 0; i<$scope.sourceCode.length; i++)
               if($scope.pc == $scope.sourceCode[i].address && $scope.sourceCode[i].break)
                  breakFlag = true;

            $scope.pc+=2;
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
              $scope.sourceCode[i].color = $scope.pc == $scope.sourceCode[i].address ? "rgba(72,156,72,0.6)":"none";
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
        $scope.sourceCode[i].color = $scope.pc == $scope.sourceCode[i].address ? "rgba(72,156,72,0.6)":"none";

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

    handleDirectives = function(instr){
      var memoryIndex = 2048; // Start of Data Segment
      var label = "";
      for(var i = 0; i<instr.length; i++){
        if(instr[i].indexOf(".") != -1){
          instr[i] = instr[i].trim();
          if(instr[i].indexOf(".text") != -1 || instr[i].indexOf(".code") != -1){
            instr[i] = "";
            codeSegmentIndex = i;
          }else if(instr[i].indexOf(".data") != -1){
              dataSegmentIndex = i;
              instr[i] = "";
          }else if(instr[i].indexOf(".byte") != -1 && i>dataSegmentIndex){
            if(instr[i].indexOf(":") != -1){
              label = instr[i].substring(0,instr[i].indexOf(":"));
              instr[i] = instr[i].replace(label+":","").trim();
            }
            instr[i] = instr[i].replace(".byte","").trim();
            var bytes = instr[i].split(",");
            instr[i] = "";
            $scope.dataLabels[label] = memoryIndex;
            for(var j = 0; j<bytes.length; j++){
              bytes[j] = bytes[j].replace('\'',"");
              bytes[j] = bytes[j].replace('\'',"");
              var ascii = bytes[j].charCodeAt(0);
              memory.store(memoryIndex,ascii);
              memoryIndex++;
            }
          }else if((instr[i].indexOf(".short") != -1 || instr[i].indexOf(".half") != -1)  && i>dataSegmentIndex){
            if(instr[i].indexOf(":") != -1){
              label = instr[i].substring(0,instr[i].indexOf(":"));
              instr[i] = instr[i].replace(label+":","").trim();
            }
            if(instr[i].indexOf(".short") != -1){
              instr[i] = instr[i].replace(".short","").trim();
            }else{
              instr[i] = instr[i].replace(".half","").trim();
            }
            var shorts = instr[i].split(",");
            instr[i] = "";
            if(memoryIndex%2 != 0) memoryIndex++; // Align Shorts
            $scope.dataLabels[label] = memoryIndex;
            for(var j = 0; j<shorts.length; j++){
              memory.storeHalf(memoryIndex,parseInt(shorts[j]));
              memoryIndex+=2;
            }
          }else if(instr[i].indexOf(".word") != -1 && i>dataSegmentIndex){
            if(instr[i].indexOf(":") != -1){
              label = instr[i].substring(0,instr[i].indexOf(":"));
              instr[i] = instr[i].replace(label+":","").trim();
            }
            instr[i] = instr[i].replace(".word","").trim();
            var words = instr[i].split(",");
            instr[i] = "";
            while(memoryIndex%4 != 0) memoryIndex++; // Align Words
            $scope.dataLabels[label] = memoryIndex;
            for(var j = 0; j<words.length; j++){
              memory.storeWord(memoryIndex,parseInt(words[j]));
              memoryIndex+=4;
            }
          }else if(instr[i].indexOf(".asciiz") != -1 && i>dataSegmentIndex){
            if(instr[i].indexOf(":") != -1){
              label = instr[i].substring(0,instr[i].indexOf(":"));
              instr[i] = instr[i].replace(label+":","").trim();
            }
            instr[i] = instr[i].replace(".asciiz","").trim();
            var strings = instr[i].split(",");
            instr[i] = "";
            $scope.dataLabels[label] = memoryIndex;
            for(var j = 0; j<strings.length; j++){
              strings[j] = strings[j].replace("\"","");
              strings[j] = strings[j].replace("\"","");
              for(var k = 0; k<strings[j].length;k++){
                var ascii = strings[j].charCodeAt(k);
                memory.store(memoryIndex,ascii);
                memoryIndex++;
              }
            }
          }else if(instr[i].indexOf(".space") != -1 && i>dataSegmentIndex){
            if(instr[i].indexOf(":") != -1){
              label = instr[i].substring(0,instr[i].indexOf(":"));
              instr[i] = instr[i].replace(label+":","").trim();
            }
            instr[i] = instr[i].replace(".space","").trim();
            var spaces = instr[i].split(",");
            instr[i] = "";
            $scope.dataLabels[label] = memoryIndex;
            for(var j = 0; j<strings.length; j++){
              for(var k = 0; k<parseInt(spaces[j]); k++)
                memory.store(memoryIndex,0xFF);
            }
          }
        }
      }
    }

    $scope.assemble = function(){
      try {
        $("#sourceCode").val("");
        var editor = $($("#assemblyCode")[0]).data('CodeMirrorInstance');
        var instructions = editor.getValue();
        var instr = instructions.toLowerCase().split("\n");
        handleDirectives(instr);
        $scope.assemblyInstr = instr;
        appendHeader();
        assembler.parse(instr);
        load();
        $scope.isDev = false;
        $scope.hideDataLabels = $scope.dataLabels == 0;
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
