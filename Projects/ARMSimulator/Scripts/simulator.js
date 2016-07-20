

var instType = 0;
var stepIndex = 0;
var outputIdx = 0;
var overflow = 0;
var format00 = ["lsl","lsr","asr"];
var format10 = ["mov","cmp","add","sub"];
var format20 = ["and", "eor", "lsl", "lsr", "asr", "adc","sbc","ror","tst","neg","cmp","cmn","orr","mul","bic","mvn"];
var format30 = ["str","ldr","strb","ldrb"];
var format61 = ["beq","bne","bcs","bcc","bmi","bpl","bvs","bvc","bhi","bls","bge","blt","bgt","ble"];
var format40 = ["strh", "ldrh"];
var format41 = ["str", "ldr"];
var format50 = ["PC", "SP"];
var condVal = 0;
var usingMonitor = false;

function PC(scope){ return scope.regs[15]; }

function LR(scope){ return scope.regs[14]; }

function SP(scope){ return scope.regs[13];}

String.prototype.format = function() {
  var formatted = this;
  for (var i = 0; i < arguments.length; i++) {
    var regexp = new RegExp('\\{'+i+'\\}', 'gi');
    formatted = formatted.replace(regexp, arguments[i]);
  }
  return formatted;
};

function setConditionFlags(scope){
  scope.flags[0] = (condVal == 0) ? 1:0;
  scope.flags[1] = (condVal>=0xFFFFFFFF) ? 1:0;
  scope.flags[2] = (condVal < 0) ? 1:0;
  scope.flags[3] = overflow ? 1:0;
}


