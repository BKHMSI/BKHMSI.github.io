app.service('assembler', [function () {
    var assembler = {
      labels: {},
      dataLabels: {},
      parse: function(instr){
        this.addLabels(instr);
        var wasLabel = false;
        var instIdx = 0; // Used to calculate offset to compensate for white spaces
        for(var i = 0; i<instr.length; i++){
          if(instr[i].trim() != ""){
            instIdx++;
            if(instr[i].indexOf(":") == -1 || wasLabel){
              if(instr[i].indexOf("swi") == -1){
                if(wasLabel){instr[i] = instr[i].substring(instr[i].indexOf(":")+1,instr[i].length).trim(); wasLabel = false;}
                if(instr[i].indexOf("{") == -1){
                  if(instr[i].indexOf("[") == -1){
                    if(instr[i].trim()[0] != 'b'){
                      var men = instr[i].substring(0,instr[i].indexOf(" ")).trim();
                      var regs = instr[i].substring(instr[i].indexOf(" "),instr[i].length).split(",");
                      for(var j = 0; j<regs.length; j++){regs[j] = regs[j].trim();}
                      if(regs.length == 2){
                        var rss = parseInt(regs[0].replace("r","")); // For High Registers
                        var rdd = parseInt(regs[1].replace("r","")); // For High Registers
                        if(rdd > 7 || rss > 7){
                          if(!this.evaluate3(men,regs))
                              throw "Error in Line: "+(i+1);
                        }else{
                          if(!this.evaluate2(men,regs))
                              throw "Error in Line: "+(i+1);
                        }
                      }else if(regs.length == 3){
                        if(!this.evaluate1(men,regs))
                            throw "Error in Line: "+(i+1);
                      }else{
                        throw "Error in Line: "+(i+1);
                      }
                    }else{
                      // Branch on Condition
                      var men = instr[i].substring(0,instr[i].indexOf(" ")).trim();
                      var label = instr[i].substring(instr[i].indexOf(" "),instr[i].length).trim();
                      var inst, rs, rd;
                      if(men == "bx"){
                        // Format 5
                        if(label.indexOf("lr") != -1){
                          rs = 14-8;
                          inst = (1<<14)+(1<<10)+(13<<6)+(rs<<3);
                        }else if(label.indexOf("pc") != -1){
                          rs = 15-8;
                          inst = (1<<14)+(1<<10)+(13<<6)+(rs<<3);
                        }else if(label.indexOf("sp") != -1){
                          rs = 13-8;
                          inst = (1<<14)+(1<<10)+(13<<6)+(rs<<3);
                        }else{
                          rs = parseInt(label.replace("r",""));
                          if(rs>7){
                            rs = rs-8;
                            inst = (1<<14)+(1<<10)+(13<<6)+(rs<<3);
                          }else{
                            inst = (1<<14)+(1<<10)+(12<<6)+(rs<<3);
                          }
                        }
                        append16MachineCode(inst);
                      }else{
                        // Check if Label is Present then calculate offset
                        var address = this.labels[label];
                        var offset = 0;
                        if(address - instIdx < 0){
                           offset = (address - instIdx)*2;
                        }else{
                          // TODO: Check This
                          offset = (address - instIdx)*2;
                        }
                        if(!this.evaluate7(men,offset))
                          throw "Error in Line: "+(i+1);
                      }
                    }
                  }else{
                    // Store/Load Operations
                    var men = instr[i].substring(0,instr[i].indexOf(" ")).trim();
                    var regs = instr[i].substring(instr[i].indexOf(" "),instr[i].length).split(",");
                    regs[1] = regs[1].replace("[","");
                    regs[2] = regs[2].replace("]","");
                    for(var j = 0; j<regs.length; j++){regs[j] = regs[j].trim();}
                    if(regs[1] == "pc"){
                      /*** Format 6 ***/
                      var rd = parseInt(regs[0].replace("r",""));
                      var imm = parseInt(regs[2].replace("#",""));
                      var inst = (1<<14) + (1<<11) + (rd<<8) + imm;
                      append16MachineCode(inst);
                    }else if(regs[1] == "sp"){
                      /*** Format 11 ***/
                      var rd = parseInt(regs[0].replace("r",""));
                      var imm = parseInt(regs[2].replace("#",""));
                      if(men == "str"){
                        inst = (1<<15)+(1<<12)+(rd<<8)+imm;
                      }else if(men == "ldr"){
                        inst = (1<<15)+(1<<12)+(1<<11)+(rd<<8)+imm;
                      }else{ throw "Error in Line: "+(i+1);}
                      append16MachineCode(inst);
                    }else{
                      if(regs[2].indexOf("#") == -1){
                        if(!this.evaluate5(men,regs))
                          throw "Error in Line: "+(i+1);
                      }else{
                        if(!this.evaluate6(men,regs))
                          throw "Error in Line: "+(i+1);
                      }
                    }
                  }
                }else{
                  // PUSH/POP
                  var men = instr[i].substring(0,instr[i].indexOf(" ")).trim();
                  var list = instr[i].substring(instr[i].indexOf(" "),instr[i].length);
                  var flag = false;
                  if(men == "pop" || men == "push"){
                    list = list.replace("{","");
                    list = list.replace("}","");
                    flag = list.indexOf("lr") != -1 || list.indexOf("pc") != -1;
                    var regList = list.split(',');
                    for(var j = 0; j<regList.length; j++){regList[j] = regList[j].trim();}
                    if(flag){regList.pop();}
                    if(!this.evaluate8(men,regList,flag))
                      throw "Error in Line "+i+1;
                  }else{
                    /*** Format 15 ***/
                    var rb = list.substring(0,list.indexOf(',')).trim();
                    var inst = 0;
                    rb = rb.replace("!","");
                    rb = rb.replace("r","");
                    var rlist = list.substring(list.indexOf(','),list.length).trim();
                    rlist = rlist.replace("{","");
                    rlist = rlist.replace("}","");
                    var regList = rlist.split(',');
                    for(var j = 0; j<regList.length; j++){regList[j] = regList[j].trim();}
                    if(men == "stmia"){
                      inst = (12<<12)+(parseInt(rb))+this.parseRList(regList);
                    }else if(men == "ldmia"){
                      inst = (12<<12)+(1<<11)+(parseInt(rb))+this.parseRList(regList);
                    }else{
                      throw "Error in Line "+i+1;
                    }
                    append16MachineCode(inst);
                  }
                }
              }else{
                // Software Interrupt
                appendMachineCode(parseInt(instr[i].substring(instr[i].indexOf(" "),instr[i].length)));
                appendMachineCode(223);
              }
            }else{
              // LABEL: Command
              var label = instr[i].substring(0,instr[i].indexOf(":")).trim();
              if(instr[i].substring(instr[i].indexOf(":")+1,instr[i].length).trim() != ""){
                this.labels[label] = i--;
                wasLabel = true;
              }else{
                // If label is not in the same line as instruction
                instr.splice(i,1);
                this.labels[label] = i--;
              }
            }
          }
        }
        append16MachineCode(0xDEAD);
      },

      setDataLabels: function(memLabels){
        this.dataLabels = {};
        this.dataLabels = memLabels;
      },

      // TODO: there is a problem with nested labels that needs to fixed
      addLabels: function(instr){
        var idx = 0;
        for(var i = 0; i<instr.length; i++){

          // There is a comment so remove it
          if(instr[i].indexOf(";") != -1){
            var comment = instr[i].substring(instr[i].indexOf(";"),instr[i].length);
            instr[i] = instr[i].replace(comment,"");
          }

          //if(instr[i].indexOf("=") != -1) idx++;
          if(instr[i].trim() != "") idx++;
          // Label
          if(instr[i].indexOf(":") != -1){
            var label = instr[i].substring(0,instr[i].indexOf(":")).trim();
            if(instr[i].substring(instr[i].indexOf(":")+1,instr[i].length).trim() != ""){
              this.labels[label] = idx;
              instr[i] = instr[i].substring(instr[i].indexOf(":")+1,instr[i].length).trim();
            }else{
              // If label is not in the same line as instruction
              instr.splice(i,1);
              while(instr[i].trim() == "")
                  instr.splice(i,1);
              this.labels[label] = idx;
            }
          }
        }
        console.log(this.labels);
      },

      evaluate1: function(men,regs){
        // Menomonic Rd,Rs,Rn/#Imm
        var rd,rs,rn,imm,op,instr;
        switch (men) {
          case "lsl":
              // Format 1
              rd = parseInt(regs[0].replace("r",""));
              rs = parseInt(regs[1].replace("r",""));
              imm = parseInt(regs[2].replace("#","")) & 0x1F;
              instr = (imm<<6)+(rs<<3)+rd;
            break;
          case "lsr":
            // Format 1
              rd = parseInt(regs[0].replace("r",""));
              rs = parseInt(regs[1].replace("r",""));
              imm = parseInt(regs[2].replace("#","")) & 0x1F;
              instr = (1<<11)+(imm<<6)+(rs<<3)+rd;
            break;
          case "asr":
            // Format 1
              rd = parseInt(regs[0].replace("r",""));
              rs = parseInt(regs[1].replace("r",""));
              imm = parseInt(regs[2].replace("#","")) & 0x1F;
              instr = (1<<12)+(imm<<6)+(rs<<3)+rd;
            break;
          case "add":
            // Format 2 or Format 12 -> PC/SP
            if(regs[1] == "pc"){
              // Format 12
              rd = parseInt(regs[0].replace("r",""));
              imm = parseInt(regs[2].replace("#","")) & 0xFF;
              instr = (1<<15)+(1<<13)+(0<<11)+(rd<<8)+imm;
            }else if(regs[1] == "sp"){
              // Format 12
              rd = parseInt(regs[0].replace("r",""));
              imm = parseInt(regs[2].replace("#","")) & 0xFF;
              instr = (1<<15)+(1<<13)+(1<<11)+(rd<<8)+imm;
            }else{
              // Format 2
              rd = parseInt(regs[0].replace("r",""));
              rs = parseInt(regs[1].replace("r",""));
              if(regs[2].indexOf("#") == -1){
                rn = parseInt(regs[2].replace("r",""));
                instr = (12<<9)+(rn<<6)+(rs<<3)+rd;
              }else{
                imm = parseInt(regs[2].replace("#","")) & 0x7;
                instr = (14<<9)+(imm<<6)+(rs<<3)+rd;
              }
            }
            break;
          case "sub":
            // Format 2
            rd = parseInt(regs[0].replace("r",""));
            rs = parseInt(regs[1].replace("r",""));
            if(regs[2].indexOf("#") == -1){
              rn = parseInt(regs[2].replace("r",""));
              instr = (13<<9)+(rn<<6)+(rs<<3)+rd;
            }else{
              imm = parseInt(regs[2].replace("#","")) & 0x7;
              instr = (15<<9)+(imm<<6)+(rs<<3)+rd;
            }
            break;
          default: return false; break;
        }
        append16MachineCode(instr);
        return true;
      },

      evaluate2: function(men,regs){
        // Menomonic Rd,Rs,Rn/#Imm
        var rd,rs,rn,imm,op,instr;
        switch (men) {
          /*** Format 3 ***/
          case "mov":
            rd = parseInt(regs[0].replace("r",""));
            if(regs[1].indexOf("#") != -1){
              imm = parseInt(regs[1].replace("#","")) & 0xFF;
              instr = (4<<11)+(rd<<8)+imm;
            }else if(regs[1].indexOf("r") != -1){
              // Pseudo Instruction - Convert MOV Rd,Rs to ADD Rd,RS,#0
              rs = parseInt(regs[1].replace("r",""));
              instr = (14<<9)+(0<<6)+(rs<<3)+rd;
            }
            break;
          case "cmp":
            rd = parseInt(regs[0].replace("r",""));
            if(regs[1].indexOf("#") != -1){
              imm = parseInt(regs[1].replace("#","")) & 0xFF;
              instr = (5<<11)+(rd<<8)+imm;
            }else{
              // 00111
              rs = parseInt(regs[1].replace("r",""));
              instr = (1<<14)+(10<<6)+(rs<<3)+rd;
            }
            break;
          case "add":
            if(regs[0] == "sp"){
              // Format 13
              if(regs[1].indexOf("-") == -1){
                imm = parseInt(regs[1].replace("#","")) & 0x7F;
                instr = (11<<12)+(0<<7)+imm;
              }else{
                imm = parseInt(regs[1].replace("#-","")) & 0x7F;
                instr = (11<<12)+(1<<7)+imm;
              }
            }else{
              rd = parseInt(regs[0].replace("r",""));
              imm = parseInt(regs[1].replace("#","")) & 0xFF;
              instr = (6<<11)+(rd<<8)+imm;
            }
            break;
          case "sub":
            rd = parseInt(regs[0].replace("r",""));
            imm = parseInt(regs[1].replace("#","")) & 0xFF;
            instr = (7<<11)+(rd<<8)+imm;
            break;
          /*** Format 4 ***/
          case "and":
            // 01000000
            rd = parseInt(regs[0].replace("r",""));
            rs = parseInt(regs[1].replace("r",""));
            instr = (1<<14)+(rs<<3)+rd;
            break;
          case "eor":
            // 00111
            rd = parseInt(regs[0].replace("r",""));
            rs = parseInt(regs[1].replace("r",""));
            instr = (1<<14)+(1<<6)+(rs<<3)+rd;
            break;
          case "lsl":
            // 00111
            rd = parseInt(regs[0].replace("r",""));
            rs = parseInt(regs[1].replace("r",""));
            instr = (1<<14)+(2<<6)+(rs<<3)+rd;
            break;
          case "lsr":
            // 00111
            rd = parseInt(regs[0].replace("r",""));
            rs = parseInt(regs[1].replace("r",""));
            instr = (1<<14)+(3<<6)+(rs<<3)+rd;
            break;
          case "asr":
            // 00111
            rd = parseInt(regs[0].replace("r",""));
            rs = parseInt(regs[1].replace("r",""));
            instr = (1<<14)+(4<<6)+(rs<<3)+rd;
            break;
          case "adc":
            // 00111
            rd = parseInt(regs[0].replace("r",""));
            rs = parseInt(regs[1].replace("r",""));
            instr = (1<<14)+(5<<6)+(rs<<3)+rd;
            break;
          case "sbc":
            // 00111
            rd = parseInt(regs[0].replace("r",""));
            rs = parseInt(regs[1].replace("r",""));
            instr = (1<<14)+(6<<6)+(rs<<3)+rd;
            break;
          case "ror":
            // 00111
            rd = parseInt(regs[0].replace("r",""));
            rs = parseInt(regs[1].replace("r",""));
            instr = (1<<14)+(7<<6)+(rs<<3)+rd;
            break;
          case "tst":
            // 00111
            rd = parseInt(regs[0].replace("r",""));
            rs = parseInt(regs[1].replace("r",""));
            instr = (1<<14)+(8<<6)+(rs<<3)+rd;
            break;
          case "neg":
            // 00111
            rd = parseInt(regs[0].replace("r",""));
            rs = parseInt(regs[1].replace("r",""));
            instr = (1<<14)+(9<<6)+(rs<<3)+rd;
            break;
          case "cmn":
            // 00111
            rd = parseInt(regs[0].replace("r",""));
            rs = parseInt(regs[1].replace("r",""));
            instr = (1<<14)+(11<<6)+(rs<<3)+rd;
            break;
          case "orr":
            // 00111
            rd = parseInt(regs[0].replace("r",""));
            rs = parseInt(regs[1].replace("r",""));
            instr = (1<<14)+(12<<6)+(rs<<3)+rd;
            break;
          case "mul":
            // 00111
            rd = parseInt(regs[0].replace("r",""));
            rs = parseInt(regs[1].replace("r",""));
            instr = (1<<14)+(13<<6)+(rs<<3)+rd;
            break;
          case "bic":
            // 00111
            rd = parseInt(regs[0].replace("r",""));
            rs = parseInt(regs[1].replace("r",""));
            instr = (1<<14)+(14<<6)+(rs<<3)+rd;
            break;
          case "mvn":
            // 00111
            rd = parseInt(regs[0].replace("r",""));
            rs = parseInt(regs[1].replace("r",""));
            instr = (1<<14)+(15<<6)+(rs<<3)+rd;
            break;
          case "ldr":
            rd = parseInt(regs[0].replace("r",""));
            regs[1] = regs[1].replace("=","");
            imm = this.dataLabels[regs[1]];
            if(!imm){
              imm = parseInt(regs[1]);
            }
            if(imm>=4096){
              imm -= 4096;

              // MOV Rd,255
              instr = (4<<11)+(rd<<8)+0xFF;
              append16MachineCode(instr);

              // Shift Left by 2
              instr = (0x4<<6)+(rd<<3)+rd;
              append16MachineCode(instr);

              // Add Imm
              instr = (6<<11)+(rd<<8)+(imm+16);
            }else{
              imm -= 510;

              // MOV Rd,255
              instr = (4<<11)+(rd<<8)+0xFF;
              append16MachineCode(instr);

              // Shift Left by 2
              instr = (0x1<<6)+(rd<<3)+rd;
              append16MachineCode(instr);

              // Add Imm
              instr = (6<<11)+(rd<<8)+imm;
            }

            break;
          default:
            return false;
            break;
        }
        append16MachineCode(instr);
        return true;
      },

      evaluate3: function(men,regs){
        /*** Format 5 ***/
        var rd,rs,rn,imm,op,instr;
        rd = parseInt(regs[0].replace("r",""));
        rs = parseInt(regs[1].replace("r",""));
        switch (men) {
          case "add":
              if(rs>7 && rd<8){
                // ADD Rd, Hs
                rs-=8;
                instr = (1<<14)+(1<<10)+(1<<6)+(rs<<3)+rd;
              }else if(rd>7 && rs<8){
                // ADD Hd, Rs
                rd-=8;
                instr = (1<<14)+(1<<10)+(2<<6)+(rs<<3)+rd;
              }else{
                rs-=8;rd-=8;
                // ADD Hd, Hs
                instr = (1<<14)+(1<<10)+(3<<6)+(rs<<3)+rd;
              }
            break;
          case "cmp":
            if(rs>7 && rd<8){
              // CMP Rd, Hs
              rs-=8;
              instr = (1<<14)+(1<<10)+(1<<8)+(1<<6)+(rs<<3)+rd;
            }else if(rd>7 && rs<8){
              // CMP Hd, Rs
              rd-=8;
              instr = (1<<14)+(1<<10)+(1<<8)+(2<<6)+(rs<<3)+rd;
            }else{
              // CMP Hd, Hs
              rs-=8;rd-=8;
              instr = (1<<14)+(1<<10)+(1<<8)+(3<<6)+(rs<<3)+rd;
            }
            break;
          case "mov":
            if(rs>7 && rd<8){
              // MOV Rd, Hs
              rs-=8;
              instr = (1<<14)+(1<<10)+(2<<8)+(1<<6)+(rs<<3)+rd;
            }else if(rd>7 && rs<8){
              // MOV Hd, Rs
              rd-=8;
              instr = (1<<14)+(1<<10)+(2<<8)+(2<<6)+(rs<<3)+rd;
            }else{
              // MOV Hd, Hs
              rs-=8;rd-=8;
              instr = (1<<14)+(1<<10)+(2<<8)+(3<<6)+(rs<<3)+rd;
            }
            break;
          default: return false; break;
        }
        append16MachineCode(instr);
        return true;
      },

      evaluate5: function(men,regs){
        var rd,rb,ro,imm,op,instr;
        switch (men) {
          /*** Format 7 ***/
          case "str":
            rd = parseInt(regs[0].replace("r",""));
            rb = parseInt(regs[1].replace("r",""));
            ro = parseInt(regs[2].replace("r",""));
            instr = (1<<14)+(1<<12)+(0<<10)+(ro<<6)+(rb<<3)+(rd);
            break;
          case "strb":
            rd = parseInt(regs[0].replace("r",""));
            rb = parseInt(regs[1].replace("r",""));
            ro = parseInt(regs[2].replace("r",""));
            instr = (1<<14)+(1<<12)+(1<<10)+(ro<<6)+(rb<<3)+(rd);
            break;
          case "ldr":
            rd = parseInt(regs[0].replace("r",""));
            rb = parseInt(regs[1].replace("r",""));
            ro = parseInt(regs[2].replace("r",""));
            instr = (1<<14)+(1<<12)+(2<<10)+(ro<<6)+(rb<<3)+(rd);
            break;
          case "ldrb":
            rd = parseInt(regs[0].replace("r",""));
            rb = parseInt(regs[1].replace("r",""));
            ro = parseInt(regs[2].replace("r",""));
            instr = (1<<14)+(1<<12)+(3<<10)+(ro<<6)+(rb<<3)+(rd);
            break;
          /*** Format 8 ***/
          case "strh":
            rd = parseInt(regs[0].replace("r",""));
            rb = parseInt(regs[1].replace("r",""));
            ro = parseInt(regs[2].replace("r",""));
            instr = (1<<14)+(1<<12)+(1<<9)+(0<<10)+(ro<<6)+(rb<<3)+(rd);
            break;
          case "ldrh":
            rd = parseInt(regs[0].replace("r",""));
            rb = parseInt(regs[1].replace("r",""));
            ro = parseInt(regs[2].replace("r",""));
            instr = (1<<14)+(1<<12)+(1<<9)+(2<<10)+(ro<<6)+(rb<<3)+(rd);
            break;
          case "ldsb":
            rd = parseInt(regs[0].replace("r",""));
            rb = parseInt(regs[1].replace("r",""));
            ro = parseInt(regs[2].replace("r",""));
            instr = (1<<14)+(1<<12)+(1<<9)+(1<<10)+(ro<<6)+(rb<<3)+(rd);
            break;
          case "ldsh":
            rd = parseInt(regs[0].replace("r",""));
            rb = parseInt(regs[1].replace("r",""));
            ro = parseInt(regs[2].replace("r",""));
            instr = (1<<14)+(1<<12)+(1<<9)+(3<<10)+(ro<<6)+(rb<<3)+(rd);
            break;
          default: return false; break;
        }
        append16MachineCode(instr);
        return true;
      },

      evaluate6: function(men,regs){
        var rd,rb,ro,imm,op,instr;
        switch (men) {
          /*** Format 9 ***/
          case "str":
            rd = parseInt(regs[0].replace("r",""));
            rb = parseInt(regs[1].replace("r",""));
            imm = parseInt(regs[2].replace("#","")) & 0x1F;
            instr = (1<<14)+(1<<13)+(0<<11)+(imm<<6)+(rb<<3)+(rd);
            break;
          case "strb":
            rd = parseInt(regs[0].replace("r",""));
            rb = parseInt(regs[1].replace("r",""));
            imm = parseInt(regs[2].replace("#","")) & 0x1F;
            instr = (1<<14)+(1<<13)+(2<<11)+(imm<<6)+(rb<<3)+(rd);
            break;
          case "ldr":
            rd = parseInt(regs[0].replace("r",""));
            rb = parseInt(regs[1].replace("r",""));
            imm = parseInt(regs[2].replace("#","")) & 0x1F;
            instr = (1<<14)+(1<<13)+(1<<11)+(imm<<6)+(rb<<3)+(rd);
            break;
          case "ldrb":
            rd = parseInt(regs[0].replace("r",""));
            rb = parseInt(regs[1].replace("r",""));
            imm = parseInt(regs[2].replace("#","")) & 0x1F;
            instr = (1<<14)+(1<<13)+(3<<11)+(imm<<6)+(rb<<3)+(rd);
            break;
          /*** Format 10 ***/
          case "strh":
            rd = parseInt(regs[0].replace("r",""));
            rb = parseInt(regs[1].replace("r",""));
            imm = parseInt(regs[2].replace("#","")) & 0x1F;
            instr = (1<<15)+(imm<<6)+(rb<<3)+(rd);
            break;
          case "ldrh":
            rd = parseInt(regs[0].replace("r",""));
            rb = parseInt(regs[1].replace("r",""));
            imm = parseInt(regs[2].replace("#","")) & 0x1F;
            instr = (1<<15)+(1<<11)+(imm<<6)+(rb<<3)+(rd);
            break;
          default: return false; break;
        }
        append16MachineCode(instr);
        return true;
      },

      evaluate7: function(men,offset){
        switch (men) {
          case "beq":
            appendMachineCode(offset);
            appendMachineCode(parseInt(Bin2Dec("11010000")));
            break;
          case "bne":
            appendMachineCode(offset);
            appendMachineCode(parseInt(Bin2Dec("11010001")));
            break;
          case "bcs":
            appendMachineCode(offset);
            appendMachineCode(parseInt(Bin2Dec("11010010")));
            break;
          case "bcc":
            appendMachineCode(offset);
            appendMachineCode(parseInt(Bin2Dec("11010011")));
            break;
          case "bmi":
            appendMachineCode(offset);
            appendMachineCode(parseInt(Bin2Dec("11010100")));
            break;
          case "bpl":
            appendMachineCode(offset);
            appendMachineCode(parseInt(Bin2Dec("11010101")));
            break;
          case "bvs":
            appendMachineCode(offset);
            appendMachineCode(parseInt(Bin2Dec("11010110")));
            break;
          case "bvc":
            appendMachineCode(offset);
            appendMachineCode(parseInt(Bin2Dec("11010111")));
            break;
          case "bhi":
            appendMachineCode(offset);
            appendMachineCode(parseInt(Bin2Dec("11011000")));
            break;
          case "bls":
            appendMachineCode(offset);
            appendMachineCode(parseInt(Bin2Dec("11011001")));
            break;
          case "bge":
            appendMachineCode(offset);
            appendMachineCode(parseInt(Bin2Dec("11011010")));
            break;
          case "blt":
            appendMachineCode(offset);
            appendMachineCode(parseInt(Bin2Dec("11011011")));
            break;
          case "bgt":
            appendMachineCode(offset);
            appendMachineCode(parseInt(Bin2Dec("11011100")));
            break;
          case "ble":
            appendMachineCode(offset);
            appendMachineCode(parseInt(Bin2Dec("11011101")));
            break;
          case "b":
            /*** Format 18 ***/
            var instr = ((parseInt(Bin2Dec("11100")))<<11)+offset;
            append16MachineCode(instr);
            break
          case "bl":
            /*** Format 19 ***/
            offset = offset & 0x7FF;
            var instr = ((parseInt(Bin2Dec("11110")))<<11)+offset;
            append16MachineCode(instr);
            break;
          default: return false; break;
        }
        return true;
      },

      evaluate8: function(men,regs,flag){
        var rlist = 0, instr, l, r;
        switch (men) {
          /*** Format 14 ***/
          case "push":
            if(flag){
              l = 0;
              r = 1;
              rlist = this.parseRList(regs);
              instr = (11<<12)+(l<<11)+(1<<10)+(r<<8)+rlist;
            }else{
              l = r = 0;
              rlist = this.parseRList(regs);
              instr = (11<<12)+(l<<11)+(1<<10)+(r<<8)+rlist;
            }
            break;
          case "pop":
            if(!flag){
              l = 1;
              r = 0;
              rlist = this.parseRList(regs);
              instr = (11<<12)+(l<<11)+(1<<10)+(r<<8)+rlist;
            }else{
              l = 1;
              r = 1;
              rlist = this.parseRList(regs);
              instr = (11<<12)+(l<<11)+(1<<10)+(r<<8)+rlist;
            }
            break;
          default: return false; break;
        }
        append16MachineCode(instr);
        return true;
      },

      parseRList: function(list){
        var rlist = 0;
        for(var i = 0; i<list.length; i++){
          if(list[i].indexOf('-') != -1){
            var sublist = list[i].split('-');
            var r1 = parseInt(sublist[0].replace("r",""));
            var r2 = parseInt(sublist[1].replace("r",""));
            for(var j = r1; j<=r2; j++){
              rlist += (1<<j);
            }
          }else{
            var r = parseInt(list[i].replace("r",""));
            rlist += (1<<r);
          }
        }
        return rlist;
      },

      evaluate: function(match){
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
  };
  return assembler;
}]);
