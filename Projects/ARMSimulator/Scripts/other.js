var selectedTheme = "xcode";

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("page").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("page").style.marginLeft= "0";
}

function displayPlaceHolder(value){
  var machineCode = $("#sourceCode").val().split("\n");
  $("#sourceCode").val("");
  if(machineCode.length == 0){
    var placeholder = "";
    if(value == 0)
       placeholder = "Enter Instructions in Binary (base 2)";
    else if(value == 1)
       placeholder = "Enter Instructions in Hexadecimal (base 16)";
    else if(value == 2)
       placeholder = "Enter Instructions in Decimal (base 10)";
    $("#sourceCode").attr("placeholder", placeholder);
  }else{
    // if(value == 0){
    //   for(var i = 0; i<machineCode.length; i++){
    //     if(checkDec(machineCode[0])){
    //       appendMachineCode(pad(Dec2Bin(parseInt(machineCode[i])),8));
    //     }else if(checkHex(machineCode[0])){
    //       appendMachineCode(pad(Hex2Bin(parseInt(machineCode[i])),8));
    //     }
    //   }
    // }else if(value == 2){
    //   for(var i = 0; i<machineCode.length; i++){
    //     if(checkBin(machineCode[0])){
    //       appendMachineCode(Bin2Dec(parseInt(machineCode[i])));
    //     }else if(checkHex(machineCode[0])){
    //       appendMachineCode(Hex2Dec(parseInt(machineCode[i])));
    //     }
    //   }
    // }else if(value == 1){
    //   for(var i = 0; i<machineCode.length; i++){
    //     if(checkBin(machineCode[0])){
    //       appendMachineCode("0x"+Bin2Hex(parseInt(machineCode[i])));
    //     }else if(checkDec(machineCode[0])){
    //       appendMachineCode("0x"+Dec2Hex(parseInt(machineCode[i])));
    //     }
    //   }
    // }
  }
}

$(document).ready(function() {
  // var textArea = $("#assemblyCode")[0];
  // var editor = CodeMirror.fromTextArea(textArea, {
  //     lineNumbers: true,
  //     gutter: true,
  //     lineWrapping: true,
  //     smartIndent: true
  // });

  var primaryComment = ";Hello World\n\n";
  var primaryCode = ".code \nbl printHello \nswi 6 \n\nprintHello: \n\tldr r0,=hello\n\tswi 5\n\tbx lr\n\n";
  var primaryData = ".data \n\t hello: .asciiz \"Hello World\"";

  // editor.getDoc().setValue(primaryComment+primaryCode+primaryData);
  // editor.setSize("100%","592px");
  // $('#assemblyCode').data('CodeMirrorInstance', editor);

  var editor = ace.edit("assemblyCode");
  editor.setTheme("ace/theme/xcode");
  var assemblyMode = require("ace/mode/assembly_x86").Mode;
  editor.getSession().setMode(new assemblyMode());
  editor.getSession().setValue(primaryComment+primaryCode+primaryData);
  editor.$blockScrolling = Infinity;

  var rEditor = ace.edit("result");
  rEditor.setTheme("ace/theme/xcode");
  rEditor.getSession().setMode(new assemblyMode());
  rEditor.$blockScrolling = Infinity;


  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });

  var c = document.getElementById("monitorCanvas");
  var ctx = c.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,640,480);
});

function changeTheme(value){
  var editor = ace.edit("assemblyCode");
  switch (parseInt(value)) {
    case 0: editor.setTheme("ace/theme/ambiance");selectedTheme = "ambiance"; break;
    case 1: editor.setTheme("ace/theme/chrome");selectedTheme = "chrome"; break;
    case 2: editor.setTheme("ace/theme/clouds_midnight");selectedTheme = "clouds_midnight"; break;
    case 3: editor.setTheme("ace/theme/github"); selectedTheme = "github";break;
    case 4: editor.setTheme("ace/theme/twilight"); selectedTheme = "twilight";break;
    case 5: editor.setTheme("ace/theme/pastel_on_dark"); selectedTheme = "pastel_on_dark";break;
    case 6: editor.setTheme("ace/theme/xcode"); selectedTheme = "xcode";break;
    default: break;
  }
}

function selectLine(line){
  selectTextareaLine($("#result")[0],line);
}

