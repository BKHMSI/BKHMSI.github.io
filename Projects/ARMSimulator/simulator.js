var instType = 0;
var stepIndex = 0;
var outputIdx = 0;
var format00 = ["lsl","lsr","asr"];
var format10 = ["mov","cmp","add","sub"];
var format20 = ["and", "eor", "lsl", "lsr", "asr", "adc","sbc","ror","tst","neg","cmp","cmn","orr","mul","bic","mvn"];
var format30 = ["str","ldr","strb","ldrb"];
var format61 = ["beq","bne","bcs","bcc","bmi","bpl","bvs","bvc","bhi","bls","bge","blt","bgt","ble"];
var format40 = ["strh", "ldrh"];
var format41 = ["str", "ldr"];
var format50 = ["pc", "sp"];
var pc, sp;

function PC(scope){ return scope.regs[15]; }

function LR(scope){ return scope.regs[14]; }

function SP(scope){ return scope.regs[13];}


function decode(instr,scope){
  var fmt = (instr) >> 13;
  switch (fmt) {
    case 0:
    format_0(instr,scope);
    break;
    case 1:
    format_1(instr,scope);
    break;
    case 2:
    format_2(instr,scope);
    break;
    case 3:
    format_3(instr,scope);
    break;
    case 4:
    format_4(instr,scope);
    break;
    case 5:
    format_5(instr,scope);
    break;
    case 6:
    format_6(instr,scope);
    break;
    case 7:
    format_7(instr,scope);
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

function format_0(instr,scope){
  var op = (instr >> 11) & 3;
  var rd = instr & 7;
  var rs = (instr >>  3) & 7;
  var offset5 = (instr >> 6) & 0x1F;
  switch (op) {
    case 0: scope.regs[rd] = scope.regs[rs] << offset5; break;
    case 1: scope.regs[rd] = scope.regs[rs] >> offset5; break;
    case 2:
      // asr Reg[rd] = scope.regs[rs] >> offset5; break;
    case 3:
    offset3 = rn = offset5 & 0x07;
    if((offset5 & 0x08) == 0){
      $("#result").append("add\tr{0}, r{1}, ".format(rd, rs));
      if((offset5 & 0x10) == 0){
        $("#result").append("r{0}\n".format(rn));
        scope.regs[rd] = scope.regs[rs] + scope.regs[rn];
      }
      else {
        $("#result").append("r{0}\n".format(rn));
        scope.regs[rd] = scope.regs[rs] + offset3;
      }
    }else{
      $("#result").append("sub\tr{0}, r{1}, ".format(rd, rs));
      if((offset5 & 0x10) == 0){
        $("#result").append("r{0}\n".format(rn));
        scope.regs[rd] = scope.regs[rs] - scope.regs[rn];
      }else{
        $("#result").append("r{0}\n".format(offset3));
        scope.regs[rd] = scope.regs[rs] - offset3;
      }
    }
    break;
    default:
    $("#result").append("{0}\tr{1}, r{2}, #{3}\n".format(format00[op],rd, rs, offset5));
    break;
  }
}

function format_1(instr,scope){
  var op = (instr >> 11) & 3;
  var rd = (instr >> 8) & 7;
  var offset8 = instr & 0xFF;
  $("#result").append("{0}\t r{1}, #{2}\n".format(format10[op],rd,offset8));
  switch (op) {
    case 0: scope.regs[rd] = offset8; break;
    case 1: scope.regs[rd] = scope.regs[rd] - offset8; break;
    case 2: scope.regs[rd] = scope.regs[rd] + offset8; break;
    case 3: scope.regs[rd] = scope.regs[rd] - offset8; break;
    default:
  }
}

function format_2(instr,scope){
  var subformat = (instr >> 10) & 7;
  var op, rs, rd, ro;
  var l, b, h, s, hi1, hi2, offset8;

  if(!op){
    // Format 4
    op = (instr >> 6) & 0xF;
    rs = (instr >> 3) & 7;
    rd = (instr) & 7;
    $("#result").append("{0}\t r{1}, r{2}\n".format(format20[op],rd,rs));
    // var format20 = ["and", "eor", "lsl", "lsr", "asr", "adc","sbc","ror","tst","neg","cmp","cmn","orr","mul","bic","mvn"];
    switch (op) {
      case 1: scope.regs[rd] = scope.regs[rd] & offset8; break;
      case 1: scope.regs[rd] = scope.regs[rd] ^ offset8; break;
      case 2: scope.regs[rd] = scope.regs[rd] << offset8; break;
      case 3: scope.regs[rd] = scope.regs[rd] >> offset8; break;
      // Complete from 4 to 14
      case 4: scope.regs[rd] = scope.regs[rd] >> offset8; break;
      case 5: scope.regs[rd] = scope.regs[rd] - offset8; break;
      case 6: scope.regs[rd] = scope.regs[rd] - offset8; break;
      case 7: scope.regs[rd] = scope.regs[rd] - offset8; break;
      case 8: scope.regs[rd] = scope.regs[rd] - offset8; break;
      case 9: scope.regs[rd] = scope.regs[rd] - offset8; break;
      case 10: scope.regs[rd] = scope.regs[rd] - offset8; break;
      case 11: scope.regs[rd] = scope.regs[rd] - offset8; break;
      case 12: scope.regs[rd] = scope.regs[rd] - offset8; break;
      case 13: scope.regs[rd] = scope.regs[rd] - offset8; break;
      case 14: scope.regs[rd] = scope.regs[rd] - offset8; break;

      default:
    }
  }else if(op == 1){
    // Format 5
    op = (instr >> 8) & 3;
    hi1 = (instr >> 7) & 1;
    hi2 = (instr >> 6) & 1;
    rs = (instr >> 3) & 7;
    rd = (instr) & 7;
    format_21(op,hi1,hi2,rs,rd,scope.regs);
  }else if(op<=3){
    // Format 6: PC Relative Load
    rd = (instr >> 8) & 7;
    offset8 = instr & 0xFF;
    $("#result").append("LDR\t r{0},[PC, #{1}]\n".format(rd,offset8));
  }else if(!((instr >> 9) & 1) && ((instr >> 12) & 1)){
    // Format 7: load/store with scope.regsister offset
    l = (instr>>11) & 0xF;
    b = (instr>>10) & 0x1F;
    rd = instr & 7;
    rb = (instr >> 3) & 7;
    ro = (instr >> 6) & 7;
    format_23(l,b,rd,rb,ro,scope.regs);
  }else if(((instr >> 12) & 1) && ((instr >> 9) & 1)){
    // Format 8: load/store sign-extended byte/halfword
    h = (instr>>11) & 0xF;
    s = (instr>>10) & 0x1F;
    rd = instr & 7;
    rb = (instr >> 3) & 7;
    ro = (instr >> 6) & 7;
    format_24(h,s,rd,rb,ro,scope.regs);
  }
}

function format_21(op,hi1,hi2,rs,rd,Reg){
  switch (op) {
    case 0:
    if(hi1 && hi2)
    $("#result").append("add\t h{0}, h{1}\n".format(rd,rs));
    else if (hi1 && !hi2)
    $("#result").append("add\t r{0}, h{1}\n".format(rd,rs));
    else
    $("#result").append("add\t h{0}, r{1}\n".format(rd,rs));
    break;
    case 1:
    if(hi1 && hi2)
    $("#result").append("cmp\t h{0}, h{1}\n".format(rd,rs));
    else if (hi1 && !hi2)
    $("#result").append("cmp\t r{0}, h{1}\n".format(rd,rs));
    else
    $("#result").append("cmp\t h{0}, r{1}\n".format(rd,rs));
    break;
    case 2:
    if(hi1 && hi2)
    $("#result").append("mov\t h{0}, h{1}\n".format(rd,rs));
    else if (hi1 && !hi2)
    $("#result").append("mov\t r{0}, h{1}\n".format(rd,rs));
    else
    $("#result").append("mov\t h{0}, r{1}\n".format(rd,rs));
    break;
    case 1:
    if(!hi1 && !hi2)
    $("#result").append("bx\t r{0}\n".format(rs));
    else
    $("#result").append("bx\t h{0}\n".format(rs));
    break;
    default:
  }
}

function format_23(l,b,rd,rb,ro,Reg){
  if(!l && !b){
    $("#result").append("str\t r{0},[r{1}, r{2}]\n".format(rd,rb,ro));
  }else if(!l && b){
    $("#result").append("strb\t r{0},[r{1}, r{2}]\n".format(rd,rb,ro));
  }else if(l && !b){
    $("#result").append("ldr\t r{0},[r{1}, r{2}]\n".format(rd,rb,ro));
  }else if(l && b){
    $("#result").append("ldrb\t r{0},[r{1}, r{2}]\n".format(rd,rb,ro));
  }
}

function format_24(h,s,rd,rb,ro,Reg){
  if(!l && !b){
    $("#result").append("strh\t r{0},[r{1}, r{2}]\n".format(rd,rb,ro));
  }else if(!l && b){
    $("#result").append("ldrh\t r{0},[r{1}, r{2}]\n".format(rd,rb,ro));
  }else if(l && !b){
    $("#result").append("ldsb\t r{0},[r{1}, r{2}]\n".format(rd,rb,ro));
  }else if(l && b){
    $("#result").append("ldsh\t r{0},[r{1}, r{2}]\n".format(rd,rb,ro));
  }
}

function format_3(instr,scope){
  var bl, rb, rd, offset5;
  bl = (instr >> 11) & 3;
  rb = (instr >> 3) & 7;
  rd = (instr) & 7;
  offset5 = (instr >> 6) & 0x1F;
  $("#result").append("{0}\t r{1},[r{2}, #{3}]\n".format(format30[bl],rd,rb,offset5));
  switch (bl) {
    case 0:
    // STR
    break;
    case 1:
    // LDR
    break;
    case 2:
    // STRB
    break;
    case 3:
    // LDRB
    break;
    default:
  }

}

//Load/store half word
function format_4(instr,scope){
  var op = (instr >> 12) & 1;
  var L = (instr >> 11) & 1;
  var rb = (instr >> 3) & 3;
  var rd = instr & 3;
  var offset5 = (instr >> 6) & 5;

  switch (op){

    case 0:
    switch (L) {
      case 1:
      scope.regs[Rb + offset5] = Memory[rd];
      $("#result").append("{0}\t r{1}, [r{2}, #{3}]\n".format(format40[op], rd, rb, offset5));
      break;
      case 0:
      Memory[Rb + offset5] = scope.regs[rd];
      $("#result").append("{0}\t r{1}, [r{2}, #{3}]\n".format(format40[op], rd, rb, offset5));
      break;
    }

    break;

    case 1:
    format_41(instr,scope);
    break;
  }
}

//sp relative load/store
function format_41(instr,scope){
  var L = (instr >> 11) & 1;
  var rd = (instr >> 8) & 3;
  var word8 = instr & 8;

  switch (L)  {
    case 1:
    scope.regs[rd] = Memory[scope.regs[13] + word8];
    $("#result").append("{0}\t r{1}, [SP, #{2}]\n".format(format41[op], rd, word8));
    break;
    case 0:
    Memory[rd] = scope.regs[scope.regs[13] + word8];
    $("#result").append("{0}\t r{1}, [SP, #{2}]\n".format(format41[op], rd, word8));
    break;
  }
}
//load address
function format_5(instr,scope){
  var op = (instr >> 12) & 1;
  var src = (instr >> 11) & 1;
  var rd = (instr >> 8) & 3;
  var word8 = instr & 8;

  switch (op) {
    case 0:

    switch(src){
      case 0:
      scope.regs[rd] = Memory[word8 + PC];
      $("#result").append("add\t r{0}, {1}, #{2}\n".format(rd, format50[src],  word8));
      break;

      case 1:
      scope.regs[rd] = Memory[word8 + scope.regs[13]];
      $("#result").append("add\t r{0}, {1}, #{2}\n".format(rd, format50[src],  word8));
      break;
    }
    break;

    case 1:
    format_51(instr,scope);
    break;

  }
}

function format_51(instr,scope){
  var op = (instr >> 8) & 5;
  var S = (instr >> 7) & 1;
  var SWord7 = instr & 7;

  switch (op){
    case 0:

    switch(S){
      case 0:
      scope.regs[13] = scope.regs[13] + SWord7;
      $("#result").append("add\t SP, #{0}\n".format(SWord7));
      break;
      case 1:
      scope.regs[13] = scope.regs[13] - SWord7;
      $("#result").append("add\t SP, #-{0}\n".format(SWord7));
      break;
    }
    break;

    default:
    format_52(instr,scope);
    break;
  }
}

function format_52(instr,scope){
  var L = (instr >> 11) & 1;
  var R = (instr >> 8) & 1;
  var Rlist = instr & 8;
  var RListString = getListString(Rlist);
  var RListArray = getList(Rlist);
  var ArrayLength = RListArray.length;

  switch(L){
    case 0:

    switch(R){
      case 0:

      for (var i = ArrayLength - 1; i >= 0; i--) {
        // Memory[SP] = RListArray[i];
        // SP--;
      }
      $("#result").append("push\t {{0}}\n".format(RListString));

      break;
      case 1:

      for (var i = ArrayLength - 1; i >= 0; i--) {
         //Memory[SP] = RListArray[i];
         memory.store(RListArray[i], sp);
         // SP--;
      }

      // Memory[SP] = scope.regs[14];
      // SP--;

      $("#result").append("push\t {{0}, LR}\n".format(RListString));

      break;
    }

    break;

    case 1:

    switch(R){
      case 0:

      for (var i = 0; i <= ArrayLength - 1; i--) {
        // Memory[SP] = RListArray[i];
        // SP++;
      }
      $("#result").append("pop\t {{0}}\n".format(RListString));

      break;
      case 1:

      for (var i = 0; i <= ArrayLength - 1; i--) {
        // Memory[SP] = RListArray[i];
        // SP++;
      }

      // Memory[SP] = PC;
      // SP++;

      $("#result").append("push\t {{0}, PC}\n".format(RListString));

      break;
    }
    break;
  }
}


function format_6(instr,scope){
  var cond, sOffSet8, value8, rb, rlist;
  if(((instr>>8) & 0x1F) == 0x1F){
    value8 = instr & 0xFF;
    $("#result").append("SWI\t {0}\n".format(value8));
    switch (value8) {
      case 0: output[outputIdx++] = String.fromCharCode(scope.regs[0]); break;
      case 1: output[outputIdx++] = scope.regs[0]; break;
      case 0x69:
        var start = scope.regs[1];
        var char = Mem.load(start);
        while(char){
            output[outputIdx++] = String.fromCharCode(char);
            char = Mem.load(start++);
        }
      break;
      case 3:
        break;

      default:

    }
  }else if(instr & 0x1000){
    cond = (instr >> 8) & 0xF;
    sOffSet8 = instr & 0xFF;
    format_61(cond,sOffSet8,scope.regs);
  }else{
    l = (instr >> 11) & 1;
    rb = (instr >> 8) & 7;
    rlist = (instr) & 0xFF;
    if(l){
      $("#result").append("STMI\t r{0}!, {{1}}\n".format(rb,getList(rlist)));
    }else{
      $("#result").append("LDMI\t r{0}!, {{1}}\n".format(rb,getList(rlist)));
    }
  }
}

function getListString(list){
  var result = "";
  var i, j = 0;
  for(i = j; i<8; i++){
    if(list>>i){
      for(j = i; j<8; j++)
        if(!(list>>j))
            break;
    }
    if(i+1 == j) result += ("r"+i);
    else result += ("r"+i+"-r"+j);
    if(i != 7) result+=", ";
  }
  return result;
}

function getList(list){
  var arr = [];
  for(var i = 0; i<8; i++)
  if(list>>i) arr.push(i);
  return arr;
}

function format_61(cond,sOffSet8,Reg){
  $("#result").append("{0}}\t {1}\n".format(format61[cond],sOffSet8));
}

function format_7(instr,scope){
  var h, offet10;
  if(((instr >> 12)&1)){
    // Format 19
    h = (instr >> 11) & 1;
    offset10 = (instr) & 0x7FF;
    format_71(h,offset10,scope.regs);
  }else{
    //Branch PC relative +/- Offset11 << 1, where label is PC +/- 2048 bytes.
    offset10 = (instr) & 0x7FF;
    $("#result").append("B\t {0}\n".format(Dec2Hex(offset10)));
  }
}

function format_71(h,offset10,Reg){
  if(h){
    //LR := PC + OffsetHigh << 12
    $("#result").append("BL\t {0}\n".format(Dec2Hex(offset10)));
  }else{
    //temp := next instruction address
    //PC := LR + OffsetLow << 1
    //LR := temp | 1
  }
}
