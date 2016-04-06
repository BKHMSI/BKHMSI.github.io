var Memory = [];
var Reg    = [];
var instType = 0;

function PC(){
  return Reg[15];
}

function Fetch(){
  Reg[15] += 2;
}


function run(){
  instType = parseInt($( "#instType option:selected" ).val())
  var instructions = $("#instEncoded").val();
  var instr = instructions.split("\n");
  if(instType == 0)
    for(var i = 0; i<instr.length; i++)
        instr[i] = pad(Bin2Dec(instr[i]),16);
  else if(instType == 1)
    for(var i = 0; i<instr.length; i++)
        instr[i] = pad(Hex2Dec(instr[i]),16);

  // Decoding Then Executing Each Instruction
  for(var i = 0; i<instr.length; i++){
      decode(instr[i]);
  }
  $("#result").append("\n\n\n");
}

function decode(instr){
  var fmt = (instr) >> 13;
  switch (fmt) {
      case 0:
          return format_0(instr);
          break;
      default:
          return -1;
          break;
  }
  return -1;
}

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

function format_0(instr){
  var op = (instr >> 11) & 3;
  var rd = instr & 7;
  var rs = (instr >>  3) & 7;
  var offset5 = (instr >> 6) & 0x1F;
    switch (op) {
        case 0:
            $("#result").append("lsl\tr{0}, r{1}, #{2}\n".format(rd, rs, offset5));
            break;
        case 1:
            $("#result").append("lsr\tr{0}, r{1}, #{2}\n".format(rd, rs, offset5));
            break;
        case 2:
            $("#result").append("asr\tr{0}, r{1}, #{2}\n".format(rd, rs, offset5));
            break;
        case 3:
            offset3 = rn = offset5 & 0x07;
            if((offset5 & 0x08) == 0){
                $("#result").append("add\tr{0}, r{1}, ".format(rd, rs));
                if((offset5 & 0x10) == 0){
                    $("#result").append("r{0}\n".format(rn));
                    Reg[rd] = Reg[rs] + Reg[rn];
                }
                else {
                    $("#result").append("r{0}\n".format(rn));
                    Reg[rd] = Reg[rs] + offset3;
                }
            }else{
                $("#result").append("sub\tr{0}, r{1}, ".format(rd, rs));
                if((offset5 & 0x10) == 0){
                    $("#result").append("r{0}\n".format(rn));
                    Reg[rd] = Reg[rs] - Reg[rn];
                }else{
                    $("#result").append("r{0}\n".format(offset3));
                    Reg[rd] = Reg[rs] - offset3;
                }
            }
            break;
        default:
            break;
    }
}

//Useful Functions
function checkBin(n){return/^[01]{1,64}$/.test(n)}
function checkDec(n){return/^[0-9]{1,64}$/.test(n)}
function checkHex(n){return/^[0-9A-Fa-f]{1,64}$/.test(n)}
function pad(s,z){s=""+s;return s.length<z?pad("0"+s,z):s}
function unpad(s){s=""+s;return s.replace(/^0+/,'')}

//Decimal operations
function Dec2Bin(n){if(!checkDec(n)||n<0)return 0;return n.toString(2)}
function Dec2Hex(n){if(!checkDec(n)||n<0)return 0;return n.toString(16)}

//Binary Operations
function Bin2Dec(n){if(!checkBin(n))return 0;return parseInt(n,2).toString(10)}
function Bin2Hex(n){if(!checkBin(n))return 0;return parseInt(n,2).toString(16)}

//Hexadecimal Operations
function Hex2Bin(n){if(!checkHex(n))return 0;return parseInt(n,16).toString(2)}
function Hex2Dec(n){if(!checkHex(n))return 0;return parseInt(n,16).toString(10)}

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

function readFile(evt) {
   //Retrieve the first (and only!) File from the FileList object
   if (window.File && window.FileReader && window.FileList && window.Blob) {
     var file = evt.target.files[0];
     if (file) {
       var read = new FileReader();
       read.onload = function(e) {
         var contents = e.target.result;
         $("#instEncoded").val(contents);
         alert( "Got the file.n"
               +"name: " + f.name + "n"
               +"type: " + f.type + "n"
               +"size: " + f.size + " bytesn"
               + "starts with: " + contents.substr(1, contents.indexOf("n"))
         );
       }
       read.readAsText(file);
     } else {
       alert("Failed to load file");
     }
   }else {
    alert('The File APIs are not fully supported by your browser.');
  }
}