app.service('simulator', [function () {
  var simulator = {
    decode: function(instr,scope){
      usingMonitor = scope.showGFXDisplay;
      var fmt = (instr) >> 13;
      switch (fmt) {
        case 0:
        this.format_0(instr,scope);
        break;
        case 1:
        this.format_1(instr,scope);
        break;
        case 2:
        this.format_2(instr,scope);
        break;
        case 3:
        this.format_3(instr,scope);
        break;
        case 4:
        this.format_4(instr,scope);
        break;
        case 5:
        this.format_5(instr,scope);
        break;
        case 6:
        this.format_6(instr,scope);
        break;
        case 7:
        this.format_7(instr,scope);
        break;
        default:
        return -1;
        break;
      }
      return -1;
    },

    isOverFlow: function(x,y,z){
        if(x < 0 && y < 0 && z >= 0)
            return 1;
        else if(x > 0 && y > 0 && z < 0)
            return 1;
        else
            return 0;
    },

    isCarry: function(x,y){
      if((x >= 0 && y < 0) || (x < 0 && y >= 0))
          return 0; // no carry if opposite signs
      return x+y>=0xFFFFFFFF;
    },

    isShiftOverflow: function(x,y){
      var j = -1;
      for(var i = 0; i<32; i++)
          if(x>>i) j = i;
      if(j == -1) return 0;
      return (32-j)<=y;
    },

    format_0: function(instr,scope){
      var op = (instr >> 11) & 3;
      var rd = instr & 7;
      var rs = (instr >>  3) & 7;
      var offset5 = (instr >> 6) & 0x1F;
      //offset5 = getImmediate(offset5,0x1F);
      switch (op) {
        case 0:
        overflow = this.isShiftOverflow(scope.regs[rs],offset5);
        scope.regs[rd] = scope.regs[rs] << offset5;
        appendResult("{0}\tr{1}, r{2}, #{3}\n".format(format00[op],rd, rs, offset5));
        break;
        case 1:
         scope.regs[rd] = scope.regs[rs] >> offset5;
         appendResult("{0}\tr{1}, r{2}, #{3}\n".format(format00[op],rd, rs, offset5));
        break;
        case 2:
          // 0001000101001000
          signBit = (scope.regs[rd] >> 31) & 1;
          scope.regs[rd] = scope.regs[rs] >> offset5;
          if(signBit){
            var ones = asrHelper(offset5);
            scope.regs[rd] = scope.regs[rd] + (ones << (32-offset5));
          }
          appendResult("{0}\tr{1}, r{2}, #{3}\n".format(format00[op],rd, rs, offset5));
          break;
        case 3:
        offset3 = rn = offset5 & 0x07;
        if((offset5 & 0x08) == 0){
          appendResult("add\tr{0}, r{1}, ".format(rd, rs));
          if((offset5 & 0x10) == 0){
            appendResult("r{0}\n".format(rn));
            scope.regs[rd] = scope.regs[rs] + scope.regs[rn];
            overflow = this.isOverFlow(scope.regs[rs], scope.regs[rn],scope.regs[rd]);
          }
          else {
            appendResult("#{0}\n".format(rn));
            scope.regs[rd] = scope.regs[rs] + offset3;
            overflow = this.isOverFlow(scope.regs[rs],offset3,scope.regs[rd]);
          }
        }else{
          appendResult("sub\tr{0}, r{1}, ".format(rd, rs));
          if((offset5 & 0x10) == 0){
            appendResult("r{0}\n".format(rn));
            scope.regs[rd] = scope.regs[rs] - scope.regs[rn];
          }else{
            appendResult("#{0}\n".format(offset3));
            scope.regs[rd] = scope.regs[rs] - offset3;
          }
        }
        break;
        default:
        break;
      }
      condVal = scope.regs[rd];
      setConditionFlags(scope);
    },

    format_1: function(instr,scope){
      // MOV 001 00 001 00000100
      var op = (instr >> 11) & 3;
      var rd = (instr >> 8) & 7;
      var offset8 = instr & 0xFF;
      appendResult("{0}\t r{1}, #{2}\n".format(format10[op],rd,offset8));
      switch (op) {
        case 0: scope.regs[rd] = offset8;  break;
        case 1: condVal = scope.regs[rd] - offset8; break;
        case 2:
           scope.regs[rd] = scope.regs[rd] + offset8;
           overflow = this.isOverFlow(scope.regs[rd],offset8,scope.regs[rd]);
           break;
        case 3: scope.regs[rd] = scope.regs[rd] - offset8; break;
        default:
      }
      if(op!=1) condVal = scope.regs[rd];
      setConditionFlags(scope);
    },

    format_2: function(instr,scope){
      var subformat = (instr >> 10) & 7;
      var op, rs, rd, ro;
      var l, b, h, s, hi1, hi2, offset8;
      var signBit = 0;

      if(!subformat){
        // Format 4
        op = (instr >> 6) & 0xF;
        rs = (instr >> 3) & 7;
        rd = (instr) & 7;
        appendResult("{0}\t r{1}, r{2}\n".format(format20[op],rd,rs));
        // var format20 = ["and", "eor", "lsl", "lsr", "asr", "adc","sbc","ror","tst","neg","cmp","cmn","orr","mul","bic","mvn"];
        switch (op) {
          case 0: scope.regs[rd] = scope.regs[rd] & scope.regs[rs]; break;
          case 1: scope.regs[rd] = scope.regs[rd] ^ scope.regs[rs]; break;
          case 2:
            scope.regs[rd] = scope.regs[rd] << scope.regs[rs];
            overflow = this.isShiftOverflow(scope.regs[rd],scope.regs[rs]);
            break;
          case 3: scope.regs[rd] = scope.regs[rd] >> scope.regs[rs]; break;
          case 4:
            // TODO: Check ASR
            signBit = (scope.regs[rd] >> 31) & 1;
            scope.regs[rd] = scope.regs[rd] >> scope.regs[rs];
            if(signBit){
              var ones = parseInt(asrHelper(scope.regs[rs]));
              scope.regs[rd] = scope.regs[rd] + (ones << (32-scope.regs[rs]));
            }
            break;
          case 5:
            // ADC
            scope.regs[rd] = scope.regs[rd] + scope.regs[rs] + scope.flags[1];
            overflow = this.isOverFlow(scope.regs[rd],scope.regs[rs]+1,scope.regs[rd]);
            break;
          case 6:
            // SBC
            scope.regs[rd] = scope.regs[rd] - scope.regs[rs] - ~scope.flags[1];
            break;
          case 7:
              // ROR
              var moves =  scope.regs[rs];
              var x = scope.regs[rd];
              scope.regs[rd] =  (x >> moves) | (x << (32 - moves));
              break;
          case 8:
              // TST
              condVal = scope.regs[rs] & scope.regsp[rd];
              break;
          case 9:
              // NEG
            scope.regs[rd] = -scope.regs[rs];
            break;
          case 10:
            // CMP
            condVal = scope.regs[rd] - scope.regs[rs];
            break;
          case 11:
            // CMN
           condVal = scope.regs[rd] + scope.regs[rs];
           break;
          case 12:
            // ORRS
            scope.regs[rd] = scope.regs[rd] | scope.regs[rs]; break;
          case 13:
            // MUL
            scope.regs[rd] = scope.regs[rd] * scope.regs[rs]; break;
          case 14:
            // BIC
            scope.regs[rd] = scope.regs[rd] & (~scope.regs[rs]); break;
          case 15:
            // MVN
            scope.regs[rd] = ~scope.regs[rs]; break;
          default:
        }
        if(op!=8){
          if(op!=10){ condVal = scope.regs[rd];}
        }
      }else if(subformat == 1){
        // Format 5
        op = (instr >> 8) & 3;
        hi1 = (instr >> 7) & 1;
        hi2 = (instr >> 6) & 1;
        rs = (instr >> 3) & 7;
        rd = (instr) & 7;
        this.format_21(op,hi1,hi2,rs,rd,scope);
      }else if(subformat<=3){
        // Format 6: PC Relative Load
        rd = (instr >> 8) & 7;
        offset8 = instr & 0xFF;
        appendResult("LDR\t r{0},[PC, #{1}]\n".format(rd,offset8));
        scope.regs[rd] = scope.memory.load(scope.pc+offset8);
      }else if(!((instr >> 9) & 1) && ((instr >> 12) & 1)){
        // Format 7: load/store with scope.regsister offset
        l = (instr>>11) & 0x1;
        b = (instr>>10) & 0x1;
        rd = instr & 7;
        rb = (instr >> 3) & 7;
        ro = (instr >> 6) & 7;
        this.format_23(l,b,rd,rb,ro,scope);
      }else if(((instr >> 12) & 1) && ((instr >> 9) & 1)){
        // Format 8: load/store sign-extended byte/halfword
        h = (instr>>11) & 0xF;
        s = (instr>>10) & 0x1F;
        rd = instr & 7;
        rb = (instr >> 3) & 7;
        ro = (instr >> 6) & 7;
        this.format_24(h,s,rd,rb,ro,scope);
      }
      setConditionFlags(scope);
    },

    format_21: function(op,hi1,hi2,rs,rd,scope){
      var cond = 0;
      switch (op) {
        case 0:
        if(hi1 && hi2){
          rd+=8;rs+=8;
          appendResult("add\t r{0}, r{1}\n".format(rd,rs));
          switch (rd) {
            case 13:  scope.sp = (scope.regs[rd]) + (scope.regs[rs]);break;
            case 14:  scope.lr = (scope.regs[rd]) + (scope.regs[rs]);break;
            case 15:  scope.pc = (scope.regs[rd]) + (scope.regs[rs]);break;
            default:  scope.regs[rd] = (scope.regs[rd]) + (scope.regs[rs]);break;
          }
          scope.regs[13] = scope.sp;
          scope.regs[14] = scope.lr;
          scope.regs[15] = scope.pc;
          overflow = this.isOverFlow(scope.regs[rd],scope.regs[rs],scope.regs[rd]);
        }else if (!hi1 && hi2){
          rs+=8;
          appendResult("add\t r{0}, r{1}\n".format(rd,rs));
          scope.regs[rd] = (scope.regs[rd]) + (scope.regs[rs]);
          overflow = this.isOverFlow(scope.regs[rd],scope.regs[rs],scope.regs[rd]);
        }else{
          rd+=8;
          appendResult("add\t r{0}, r{1}\n".format(rd,rs));
          switch (rd) {
            case 13:  scope.sp = (scope.regs[rd]) + (scope.regs[rs]);break;
            case 14:  scope.lr = (scope.regs[rd]) + (scope.regs[rs]);break;
            case 15:  scope.pc = (scope.regs[rd]) + (scope.regs[rs]);break;
            default:  scope.regs[rd] = (scope.regs[rd]) + (scope.regs[rs]);break;
          }
          scope.regs[13] = scope.sp;
          scope.regs[14] = scope.lr;
          scope.regs[15] = scope.pc;
          overflow = this.isOverFlow(scope.regs[rd],scope.regs[rs],scope.regs[rd]);
        }
        break;
        case 1:
        if(hi1 && hi2){
          rd+=8;rs+=8;
          appendResult("cmp\t r{0}, r{1}\n".format(rd,rs));
          condVal = scope.regs[rd] - scope.regs[rs];
        }else if (!hi1 && hi2){
          rs+=8;
          appendResult("cmp\t r{0}, r{1}\n".format(rd,rs));
          condVal = (scope.regs[rd]) - (scope.regs[rs]);
        }else{
          rd+=8;
          appendResult("cmp\t r{0}, r{1}\n".format(rd,rs));
          condVal = scope.regs[rd] - scope.regs[rs];
        }
        break;
        case 2:
        if(hi1 && hi2){
          rd+=8;rs+=8;
          appendResult("mov\t r{0}, r{1}\n".format(rd,rs));
          switch (rd) {
            case 13:  scope.sp = (scope.regs[rs]); break;
            case 14:  scope.lr = (scope.regs[rs]); break;
            case 15:  scope.pc = (scope.regs[rs]); break;
            default:  scope.regs[rd] = (scope.regs[rs]);;break;
          }
          scope.regs[13] = scope.sp;
          scope.regs[14] = scope.lr;
          scope.regs[15] = scope.pc;
        }else if (!hi1 && hi2){
          rs+=8;
          appendResult("mov\t r{0}, r{1}\n".format(rd,rs));
          scope.regs[rd] = scope.regs[rs];
        }else{
          rd+=8;
          switch (rd) {
            case 13:  scope.sp = (scope.regs[rs]); break;
            case 14:  scope.lr = (scope.regs[rs]); break;
            case 15:  scope.pc = (scope.regs[rs]); break;
            default:  scope.regs[rd] = (scope.regs[rs]);;break;
          }
          scope.regs[13] = scope.sp;
          scope.regs[14] = scope.lr;
          scope.regs[15] = scope.pc;
          appendResult("mov\t r{0}, r{1}\n".format(rd,rs));
          scope.regs[rd] = scope.regs[rs];
        }
        break;
        case 3:
        if(!hi1 && !hi2){
          appendResult("bx\t r{0}\n".format(rs));
          scope.pc = scope.regs[rs];
        }else{
          rs+=8;
          if(rs == 15){
            scope.pc = scope.pc;
          }else if(rs == 14){
            scope.pc = scope.lr;
          }else if(rs == 13){
            scope.pc = scope.sp;
          }else{
            scope.pc = scope.regs[rs];
          }
          appendResult("bx\t r{0}\n".format(rs));
        }
        break;
        default:
      }
    },

    format_23: function(l,b,rd,rb,ro,scope){
      if(!l && !b){
        appendResult("str\t r{0},[r{1}, r{2}]\n".format(rd,rb,ro));
        scope.memory.storeWord(scope.regs[rb]+scope.regs[ro],scope.regs[rd]);
      }else if(!l && b){
        appendResult("strb\t r{0},[r{1}, r{2}]\n".format(rd,rb,ro));
        scope.memory.store(scope.regs[rb]+scope.regs[ro],scope.regs[rd]);
      }else if(l && !b){
        appendResult("ldr\t r{0},[r{1}, r{2}]\n".format(rd,rb,ro));
        scope.regs[rd] = scope.memory.loadWord(scope.regs[rb]+scope.regs[ro]);
      }else if(l && b){
        appendResult("ldrb\t r{0},[r{1}, r{2}]\n".format(rd,rb,ro));
        scope.regs[rd] = scope.memory.load(scope.regs[rb]+scope.regs[ro]);
      }
    },

    format_24: function(h,s,rd,rb,ro,scope){
      var signBit = 0;
      if(!l && !b){
        appendResult("strh\t r{0},[r{1}, r{2}]\n".format(rd,rb,ro));
        scope.memory.storeHalf(scope.regs[rb]+scope.regs[ro],scope.regs[rd]);
      }else if(!l && b){
        appendResult("ldrh\t r{0},[r{1}, r{2}]\n".format(rd,rb,ro));
        scope.regs[rd] = scope.memory.loadHalf(scope.regs[rb]+scope.regs[ro]);
      }else if(l && !b){
        appendResult("ldsb\t r{0},[r{1}, r{2}]\n".format(rd,rb,ro));
        scope.regs[rd] = scope.memory.load(scope.regs[rb]+scope.regs[ro]);
        signBit = (scope.regs[rd]>>7) & 1;
        scope.regs[rd] = scope.regs[rd] | (signBit ? 0xFFFFFF00:0);
      }else if(l && b){
        appendResult("ldsh\t r{0},[r{1}, r{2}]\n".format(rd,rb,ro));
        scope.regs[rd] = scope.memory.loadHalf(scope.regs[rb]+scope.regs[ro]);
        signBit = (scope.regs[rd]>>15) & 1;
        scope.regs[rd] = scope.regs[rd] | (signBit ? 0xFFFF0000:0);
      }
    },

    format_3: function(instr,scope){
      var bl, rb, rd, offset5;
      bl = (instr >> 11) & 3;
      rb = (instr >> 3) & 7;
      rd = (instr) & 7;
      offset5 = (instr >> 6) & 0x1F;
      appendResult("{0}\t r{1},[r{2}, #{3}]\n".format(format30[bl],rd,rb,offset5));
      switch (bl) {
        case 0:
        // STR
        scope.memory.storeWord(scope.regs[rb]+offset5,scope.regs[rd]);
        break;
        case 1:
        // LDR
        scope.regs[rd] = scope.memory.loadWord(scope.regs[rb]+offset5);
        break;
        case 2:
        // STRB
        scope.memory.store(scope.regs[rb]+offset5,scope.regs[rd]);
        break;
        case 3:
        // LDRB
        scope.regs[rd] = scope.memory.load(scope.regs[rb]+offset5);
        break;
        default:
      }
    },

    //Load/store half word
    format_4: function(instr,scope){
      var op = (instr >> 12) & 1;
      var L = (instr >> 11) & 1;
      var rb = (instr >> 3) & 3;
      var rd = instr & 3;
      var offset5 = (instr >> 6) & 5;

      switch (op){
        case 0:
        appendResult("{0}\t r{1}, [r{2}, #{3}]\n".format(format40[op], rd, rb, offset5));
        if(!L){
          scope.memory.storeHalf(scope.regs[rb]+offset5,scope.regs[rd]);
        }else{
          scope.regs[rd] = scope.memory.loadHalf(scope.regs[rb]+offset5);
          scope.regs[rd] = scope.regs[rd] & 0xFFFF0000;
        }
        break;
        case 1:
        this.format_41(instr,scope);
        break;
      }
    },

    //sp relative load/store
    format_41: function(instr,scope){
      var L = (instr >> 11) & 1;
      var rd = (instr >> 8) & 7;
      var word8 = instr & 0xFF;
      switch (L)  {
        case 0:
        scope.memory.storeWord(scope.sp+word8,scope.regs[rd]);
        appendResult("str\t r{0}, [SP, #{1}]\n".format(rd, word8));
        break;
        case 1:
        scope.regs[rd] = scope.memory.loadWord(scope.sp+word8);
        appendResult("ldr\t r{0}, [SP, #{1}]\n".format(rd, word8));
        break;
      }
    },

    //load address
    format_5: function(instr,scope){
      var op = (instr >> 12) & 1;
      var src = (instr >> 11) & 1;
      var rd = (instr >> 8) & 7;
      var word8 = instr & 0xFF;

      switch (op) {
        case 0:
        appendResult("add\t r{0}, {1}, #{2}\n".format(rd, format50[src],  word8));
        switch(src){
          case 0:
          scope.regs[rd] = scope.pc+word8;
          break;
          case 1:
          scope.regs[rd] = scope.sp+word8;
          break;
        }
        break;
        case 1:
        this.format_51(instr,scope);
        break;
      }
    },

    format_51: function(instr,scope){
      var op = (instr >> 8) & 5;
      var S = (instr >> 7) & 1;
      var SWord7 = instr & 0x7F;
      switch (op){
        case 0:
        switch(S){
          case 0:
          scope.sp = scope.sp + (SWord7);
          appendResult("add\t SP, #{0}\n".format(SWord7));
          break;
          case 1:
          scope.sp = scope.sp - (SWord7);
          appendResult("add\t SP, #-{0}\n".format(SWord7));
          break;
        }
        break;
        default:
        this.format_52(instr,scope);
        break;
      }
    },

    format_52: function(instr,scope){
      // 1011010001111110
      var L = (instr >> 11) & 1;
      var R = (instr >> 8) & 1;
      var Rlist = (instr) & 0xFF;
      var RListString = this.getListString(Rlist);
      var RListArray = this.getList(Rlist);
      var ArrayLength = RListArray.length;

      switch(L){
        case 0:
        switch(R){
          case 0:

          for (var i = ArrayLength ; i >= 0; i--) {
            // Memory[SP] = RListArray[i];
            scope.memory.storeWord(scope.sp,scope.regs[RListArray[i]]);
            scope.sp-=4;
          }
          appendResult("push\t {{0}}\n".format(RListString));

          break;
          case 1:
          for (var i = ArrayLength; i >= 0; i--) {
             scope.memory.storeWord(scope.sp,scope.regs[RListArray[i]]);
             scope.sp-=4;
          }
          scope.memory.storeWord(scope.sp,scope.lr);
          scope.sp-=4;
          appendResult("push\t {{0}, LR}\n".format(RListString));
          break;
        }

        break;

        case 1:
        switch(R){
          case 0:
          for (var i = 0; i < ArrayLength; i++) {
            scope.sp+=4;
            scope.regs[RListArray[i]] = scope.memory.loadWord(scope.sp);
          }
          appendResult("pop\t {{0}}\n".format(RListString));
          break;
          case 1:

          scope.sp+=4;
          scope.pc = scope.memory.loadWord(scope.sp);

          for (var i = 0; i < ArrayLength; i++) {
            scope.sp+=4;
            scope.regs[RListArray[i]] = scope.memory.loadWord(scope.sp);
          }

          appendResult("pop\t {{0}, PC}\n".format(RListString));
          break;
        }
        break;
      }
    },

    format_6: function(instr,scope){
      var cond, sOffSet8, value8, rb, rlist;
      if(((instr>>8) & 0x1F) == 0x1F){
        value8 = instr & 0xFF;
        appendResult("SWI\t {0}\n".format(value8));
        switch (value8) {
          case 0: output[outputIdx++] = String.fromCharCode(scope.regs[0]); break;
          case 1: output[outputIdx++] = scope.regs[0]; break;
          case 3:
            break;

          default:

        }
      }else if(instr & 0x1000){
        cond = (instr >> 8) & 0xF;
        sOffSet8 = instr & 0xFF;
        this.format_61(cond,sOffSet8,scope,(sOffSet8 >> 7 & 1));
      }else{
        l = (instr >> 11) & 1;
        rb = (instr >> 8) & 7;
        rlist = (instr) & 0xFF;
        var arr = this.getList(rlist);
        // 1100011011001110 to test
        if(!l){
          // TODO: Check this
          appendResult("STMI\t r{0}!, {{1}}\n".format(rb,this.getListString(rlist)));
          var adrs = scope.regs[rb];
          for(var i = 0; i<arr.length; i++){
            scope.memory.storeWord(adrs,scope.regs[arr[i]]);
            adrs+=4;
          }
          scope.regs[rb] = adrs;
        }else{
          appendResult("LDMI\t r{0}!, {{1}}\n".format(rb,this.getListString(rlist)));
          var adrs = scope.regs[rb];
          for(var i = 0; i<arr.length; i++){
            scope.regs[arr[i]] = scope.memory.loadWord(adrs);
            adrs+=4;
          }
          scope.regs[rb] = adrs;
        }
      }
    },

    getListString: function(list){
      var result = "";
      var i, j = 0;
       for(i = 0; i<8; i++){
           if((list>>i & 1)){
               for(j = i; j<8; j++)
                   if(!(list>>j & 1))
                      break;
               if(i == j-1) result+=("r{0},".format(i));
               else result+=("r{0}-r{1},".format(i,j-1));
               i = j;
           }
       }
      return result.slice(0,-1);
    },

    getList: function(list){
      var arr = [];
      for(var i = 0; i<8; i++)
      if(list>>i & 1) arr.push(i);
      return arr;
    },

    // TODO: Check if we should multiply offset before multiplying
    format_61: function(cond,sOffSet8,scope,sign){
      if(!sign){
        appendResult("{0}\t 0x{1}\n".format(format61[cond],Dec2Hex(sOffSet8).toUpperCase()));
      }else{
        sOffSet8 = (~sOffSet8+1) & 0xFF;
        appendResult("{0}\t -0x{1}\n".format(format61[cond],Dec2Hex(sOffSet8).toUpperCase()));
      }
      var pc = scope.pc;
      if(!sign){
        switch (cond) {
          case 0: scope.pc = scope.flags[0] ? pc+sOffSet8:pc; break;
          case 1: scope.pc = !scope.flags[0] ? pc+sOffSet8:pc;  break;
          case 2: scope.pc = scope.flags[1] ? pc+sOffSet8:pc;  break;
          case 3: scope.pc = !scope.flags[1] ? pc+sOffSet8:pc;  break;
          case 4: scope.pc = scope.flags[2] ? pc+sOffSet8:pc; break;
          case 5: scope.pc = !scope.flags[2] ? pc+sOffSet8:pc; break;
          case 6: scope.pc = scope.flags[3] ? pc+sOffSet8:pc; break;
          case 7: scope.pc = !scope.flags[3] ? pc+sOffSet8:pc; break;
          case 8: scope.pc = !scope.flags[0] && scope.flags[1] ? pc+sOffSet8:pc; break;
          case 9: scope.pc = scope.flags[0] && !scope.flags[1] ? pc+sOffSet8:pc;  break;
          case 10: scope.pc = !(scope.flags[2] ^ scope.flags[3]) ? pc+sOffSet8:pc; break;
          case 11: scope.pc = (scope.flags[2] ^ scope.flags[3]) ? pc+sOffSet8:pc; break;
          case 12: scope.pc = (!scope.flags[0] && !(scope.flags[2] ^ scope.flags[3])) ? pc+sOffSet8:pc; break;
          case 13: scope.pc = (scope.flags[0] && (scope.flags[2] ^ scope.flags[3])) ? pc+sOffSet8:pc; break;
          default:
        }
      }else{
        switch (cond) {
          case 0: scope.pc = scope.flags[0] ? pc-sOffSet8:pc; break;
          case 1: scope.pc = !scope.flags[0] ? pc-sOffSet8:pc;  break;
          case 2: scope.pc = scope.flags[1] ? pc-sOffSet8:pc;  break;
          case 3: scope.pc = !scope.flags[1] ? pc-sOffSet8:pc;  break;
          case 4: scope.pc = scope.flags[2] ? pc-sOffSet8:pc; break;
          case 5: scope.pc = !scope.flags[2] ? pc-sOffSet8:pc; break;
          case 6: scope.pc = scope.flags[3] ? pc-sOffSet8:pc; break;
          case 7: scope.pc = !scope.flags[3] ? pc-sOffSet8:pc; break;
          case 8: scope.pc = !scope.flags[0] && scope.flags[1] ? pc-sOffSet8:pc; break;
          case 9: scope.pc = scope.flags[0] && !scope.flags[1] ? pc-sOffSet8:pc;  break;
          case 10: scope.pc = !(scope.flags[2] ^ scope.flags[3]) ? pc-sOffSet8:pc; break;
          case 11: scope.pc = (scope.flags[2] ^ scope.flags[3]) ? pc-sOffSet8:pc; break;
          case 12: scope.pc = (!scope.flags[0] && !(scope.flags[2] ^ scope.flags[3])) ? pc-sOffSet8:pc; break;
          case 13: scope.pc = (scope.flags[0] && (scope.flags[2] ^ scope.flags[3])) ? pc-sOffSet8:pc; break;
          default:
        }
      }
    },

    // TODO: Check
    format_7: function(instr,scope){
      var h, offet11;
      if(((instr >> 12)&1)){
        // Format 19
        h = (instr >> 11) & 1;
        offset11 = (instr) & 0x7FF;
        this.format_71(h,offset11,scope);
      }else{
        // Format 18
        //Branch PC relative +/- Offset11 << 1, where label is PC +/- 2048 bytes.
        offset11 = ((instr) & 0x7FF);
        if(offset11>>10){
          offset11 = (~offset11)+1;
          scope.pc = scope.pc - (offset11)<<1;
        }else{
          scope.pc = scope.pc + (offset11)<<1;
        }
        appendResult("B\t 0x{0}\n".format(Dec2Hex(offset11).toUpperCase()));
      }
    },

    format_71: function(h,offset11,scope){
      if(!h){
        //LR := PC + OffsetHigh << 12
        //scope.lr = scope.pc+2 + (offset11<<12);
        var sign = offset11 >> 10 & 1;
        scope.lr = scope.pc+2;
        if(!sign){
          appendResult("BL\t 0x{0}\n".format(Dec2Hex(offset11).toUpperCase()));
          scope.pc = scope.pc+offset11;
        }else{
          offset11 = (~offset11+1) & 0x7FF;
          appendResult("BL\t -0x{0}\n".format(Dec2Hex(offset11).toUpperCase()));
          scope.pc = scope.pc-offset11;
        }
      }else{
        //temp := next instruction address
        //PC := LR + OffsetLow << 1
        //LR := temp | 1
        var tmp = scope.pc+2;
        scope.pc = scope.lr + (offset11<<1);
        //scope.lr = scope.pc | 1;
      }
    }
  };
  return simulator;
}]);