function selectTextareaLine(tarea,lineNum) {
    lineNum--; // array starts at 0
    var lines = tarea.value.split("\n");

    // calculate start/end
    var startPos = 0, endPos = tarea.value.length;
    for(var x = 0; x < lines.length; x++) {
        if(x == lineNum) {
            break;
        }
        startPos += (lines[x].length+1);

    }

    var endPos = lines[lineNum].length+startPos;

    // do selection
    // Chrome / Firefox

    if(typeof(tarea.selectionStart) != "undefined") {
        tarea.focus();
        tarea.selectionStart = startPos;
        tarea.selectionEnd = endPos;
        return true;
    }

    // IE
    if (document.selection && document.selection.createRange) {
        tarea.focus();
        tarea.select();
        var range = document.selection.createRange();
        range.collapse(true);
        range.moveEnd("character", endPos);
        range.moveStart("character", startPos);
        range.select();
        return true;
    }

    return false;
}

String.prototype.format = function() {
  var formatted = this;
  for (var i = 0; i < arguments.length; i++) {
    var regexp = new RegExp('\\{'+i+'\\}', 'gi');
    formatted = formatted.replace(regexp, arguments[i]);
  }
  return formatted;
};

//Useful Functions
function checkBin(n){return/^[01]{1,64}$/.test(n)}
function checkDec(n){return/^[0-9]{1,64}$/.test(n)}
function checkHex(n){return/^[0-9A-Fa-f]{1,64}$/.test(n)}
function pad(s,z){s=""+s;return s.length<z?pad("0"+s,z):s}
function unpad(s){s=""+s;return s.replace(/^0+/,'')}

//Decimal operations
function Dec2Bin(n){
  if(n<0) return (n>>>0).toString(2);
  if(!checkDec(n)) return 0;
  return n.toString(2)
}
function Dec2Hex(n){
  if(n<0) return (n>>>0).toString(16);
  if(!checkDec(n)) return 0;
  return n.toString(16)
}

//Binary Operations
function Bin2Dec(n){if(!checkBin(n))return 0;return parseInt(n,2).toString(10)}
function Bin2Hex(n){if(!checkBin(n))return 0;return parseInt(n,2).toString(16)}

//Hexadecimal Operations
function Hex2Bin(n){if(!checkHex(n))return 0;return parseInt(n,16).toString(2)}
function Hex2Dec(n){if(!checkHex(n))return 0;return parseInt(n,16).toString(10)}

function encodeFloat(number) {
    var n = +number,
        status = (n !== n) || n == -Infinity || n == +Infinity ? n : 0,
        exp = 0,
        len = 281, // 2 * 127 + 1 + 23 + 3,
        bin = new Array(len),
        signal = (n = status !== 0 ? 0 : n) < 0,
        n = Math.abs(n),
        intPart = Math.floor(n),
        floatPart = n - intPart,
        i, lastBit, rounded, j, exponent;
    if (status !== 0) {
        if (n !== n) {
            return 0x7fc00000;
        }
        if (n === Infinity) {
            return 0x7f800000;
        }
        if (n === -Infinity) {
            return 0xff800000
        }
    }
    i = len;
    while (i) { bin[--i] = 0;}
    i = 129;
    while (intPart && i) { bin[--i] = intPart % 2; intPart = Math.floor(intPart / 2);}
    i = 128;
    while (floatPart > 0 && i) {(bin[++i] = ((floatPart *= 2) >= 1) - 0) && --floatPart;}
    i = -1;
    while (++i < len && !bin[i]);
    if (bin[(lastBit = 22 + (i = (exp = 128 - i) >= -126 && exp <= 127 ? i + 1 : 128 - (exp = -127))) + 1]) {
        if (!(rounded = bin[lastBit])) {
            j = lastBit + 2;
            while (!rounded && j < len) { rounded = bin[j++]; }
        }
        j = lastBit + 1;
        while (rounded && --j >= 0) { (bin[j] = !bin[j] - 0) && (rounded = 0); }
    }
    i = i - 2 < 0 ? -1 : i - 3;
    while(++i < len && !bin[i]);
    (exp = 128 - i) >= -126 && exp <= 127 ? ++i : exp < -126 && (i = 255, exp = -127);
    (intPart || status !== 0) && (exp = 128, i = 129, status == -Infinity ? signal = 1 : (status !== status) && (bin[i] = 1));
    n = Math.abs(exp + 127);
    exponent = 0;
    j = 0;
    while (j < 8) {
        exponent += (n % 2) << j;
        n >>= 1;
        j++;
    }
    var mantissa = 0;
    n = i + 23;
    for (; i < n; i++) {
        mantissa = (mantissa << 1) + bin[i];
    }
    return ((signal ? 0x80000000 : 0) + (exponent << 23) + mantissa) | 0;
}


