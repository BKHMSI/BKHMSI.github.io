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

app.controller('MainController', ['$scope', '$timeout', 'memory', function ($scope, $timeout, memory){
    $scope.isRunning = false;
    $scope.memory = memory;
    $scope.displayMemory = memory.subset(0,255);
    $scope.error = 'e';
    $scope.speed = 4;
    $scope.hideMachineCode = false;
    $scope.regs = [0,0,0,0,0,0,0,0,0,0,0];
    $scope.flags = [
      0,0,0,0
    ];
    $scope.output = Array(25);
    $scope.memDisplaySize = 255;
    $scope.pc = 0;
    $scope.sp = 200;
    $scope.lr = 0;

    var index = 0, ic = 0, exit = 0;
    var lastSWI = -1, outputIdx = 0;

    $scope.reset = function () {
        //$scope.pc = $scope.sp = $scope.lr = 0;
        $("#sourceCode").val("");
        $("#result").val("");
        $scope.error = 'e';
        $scope.selectedLine = -1;
        for(var i = 0; i<11; i++) $scope.regs[i] = 0;
        for(var i = 0; i< 4; i++) $scope.flags[i] = 0;
        for(var i = 0; i<25; i++) $scope.output[i] = "";
        $scope.memory.reset();
        index = outputIdx = ic = 0;
        lastSWI = -1;
    };

    $scope.expandAssmbly = function(){
      if($scope.hideMachineCode){
        $("#result").attr('rows','40');
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
      // Decoding Then Executing Each Instruction
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

    };

    $scope.step = function(){
      try{
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

    printMatch = function(match){
        for(var i = 0; i<match.length; i++){
          if(match[i]){
            console.log(match[i]);
          }
          console.log(0xFFFFF000>>>4);
        }
    }

    $scope.assemble = function(){
      var instructions = $("#result").val();
      var instr = instructions.split("\n");
      appendHeader();
      var regex = /^[\t ]*(?:([.A-Za-z]\w*)[:])?(?:[\t\s]*([A-Za-z]{2,4})(?:[\t ]+(\[(\w+((\+|-)\d+)?)\]|\".+?\"|\'.+?\'|[.A-Za-z0-9]\w*)(?:[\t ]*[,][\t ]*(\[(\w+((\+|-)\d+)?)\]|\".+?\"|\'.+?\'|[#-Za-z0-9]\w*))?)?)?/;
      for(var i = 0; i<instr.length; i++){
        if(instr[i] != ""){
          var match = regex.exec(instr[i]);
          if(instr[i][0].toLowerCase() == 'b')
              match[3] = instr[i].split(' ')[1];
          else if((instr[i].indexOf("str") != -1) || (instr[i].indexOf("ldr") != -1)){
              var tmp = instr[i].split('[')[1];
              tmp = tmp.replace("]","");
              match[7] = tmp.split(",")[0];
              match[8] = tmp.split(",")[1];
          }
          printMatch(match);
          assembler(match);
        }
      }
      appendMachineCode(0xAD);
      appendMachineCode(0xDE);
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

function appendHeader(){
  appendMachineCode(200);
  appendMachineCode(0);
  appendMachineCode(0);
  appendMachineCode(0);
  appendMachineCode(8);
  appendMachineCode(0);
  appendMachineCode(0);
  appendMachineCode(0);
}

assembler = function(match){
  switch (match[2].toLowerCase()) {
    case "swi":
      appendMachineCode(parseInt(match[3]));
      appendMachineCode(223);
      break;
    case "mov":
      // 001000
      appendMachineCode(parseInt(match[7].replace("#","")));
      var reg =  parseInt(match[3].toLowerCase().replace("r",""));
      var format = 4*8 + reg;
      appendMachineCode(format);
      break;
    case "cmp":
      // 00101
      appendMachineCode(parseInt(match[7].replace("#","")));
      var reg =  parseInt(match[3].toLowerCase().replace("r",""));
      var format = 5*8 + reg;
      appendMachineCode(format);
     break;
    case "add":
      // 00110
      appendMachineCode(parseInt(match[7].replace("#","")));
      var reg =  parseInt(match[3].toLowerCase().replace("r",""));
      var format = 6*8 + reg;
      appendMachineCode(format)
      break;
    case "sub":
      // 00111
      appendMachineCode(parseInt(match[7].replace("#","")));
      var reg =  parseInt(match[3].toLowerCase().replace("r",""));
      var format = 7*8 + reg;
      appendMachineCode(format)
      break;

    case "and":
      // 01000000
      var rd =  parseInt(match[3].toLowerCase().replace("r",""));
      var rs =  parseInt(match[7].toLowerCase().replace("r",""));
      var lower = rs*8 + rd;
      appendMachineCode(lower);
      appendMachineCode(64);
      break;
    case "eor":
      // 00111
      var rd =  parseInt(match[3].toLowerCase().replace("r",""));
      var rs =  parseInt(match[7].toLowerCase().replace("r",""));
      var lower = rs*8 + rd + (1<<6);
      appendMachineCode(lower);
      appendMachineCode(64);
      break;
    case "lsl":
      // 00111
      var rd =  parseInt(match[3].toLowerCase().replace("r",""));
      var rs =  parseInt(match[7].toLowerCase().replace("r",""));
      var lower = rs*8 + rd + (1<<7);
      appendMachineCode(lower);
      appendMachineCode(64);
      break;
    case "lsr":
      // 00111
      var rd =  parseInt(match[3].toLowerCase().replace("r",""));
      var rs =  parseInt(match[7].toLowerCase().replace("r",""));
      var lower = rs*8 + rd + (3<<6);
      appendMachineCode(lower);
      appendMachineCode(64);
      break;
    case "asr":
      // 00111
      var rd =  parseInt(match[3].toLowerCase().replace("r",""));
      var rs =  parseInt(match[7].toLowerCase().replace("r",""));
      var lower = rs*8 + rd;
      appendMachineCode(lower);
      appendMachineCode(65);
      break;
    case "adc":
      // 00111
      var rd =  parseInt(match[3].toLowerCase().replace("r",""));
      var rs =  parseInt(match[7].toLowerCase().replace("r",""));
      var lower = rs*8 + rd + (1<<6);
      appendMachineCode(lower);
      appendMachineCode(65);
      break;
    case "sbc":
      // 00111
      var rd =  parseInt(match[3].toLowerCase().replace("r",""));
      var rs =  parseInt(match[7].toLowerCase().replace("r",""));
      var lower = rs*8 + rd + (1<<7);
      appendMachineCode(lower);
      appendMachineCode(65);
      break;
    case "ror":
      // 00111
      var rd =  parseInt(match[3].toLowerCase().replace("r",""));
      var rs =  parseInt(match[7].toLowerCase().replace("r",""));
      var lower = rs*8 + rd + (3<<6);
      appendMachineCode(lower);
      appendMachineCode(65);
      break;
    case "tst":
      // 00111
      var rd =  parseInt(match[3].toLowerCase().replace("r",""));
      var rs =  parseInt(match[7].toLowerCase().replace("r",""));
      var lower = rs*8 + rd;
      appendMachineCode(lower);
      appendMachineCode(66);
      break;
    case "neg":
      // 00111
      var rd =  parseInt(match[3].toLowerCase().replace("r",""));
      var rs =  parseInt(match[7].toLowerCase().replace("r",""));
      var lower = rs*8 + rd + (1<<6);
      appendMachineCode(lower);
      appendMachineCode(66);
      break;
    case "cmp":
      // 00111
      var rd =  parseInt(match[3].toLowerCase().replace("r",""));
      var rs =  parseInt(match[7].toLowerCase().replace("r",""));
      var lower = rs*8 + rd + (1<<7);
      appendMachineCode(lower);
      appendMachineCode(66);
      break;
    case "cmn":
      // 00111
      var rd =  parseInt(match[3].toLowerCase().replace("r",""));
      var rs =  parseInt(match[7].toLowerCase().replace("r",""));
      var lower = rs*8 + rd + (3<<6);
      appendMachineCode(lower);
      appendMachineCode(66);
      break;
    case "orr":
      // 00111
      var rd =  parseInt(match[3].toLowerCase().replace("r",""));
      var rs =  parseInt(match[7].toLowerCase().replace("r",""));
      var lower = rs*8 + rd;
      appendMachineCode(lower);
      appendMachineCode(67);
      break;
    case "mul":
      // 00111
      var rd =  parseInt(match[3].toLowerCase().replace("r",""));
      var rs =  parseInt(match[7].toLowerCase().replace("r",""));
      var lower = rs*8 + rd + (1<<6);
      appendMachineCode(lower);
      appendMachineCode(67);
      break;
    case "bic":
      // 00111
      var rd =  parseInt(match[3].toLowerCase().replace("r",""));
      var rs =  parseInt(match[7].toLowerCase().replace("r",""));
      var lower = rs*8 + rd + (1<<7);
      appendMachineCode(lower);
      appendMachineCode(67);
      break;
    case "mvn":
      // 00111
      var rd =  parseInt(match[3].toLowerCase().replace("r",""));
      var rs =  parseInt(match[7].toLowerCase().replace("r",""));
      var lower = rs*8 + rd + (3<<6);
      appendMachineCode(lower);
      appendMachineCode(67);
      break;

    case "beq":
      var rd =  parseInt(match[3].toLowerCase());
      appendMachineCode(rd);
      appendMachineCode(parseInt(Bin2Dec("11010000")));
      break;
    case "bne":
      var rd =  parseInt(match[3].toLowerCase());
      appendMachineCode(rd);
      appendMachineCode(parseInt(Bin2Dec("11010001")));
      break;
    case "bcs":
      var rd =  parseInt(match[3].toLowerCase());
      appendMachineCode(rd);
      appendMachineCode(parseInt(Bin2Dec("11010010")));
      break;
    case "bcc":
      var rd =  parseInt(match[3].toLowerCase());
      appendMachineCode(rd);
      appendMachineCode(parseInt(Bin2Dec("11010011")));
      break;
    case "bmi":
      var rd =  parseInt(match[3].toLowerCase());
      appendMachineCode(rd);
      appendMachineCode(parseInt(Bin2Dec("11010100")));
      break;
    case "bpl":
      var rd =  parseInt(match[3].toLowerCase());
      appendMachineCode(rd);
      appendMachineCode(parseInt(Bin2Dec("11010101")));
      break;
    case "bvs":
      var rd =  parseInt(match[3].toLowerCase());
      appendMachineCode(rd);
      appendMachineCode(parseInt(Bin2Dec("11010110")));
      break;
    case "bvc":
      var rd =  parseInt(match[3].toLowerCase());
      appendMachineCode(rd);
      appendMachineCode(parseInt(Bin2Dec("11010111")));
      break;
    case "bhi":
      var rd =  parseInt(match[3].toLowerCase());
      appendMachineCode(rd);
      appendMachineCode(parseInt(Bin2Dec("11011000")));
      break;
    case "bls":
      var rd =  parseInt(match[3].toLowerCase());
      appendMachineCode(rd);
      appendMachineCode(parseInt(Bin2Dec("11011001")));
      break;
    case "bge":
      var rd =  parseInt(match[3].toLowerCase());
      appendMachineCode(rd);
      appendMachineCode(parseInt(Bin2Dec("11011010")));
      break;
    case "blt":
      var rd =  parseInt(match[3].toLowerCase());
      appendMachineCode(rd);
      appendMachineCode(parseInt(Bin2Dec("11011011")));
      break;
    case "bgt":
      var rd =  parseInt(match[3].toLowerCase());
      appendMachineCode(rd);
      appendMachineCode(parseInt(Bin2Dec("11011100")));
      break;
    case "ble":
      var rd =  parseInt(match[3].toLowerCase());
      appendMachineCode(rd);
      appendMachineCode(parseInt(Bin2Dec("11011101")));
      break;

    case "str":
      if(match[8].indexOf("#") != -1){
        var rd =  parseInt(match[3].toLowerCase().replace("r",""));
        var rb =  parseInt(match[7].toLowerCase().replace("r",""));
        var ro =  parseInt(match[8].toLowerCase().replace("#",""));
        var upper = imm & 0x1c;
        var lower = rd + rb*8 + ((imm&3)<<6);
        appendMachineCode(lower);
        appendMachineCode(parseInt(Bin2Dec("01100")<<3)+upper);
      }else{
        var rd =  parseInt(match[3].toLowerCase().replace("r",""));
        var rb =  parseInt(match[7].toLowerCase().replace("r",""));
        var ro =  parseInt(match[8].toLowerCase().replace("r",""));
        var lower = rd + rb*8 + (ro*64 & 3)
        appendMachineCode(lower);
        appendMachineCode(parseInt(Bin2Dec("0101000")<<1)+((ro&4)>>2));
      }
      break;
    case "ldr":
    if(match[8].indexOf("#") != -1){
      var rd =  parseInt(match[3].toLowerCase().replace("r",""));
      var rb =  parseInt(match[7].toLowerCase().replace("r",""));
      var imm =  parseInt(match[8].toLowerCase().replace("#",""));
      var upper = imm & 0x1c;
      var lower = rd + rb*8 + ((imm&3)<<6);
      appendMachineCode(lower);
      appendMachineCode(parseInt(Bin2Dec("01101")<<3)+upper);
    }else{
      var rd =  parseInt(match[3].toLowerCase().replace("r",""));
      var rb =  parseInt(match[7].toLowerCase().replace("r",""));
      var ro =  parseInt(match[8].toLowerCase().replace("r",""));
      var lower = rd + rb*8 + (ro*64 & 3)
      appendMachineCode(lower);
      appendMachineCode(parseInt(Bin2Dec("0101100")<<1)+((ro&4)>>2));
    }
    break;
    default:
  }
}
