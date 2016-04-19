var regHtml = "";

function displayPlaceHolder(value){
  var placeholder = "";
  if(value = 0)
     placeholder = "Enter Instructions in Binary (base 2)";
  else if(value == 1)
     placeholder = "Enter Instructions in Hexadecimal (base 16)";
  else if(value == 2)
     placeholder = "Enter Instructions in Decimal (base 10)";
  $("#sourceCode").attr("placeholder", placeholder);
}

function updateRegTable(){
  regHtml = "<table id=\"table_id\" class=\"display\"><thead><tr>";
  regHtml+="<td>Reg #</td>";
  regHtml+="<td>Binary</td>";
  regHtml+="<td>Hexadecimal</td>";
  regHtml+="<td>Decimal</td>";
  regHtml+="</tr></thead><tbody>";
  for(var i = 0; i<Reg.length; i++){
    regHtml+="<tr><td>"+i+"</td>";
    regHtml+="<td>"+pad(Dec2Bin(Reg[i]),16)+"</td>";
    regHtml+="<td>"+pad(Dec2Hex(Reg[i]),16)+"</td>";
    regHtml+="<td>"+Reg[i]+"</td></tr>";
  }
  regHtml+="</tbody></table>";
  $(regHtml).appendTo("#regs");
  $('#table_id').DataTable();
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

function asrHelper(x){
  var ones = "";
  while(x--) ones+="1";
  return Bin2Dec(ones);
}

function readFile(evt) {
  //Retrieve the first (and only!) File from the FileList object
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    var file = evt.target.files[0];
    if (file) {
      var read = new FileReader();
      read.onload = function(e){
        var contents = e.target.result;
        $("#sourceCode").val(contents);
        // for(var i = 0; i<contents.length; i+=2){
        //   $("#sourceCode").append(pad(contents.charCodeAt(i).toString(2),8));
        //   if(i%2)
        //     $("#sourceCode").append(pad(contents.charCodeAt(i+1).toString(2),8));
        //   else
        //     $("#sourceCode").append(pad(contents.charCodeAt(i+1).toString(2),8)+'\n');
        // }
    }
    read.readAsBinaryString(file);
  } else {
    alert("Failed to load file");
  }
 }else
  alert('The File APIs are not fully supported by your browser.');
}