function convert(){
  var cvtFrom = parseInt($( "#cvtFromType option:selected" ).val());
  var cvtTo = parseInt($( "#cvtToType option:selected" ).val());
  var value = $( "#cvtFrom" ).val();
  switch (cvtFrom) {
    case 0:
    switch (cvtTo) {
      case 1:
      $( "#cvtTo" ).val(Bin2Hex(value));
      break;
      case 2:
      $( "#cvtTo" ).val(Bin2Dec(value));
      break;
      default:
      $( "#cvtTo" ).val(value);
      break;
    }
    break;
    case 1:
    switch (cvtTo) {
      case 0:
      $( "#cvtTo" ).val(Hex2Bin(value));
      break;
      case 2:
      $( "#cvtTo" ).val(Hex2Dec(value));
      break;
      default:
      $( "#cvtTo" ).val(value);
      break;
    }
    break;
    case 2:
    switch (cvtTo) {
      case 0:
      $( "#cvtTo" ).val(Dec2Bin(parseInt(value)));
      break;
      case 1:
      $( "#cvtTo" ).val(Dec2Hex(parseInt(value)));
      break;
      default:
      $( "#cvtTo" ).val(value);
      break;
    }
    break;
    default:
    break;
  }
}

function asrHelper(x){
  var ones = "";
  while(x--) ones+="1";
  return Bin2Dec(ones);
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

printMatch = function(match){
    for(var i = 0; i<match.length; i++){
      if(match[i]){
        console.log(match[i]);
      }
      console.log(0xFFFFF000>>>4);
    }
}

getChar = function (value) {
  var text = String.fromCharCode(value);
  if (text.trim() === '') {
      return '\u00A0\u00A0';
  } else {
      return text;
  }
}


/******* Action Dialog Code *****/

showActionDialog = function(){
  $( ".action_dialog" ).dialog({
    resizable: false,
    modal: true,
    "open": function() {
        $( "#page" ).addClass( "blur" );
        $(".action_dialog").show();
      },
      "close": function() {
        $( "#page" ).removeClass( "blur" );
        $(".action_dialog").hide();
      }
    });
}

function hideActionDialog(){
  $(".action_dialog").dialog( "close" );
}

function readFile(evt) {
  //Retrieve the first (and only!) File from the FileList object
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    var file = evt.target.files[0];
    if (file) {
      var read = new FileReader();
      read.onload = function(e){
        var contents = e.target.result;
        var data =  new Uint8Array(contents);
        for(var i = 0; i<data.length; i++){
          appendMachineCode(data[i]);
        }
    }
    //read.readAsBinaryString(file);
    read.readAsArrayBuffer(file);
  } else {
    alert("Failed to load file");
  }
 }else
  alert('The File APIs are not fully supported by your browser.');
}

function importMachineCode(evt) {
  //Retrieve the first (and only!) File from the FileList object
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    var file = evt.target.files[0];
    if (file) {
      var read = new FileReader();
      read.onload = function(e){
        var contents = e.target.result;
        var data =  new Uint8Array(contents);
        for(var i = 0; i<data.length; i++){
          appendMachineCode(data[i]);
        }
    }
    //read.readAsBinaryString(file);
    read.readAsArrayBuffer(file);
  } else {
    alert("Failed to load file");
  }
 }else
  alert('The File APIs are not fully supported by your browser.');
}

function importAssemblyCode(evt) {
  //Retrieve the first (and only!) File from the FileList object
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    var file = evt.target.files[0];
    clearAssembly();
    if (file) {
      var read = new FileReader();
      read.onload = function(e){
        var contents = e.target.result;
        var data =  new Array(contents);
        for(var i = 0; i<data.length; i++){
          appendAssembly(data[i]);
        }
    }
    read.readAsText(file);
  } else {
    alert("Failed to load file");
  }
 }else
  alert('The File APIs are not fully supported by your browser.');
}