function appendResult(txt){
  // var box = $("#result");
  // box.val(box.val() + txt);
  if(!usingMonitor){
    var editor = ace.edit("result");
    var resultSoFar = editor.getValue();
    editor.getSession().setValue(resultSoFar + txt);
  }
}

function clearResult(){
  // var box = $("#result");
  // box.val("");
  var editor = ace.edit("result");
  editor.getSession().setValue("");
}

function appendAssembly(txt){
  // var editor = $($("#assemblyCode")[0]).data('CodeMirrorInstance');
  // var resultSoFar = editor.getValue();
  // editor.getDoc().setValue(resultSoFar + txt);
  var editor = ace.edit("assemblyCode");
  var resultSoFar = editor.getValue();
  editor.getSession().setValue(resultSoFar + txt);
}

function clearAssembly(){
  // var editor = $($("#assemblyCode")[0]).data('CodeMirrorInstance');
  // editor.getDoc().setValue("");
  var editor = ace.edit("assemblyCode");
  editor.getSession().setValue("");
}

function appendSWI(txt){
  var box = $("#swi");
  box.val(box.val() + txt);
}

function append16MachineCode(txt){
  var box = $("#sourceCode");
  var one = txt&0xFF;
  var two = txt>>8;
  box.val(box.val() + one + "\n");
  box.val(box.val() + two + "\n");
}

function appendMachineCode(txt){
  var box = $("#sourceCode");
  box.val(box.val() + txt + "\n");
}

function getImmediate(imm,mask){
  return imm & mask ? ~(imm)+1:imm;
}


// BINARY - MOVE - PUSH - CLEAR - THEN POP
// 0010000100000111
// 0010001100000100
// 0010010110000110
// 0010011010000100
// 1011010001101110
// 0010000100000000
// 0010001100000000
// 0010010100000000
// 0010011000000000
// 1011110001101110

// 1011010001101110
// 1011110001101110

// swi 2
// orr r1, r0
// cmp r1, #1
// beq 6
// sub r1, #1
// mul r0, r1
// bne -10
// swi 1
