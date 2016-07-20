var app = angular.module("ArmSim", ['ngRoute','BinFilter','HexFilter','MemFilter','RegNum']);



app.config(function($routeProvider) {
  $routeProvider.
  when('/project/:proj_id',{
      templateUrl: 'Simulator.html',
      controller:'MainController'
    }).otherwise({redirectTo:'/'});
});

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

app.controller('MainController', ['$scope','$routeParams','$timeout','$window','$interval','simulator','memory','assembler', function ($scope,$routeParams,$timeout,$window,$interval,simulator,memory,assembler){
    $scope.isRunning = false;
    $scope.memory = memory;
    $scope.assembler = assembler;
    $scope.simulator = simulator;
    $scope.displayMemory = memory.subset(0,255);
    $scope.isMonitor = memory.isMonitor;
    $scope.error = '';
    $scope.speed = 4;
    $scope.hideMachineCode = false;
    $scope.hideGen = true;
    $scope.hideDataLabels = true;
    $scope.showHighRegisters = false;
    $scope.isDev = true;
    $scope.zoomDisplay = true;
    $scope.regs = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    $scope.flags = [0,0,0,0];
    $scope.output = Array(60);
    $scope.memDisplaySize = 255;
    $scope.pc = 0;
    $scope.sp = 200;
    $scope.lr = 0;
    $scope.continue = "Run";
    $scope.sourceCode = [];
    $scope.dataLabels = {};
    $scope.assemblyInstr = [];
    $scope.outputIdx = 0;
    $scope.monitor = [
            [0,0,0,0,1,1],
            [1,0,0,0,0,1],
            [1,0,0,0,0,1]
          ];

    $scope.user = {email:"",fname:"",lname:""};
    $scope.navTitles = ["Simulator","Log-In"];
    $scope.project = {title: "",desc:"",isPublic:true};
    $scope.projId = "";
    $scope.isSave = false; // Hide or Show save button
    $scope.loading = false;
    $scope.frameRate = 2;
    $scope.timer = null;
    $scope.showGFXDisplay = true;

    var config = {
      apiKey: "AIzaSyC0RqVCfBUDd-IsZXJ-v8-g0MpGKxuM1ig",
      authDomain: "armthumb-sim.firebaseapp.com",
      databaseURL: "https://armthumb-sim.firebaseio.com",
      storageBucket: "armthumb-sim.appspot.com",
    };
    firebase.initializeApp(config);
    var database = firebase.database();

    var rate = 2.0;
    var index = 0, ic = 0, exit = 0;
    var lastSWI = -1;
    var codeSegmentIndex = 0, dataSegmentIndex = 0, gfxSegment = 0; // Position of .text/.code and .data in editor
    var ppc, psp, plr; // Previous Values

    $scope.$on('$routeChangeSuccess', function() {
      // $routeParams should be populated here
      $scope.projId = $routeParams.proj_id;
      if($scope.projId)
        $scope.fetchProject($scope.projId);
      else
        $scope.isSave = true;
    });

    $window.onload = function(){
      $scope.startTimer();
    };


    $scope.save = function(){
      if(firebase.auth().currentUser){
        if($scope.projId){
          // Update Code
          if($scope.isSave){
            var date = new Date;
            var key = $scope.projId;
            firebase.database().ref('projects/'+key).update({
              project: getAssemblyCode(),
              updated_at: date.getTime()
            }).then(function(){
              alert("Project Updated");
            });
          }else{
            alert("You can't save this project");
          }
        }else{
          showSaveDialog();
        }
      }else{
        alert("You must log-in to save project");
      }
    };

    $scope.fetchProject = function(id){
      var editor = ace.edit("assemblyCode");
      editor.setValue("");
      firebase.database().ref('projects/'+id).on('value', function(data) {
          if(data.val().isPublic  || data.val().user == getUserId()){
            var arrProj = data.val().project;
            if(firebase.auth().currentUser){
              $scope.isSave = data.val().user == getUserId();
            }else{
              $scope.isSave = false;
            }
            var proj = "";
            for(var i = 0; i<arrProj.length; i++){ proj += arrProj[i]+"\n";}
            editor.setValue(proj);
          }else{
            alert("This Project is Not Public");
          }
          $scope.updateNavBar(firebase.auth().currentUser);
      });
    };

    /*** Save Dialog ***/
    showSaveDialog = function(){
      $( "#dialog-form" ).dialog({
        height: 320,
        width: 350,
        modal: true,
        "open": function() {
            $( "#page" ).addClass( "blur" );
            $("#dialog-form").show();
          },
        buttons: { "Create Project": saveProject, Cancel: function() { hideSaveDialog(); }}
      });
    }

    saveProject = function(){
      var date = new Date();
      // Create Project
      firebase.database().ref('projects').push({
        user: firebase.auth().currentUser.uid,
        name: $scope.user.fname+" "+$scope.user.lname,
        title: $scope.project.title,
        description: $scope.project.desc,
        isPublic: $scope.project.isPublic,
        project: getAssemblyCode(),
        created_at: date.getTime()
      }).then(function(){
        alert("Project Created!!");
        window.location.href="projects.html";
      });
    }

    function hideSaveDialog(){
      $("#dialog-form").dialog( "close" );
    }

    function getAssemblyCode(){
      var editor = ace.edit("assemblyCode");
      return editor.getValue().split('\n');
    }

    $scope.goToLink = function(i){
      var user = firebase.auth().currentUser;
      if(firebase.auth().currentUser != null){
        if($scope.isSave){
          switch (i) {
            case 0: window.location.href = "Simulator.html"; break;
            case 1: window.location.href = "projects.html"; break;
            case 2: window.location.href = "projects-all.html"; break;
            case 3: $scope.save(); break;
            case 4: $scope.signOut(); break;
            default:
          }
        }else{
          switch (i) {
            case 0: window.location.href = "Simulator.html"; break;
            case 1: window.location.href = "projects.html"; break;
            case 2: window.location.href = "projects-all.html"; break;
            case 3: $scope.signOut(); break;
            default:
          }
        }
      }else{
        switch (i) {
          case 1: window.location.href = "sign-in.html"; break;
          case 2: window.location.href = "projects-all.html"; break;
          default:
        }
      }
    };

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
      $("#swi").val("");
      clearResult();
      codeSegmentIndex = dataSegmentIndex = exit = 0;
      $scope.continue = "Run";
      $scope.error = '';
      $scope.selectedLine = -1;
      $scope.sourceCode = [];
      $scope.dataLabels = {};
      $scope.isDev = true;
      for(var i = 0; i<16; i++) $scope.regs[i] = 0;
      for(var i = 0; i< 4; i++) $scope.flags[i] = 0;
      for(var i = 0; i<60; i++) $scope.output[i] = "";
      $scope.memory.reset();
      index = $scope.outputIdx = ic = 0;
      lastSWI = -1;
    };

    $scope.reset = function () {
        $("#swi").val("");
        clearResult();
        if($scope.isDev){
          $("#sourceCode").val("");
          var editor = ace.edit("assemblyCode");
          editor.setValue("; Write Assembly Code Here");
          $scope.memory.reset();
          $scope.sourceCode = [];
          $scope.dataLabels = {};
        }else{
          $scope.sp = parseInt(memory.loadWord(0));
          $scope.pc = parseInt(memory.loadWord(4));
          for(var i = 0; i<$scope.sourceCode.length; i++) $scope.sourceCode[i].color = "none";
        }
        $scope.continue = "Run";
        $scope.error = '';
        $scope.selectedLine = -1;
        for(var i = 0; i<16; i++) $scope.regs[i] = 0;
        for(var i = 0; i< 4; i++) $scope.flags[i] = 0;
        for(var i = 0; i<60; i++) $scope.output[i] = "";
        index = $scope.outputIdx = ic = 0;
        lastSWI = -1;
        codeSegmentIndex = dataSegmentIndex = exit = 0;
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
        while(assemblyInstr[j].indexOf(";") != -1){
          var comment = assemblyInstr[j].substring(assemblyInstr[j].indexOf(";"),assemblyInstr[j].length);
          assemblyInstr[j] = assemblyInstr[j].replace(comment,"");
          if(assemblyInstr[j].trim() != "") break;
          j++;
        }
        while(assemblyInstr[j] == ""){ j++;}
        $scope.sourceCode.push({address:i,code:memory.loadHalf(i),source:assemblyInstr[j++],color:"none"});
        if(assemblyInstr[j-1].indexOf("ldr") != -1 && assemblyInstr[j-1].indexOf("[") == -1){
          $scope.sourceCode.push({address:i+2,code:memory.loadHalf(i+2),source:"",color:"none"});
          $scope.sourceCode.push({address:i+4,code:memory.loadHalf(i+4),source:"",color:"none"});
          i+=4;
        }
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
        $scope.simulator.decode(instr[index++],$scope);
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
          if(lastSWI != -1 && !exit) alert("Take a look at the Software Interrupts Console, looks like it needs your attention");
          while(instr != 0xDEAD && !isSWI(instr) && lastSWI == -1 && !exit){
            updateSpecialRegs();
            $scope.simulator.decode(instr,$scope);
            for(var i = 0; i<$scope.sourceCode.length; i++)
               if($scope.pc == $scope.sourceCode[i].address && $scope.sourceCode[i].break)
                  breakFlag = true;

            if(ppc == $scope.pc)
                $scope.pc+=2;
            if(breakFlag) break;
            instr = parseInt(memory.loadHalf($scope.pc));
            if(isSWI(instr)) {breakFlag = true; break;}
          }
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
          updateSpecialRegs();
          if(lastSWI != -1 && !exit) alert("Take a look at the Software Interrupts Console, looks like it needs your attention");
          if(instr != 0xDEAD && !exit && !isSWI(instr) && lastSWI == -1){
            $scope.continue = "Continue";
            for(var i = 0; i<$scope.sourceCode.length; i++)
              $scope.sourceCode[i].color = $scope.pc == $scope.sourceCode[i].address ? "rgba(72,156,72,0.6)":"none";
            $scope.simulator.decode(instr,$scope);
            if(ppc == $scope.pc)
              $scope.pc+=2;
          }else{
            $scope.continue = "Run";
          }
        }catch(err){
          $scope.error = err.message;
        }
      }
    };

    updateSpecialRegs = function(){
      $scope.regs[15] = $scope.pc;
      $scope.regs[14] = $scope.lr;
      $scope.regs[13] = $scope.sp;
      ppc = $scope.pc;
    };

    $scope.getRegs = function(){
      return $scope.showHighRegisters ? $scope.regs.slice(0,13):$scope.regs.slice(0,8);
    };

    /*** Monitor ***/
    $scope.getMonitor = function(){
      var monitor = memory.subset(0,4000);
      var monitor2D = new Uint8Array();
      for(var i = 0; i<200; i++){
        monitor2D.push([]);
        for(var j = 0; j<200; j++){
          monitor2D[i].push(monitor[i+j*200]);
        }
      }
      return monitor2D;
    };

    $scope.zoomDisplayChanged = function(){
      var c = document.getElementById("monitorCanvas");
      if($scope.zoomDisplay){
        c.width = "640";
        c.height="480";
      }else{
        c.width = "320";
        c.height="240";
      }
      $scope.refreshMonitor();
    };

    $scope.refreshMonitor = function(){
      var c = document.getElementById("monitorCanvas");
      var ctx = c.getContext("2d");
      var memColor = memory.subset(4096,80896);
      var color = 0;
      var colorObj;
      for(var i = 0, ii = 0; i<320; i++, ii+=2){
        for(var j = 0, jj = 0; j<240; j++, jj+=2){
          color = memColor[i*240+j];
          colorObj = $scope.decodeColor(color);
          ctx.fillStyle = "rgba("+colorObj.red+","+colorObj.green+","+colorObj.blue+",1)";
          if($scope.zoomDisplay){
            ctx.fillRect(ii,jj,2,2);
          }else{
            ctx.fillRect(i,j,1,1);
          }
        }
      }
    };

     $scope.decodeColor = function(value){
    	var r = value & 0xE0;
      var g = ((value << 3) & 0xE0);
      var b = (value << 6) & 0xFF;
      return {
      	red: r,
        green: g,
        blue: b
      }
    };

    $scope.changeFrameRate = function(){
      $scope.stopTimer();
      if($scope.frameRate < 0 || $scope.frameRate > 60)
        $scope.frameRate = 1;
      $scope.startTimer();
    };

    //Timer start function.
    $scope.startTimer = function () {
        //Initialize the Timer to run every 1000 milliseconds i.e. one second.
        $scope.timer = $interval(function () {
            //Display the current time.
            if(!$scope.isDev && $scope.showGFXDisplay)
              $scope.refreshMonitor();
        }, $scope.frameRate == 0 ? 1000:1000/$scope.frameRate);
    };

    //Timer stop function.
    $scope.stopTimer = function () {
        //Cancel the Timer.
        if (angular.isDefined($scope.timer)) {
            $interval.cancel($scope.timer);
        }
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
      //if(!exit){
        for(var i = 0; i<$scope.sourceCode.length; i++)
          $scope.sourceCode[i].color = $scope.pc == $scope.sourceCode[i].address ? "rgba(72,156,72,0.6)":"none";
      //}


        if(((instr) >> 13) == 6){
          if(((instr>>8) & 0x1F) == 0x1F){
            $scope.pc+=2;
            index++;
            var value8 = instr & 0xFF;
            appendSWI("SWI\t {0}\n".format(value8));
            lastSWI = value8;
            switch (value8) {
              case 0:
                $scope.output[$scope.outputIdx++] = String.fromCharCode($scope.regs[0]);
                $scope.output[$scope.outputIdx++] = "";
                appendSWI(String.fromCharCode($scope.regs[0])+"\n");
                lastSWI = -1;
                break;
              case 1:
                var value = $scope.regs[0].toString();
                for(var i = 0; i<value.length; i++){
                  $scope.output[$scope.outputIdx++] = value[i];
                  appendSWI(value[i]);
                }
                $scope.output[$scope.outputIdx++] = "";
                appendSWI("\n");
                lastSWI = -1;
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
                  $scope.output[$scope.outputIdx++] = getChar(c);
                  appendSWI(getChar(c));
                  c = memory.load(adrs++);
                }
                $scope.output[$scope.outputIdx++] = "";
                appendSWI("\n");
                lastSWI = -1;
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
      var memoryIndex = 512; // Start of Data Segment
      var memoryGFXIndex = 4096; // Start of GFX Segment
      var label = "";
      var isGFX = false;
      for(var i = 0; i<instr.length; i++){
        if(instr[i].indexOf(".") != -1){
          instr[i] = instr[i].trim();
          if(instr[i].indexOf(".text") != -1 || instr[i].indexOf(".code") != -1){
            instr[i] = "";
            codeSegmentIndex = i;
          }else if(instr[i].indexOf(".data") != -1){
              dataSegmentIndex = i;
              instr[i] = "";
              isGFX = false;
          }else if(instr[i].indexOf(".gfx") != -1){
            gfxSegment = i;
            instr[i] = "";
            isGFX = true;
          }else if(instr[i].indexOf(".byte") != -1 && (i>dataSegmentIndex || i>gfxSegment)){
            if(instr[i].indexOf(":") != -1){
              label = instr[i].substring(0,instr[i].indexOf(":"));
              instr[i] = instr[i].replace(label+":","").trim();
            }
            instr[i] = instr[i].replace(".byte","").trim();
            var bytes = instr[i].split(",");
            instr[i] = "";
            $scope.dataLabels[label] = isGFX ? memoryGFXIndex:memoryIndex;
            for(var j = 0; j<bytes.length; j++){
              var value = 0;
              if(bytes[j].indexOf('\'') != -1){
                bytes[j] = bytes[j].replace('\'',"");
                bytes[j] = bytes[j].replace('\'',"");
                value = bytes[j].charCodeAt(0); // ascii code
              }else{
                value = parseInt(bytes[j]);
              }
              if(isGFX){
                memory.store(memoryGFXIndex,value);
                memoryGFXIndex++;
              }else{
                memory.store(memoryIndex,value);
                memoryIndex++;
              }
            }
          }else if((instr[i].indexOf(".short") != -1 || instr[i].indexOf(".half") != -1 || instr[i].indexOf(".hword") != -1)  && (i>dataSegmentIndex || i>gfxSegment)){
            if(instr[i].indexOf(":") != -1){
              label = instr[i].substring(0,instr[i].indexOf(":"));
              instr[i] = instr[i].replace(label+":","").trim();
            }

            if(instr[i].indexOf(".short") != -1){
              instr[i] = instr[i].replace(".short","").trim();
            }else if(instr[i].indexOf(".half") != -1){
              instr[i] = instr[i].replace(".half","").trim();
            }else{
              instr[i] = instr[i].replace(".hword","").trim();
            }

            var shorts = instr[i].split(",");
            instr[i] = "";
            if(memoryIndex%2 != 0) memoryIndex++; // Align Shorts
            $scope.dataLabels[label] = isGFX ? memoryGFXIndex:memoryIndex;
            for(var j = 0; j<shorts.length; j++){
              if(isGFX){
                memory.storeHalf(memoryGFXIndex,parseInt(shorts[j]));
                memoryGFXIndex+=2;
              }else{
                memory.storeHalf(memoryIndex,parseInt(shorts[j]));
                memoryIndex+=2;
              }
            }
          }else if(instr[i].indexOf(".word") != -1 && (i>dataSegmentIndex || i>gfxSegment)){
            if(instr[i].indexOf(":") != -1){
              label = instr[i].substring(0,instr[i].indexOf(":"));
              instr[i] = instr[i].replace(label+":","").trim();
            }
            instr[i] = instr[i].replace(".word","").trim();
            var words = instr[i].split(",");
            instr[i] = "";
            while(memoryIndex%4 != 0) memoryIndex++; // Align Words
            $scope.dataLabels[label] = isGFX ? memoryGFXIndex:memoryIndex;
            for(var j = 0; j<words.length; j++){
              if(isGFX){
                memory.storeWord(memoryGFXIndex,parseInt(words[j]));
                memoryGFXIndex+=4;
              }else{
                memory.storeWord(memoryIndex,parseInt(words[j]));
                memoryIndex+=4;
              }
            }
          }else if(instr[i].indexOf(".asciiz") != -1 && (i>dataSegmentIndex || i>gfxSegment)){
            if(instr[i].indexOf(":") != -1){
              label = instr[i].substring(0,instr[i].indexOf(":"));
              instr[i] = instr[i].replace(label+":","").trim();
            }
            instr[i] = instr[i].replace(".asciiz","").trim();
            var strings = instr[i].split(",");
            instr[i] = "";
            $scope.dataLabels[label] = isGFX ? memoryGFXIndex:memoryIndex;
            for(var j = 0; j<strings.length; j++){
              strings[j] = strings[j].replace("\"","");
              strings[j] = strings[j].replace("\"","");
              for(var k = 0; k<strings[j].length;k++){
                var ascii = strings[j].charCodeAt(k);
                memory.store(memoryIndex,ascii);
                memoryIndex++;
              }
              memory.store(memoryIndex,0x0); // NULL Terminated String
              memoryIndex++;
            }
          }else if(instr[i].indexOf(".space") != -1 && (i>dataSegmentIndex || i>gfxSegment)){
            if(instr[i].indexOf(":") != -1){
              label = instr[i].substring(0,instr[i].indexOf(":"));
              instr[i] = instr[i].replace(label+":","").trim();
            }
            instr[i] = instr[i].replace(".space","").trim();
            var spaces = instr[i].split(",");
            instr[i] = "";
            $scope.dataLabels[label] = isGFX ? memoryGFXIndex:memoryIndex;
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
        // var editor = $($("#assemblyCode")[0]).data('CodeMirrorInstance');
        // var instructions = editor.getValue();
        var editor = ace.edit("assemblyCode");
        var instructions = editor.getValue();
        var instr = instructions.toLowerCase().split("\n");
        for(var i = 0; i<instr.length; i++){instr[i] = instr[i].trim();}
        handleDirectives(instr);
        $scope.assemblyInstr = instr;
        appendHeader();
        assembler.setDataLabels($scope.dataLabels);
        assembler.parse(instr);
        load();
        var rEditor = ace.edit("result");
        rEditor.setTheme("ace/theme/"+selectedTheme);
        $scope.isDev = false;
        $scope.hideDataLabels = Object.keys($scope.dataLabels).length == 0;
      } catch (e) {
        $scope.error = e;
        // selectLine(parseInt(e.split(" ")[e.length-1]));
      }
    };

    /*** FireBase ***/
    firebase.auth().onAuthStateChanged(function(user) {
      $scope.updateNavBar(user);
      if (user) {
        // User is signed in.
        getUserName();
      } else {
      }
    });

    $scope.updateNavBar = function(user){
      if(user){
        if($scope.isSave){
          $scope.navTitles = ["New Project","My Projects","All Projects","Save","Sign Out"];
        }else{
          $scope.navTitles = ["New Project","My Projects","All Projects","Sign Out"];
        }
      }else{
        $scope.navTitles = ["Simulator","Log-In"];
      }
    };

    getUserName = function(){
      firebase.database().ref('users/' + getUserId()).on('value', function(snapshot) {
         var val = snapshot.val();
         $scope.user = { email: val.email, fname: val.fname, lname: val.lname};
         $scope.$apply();
      });
    }

    getUserId = function(){
      return firebase.auth().currentUser.uid;
    }

    $scope.signOut = function(){
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        alert("You Signed Out");
        $scope.updateNavBar(false);
        $scope.user = {email:"",fname:"",lname:""};
        $scope.$apply();
      }, function(error) {
        // An error happened.
      });
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