function exportCode(){
  var editor = ace.edit("assemblyCode");
  var program = editor.getValue().split('\n')
  var code = "";
  for(var i = 0; i<program.length; i++) code+=(program[i]+"\n");
  window.location.href = "mailto:?subject=My%20ARM%20Thumb%20Program&body="+code;
}


function showSamplePrograms(){
  hideActionDialog();
  $( ".sample_dialog" ).dialog({
    resizable: false,
    modal: true,
    "open": function() {
        $(".sample_dialog").show();
      },
      "close": function() {
        $(".sample_dialog").hide();
      }
    });
}

function closeSampleDialog(){
  $(".sample_dialog").dialog( "close" );
}

/******* Sample Program Code *****/

function writeFactorial(){
  clearAssembly();
  var program = [
    "; Recusrive Factorial",
    ".code",
    "",
    "swi 2",
    "bl Factorial",
    "mov r0,r1",
    "swi 1",
    "swi 6",
    "",
    "Factorial:",
    "\tcmp r0, #1",
    "\tbgt Fact_General",
    "\tmov r1,#1",
    "\tbx lr",
    "Fact_General:",
    "\tadd sp,#-8",
    "\tmov r2,r13",
    "\tstr r0,[r2,#4]",
    "\tmov r3,r14",
    "\tstr r3,[r2,#0]",
    "\tsub r0,#1",
    "\tbl Factorial",
    "\tmov r2,r13 ; Put Stack Pointer into R2",
    "\tldr r0,[r2,#4] ; Load R0 from Memory",
    "\tmul r1,r0",
    "\tldr r2,[r2,#0] ; Load LR from Memory",
    "\tmov r14,r2 ; Put it into LR Reg",
    "\tadd sp,#8  ; Add 8 to Stack Pointer",
    "\tbx lr"
  ];
  for(var i = 0; i<program.length; i++){
    appendAssembly(program[i]+"\n");
  }
  closeSampleDialog();
}

function writeFibonnaci(){
  clearAssembly();
  var program = [
    "; Recusrive Fibonacci",
    ".code",
    "",
    "swi 2",
    "BL Fib",
    "mov r0,r1",
    "swi 1",
    "swi 6",
    "",
    "Fib:",
    "\tcmp r0, #1",
    "\tbgt Fib_General",
    "\tmov r1, r0",
    "\tbx lr",
    "Fib_General:",
    "\tadd sp,#-12",
    "\tmov r4,r14 ; Put LR into R4",
    "\tstr r4,[SP,#0] ; Push Return Address",
    "\tstr r0,[SP,#4] ; Push R0",
    "\tsub r0, #1 ; R0 = R0 -1",
    "\tBL Fib ; Brancha and Link to Fib",
    "\tstr r1,[SP,#8] ; Push Return Value",
    "\tldr r0,[SP,#4] ; POP Argument/R0",
    "\tsub r0,#2 ; R0 = R0 - 2",
    "\tBL Fib",
    "\tldr r2, [SP,#8]",
    "\tadd r1,r1,r2 ; R1 = R1 + R2",
    "\tldr r4, [SP,#0]",
    "\tmov r14,r4 ; PUT Return Value into LR ",
    "\tadd SP,#12",
    "\tbx lr"
  ];
  for(var i = 0; i<program.length; i++){
    appendAssembly(program[i]+"\n");
  }
  closeSampleDialog();
}

function writeSummation(){
  clearAssembly();
  var program = [
    "; Calculate Summation",
    ".text",
    "",
    "swi 2",
    "add r1,r0,#0",
    "loop: sub r1,#1",
    "add r0,r0,r1",
    "cmp r1,#0",
    "bne loop",
    "exit: swi 1"
  ];
  for(var i = 0; i<program.length; i++){
    appendAssembly(program[i]+"\n");
  }
  closeSampleDialog();
}


function writePUSHPOP(){
  clearAssembly();
  var program = [
    "; Random Push Pop Operation",
    ".text",
    "",
    "mov r0,#5",
    "mov r1,r0",
    "add r1,#10",
    "push {r0-r1}",
    "pop {r2-r3}",
    "mov r0,r2",
    "swi 1",
    "mov r0,r3",
    "swi 1"
  ];
  for(var i = 0; i<program.length; i++){
    appendAssembly(program[i]+"\n");
  }
  closeSampleDialog();
}
