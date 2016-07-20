app.service('memory', [function () {
    var memory = {
        data: new Uint8Array(80896),
        displayMem: [],
        lastAccess: -1,
        isMonitor: false,
        load: function (address) {
            var self = this;
            if (address < 0 || address >= self.data.length) {
                throw "Memory access violation at " + address;
            }

            if(address > 500) this.isMonitor = true;
            else this.isMonitor = false;

            self.lastAccess = address;
            return self.data[address];
        },

        loadWord: function(address){
          var self = this;
          var value = 0;
          if (address < 0 || address >= self.data.length) {
              throw "Memory access violation at " + address;
          }
          if(address > 500) this.isMonitor = true;
          else this.isMonitor = false;

          self.lastAccess = address;
          value = self.data[address];
          value += self.data[address+1]<<8;
          value += self.data[address+2]<<16;
          value += self.data[address+3]<<24;
          return value;
        },

        loadHalf: function(address){
          var self = this;
          var value = 0;
          if (address < 0 || address >= self.data.length) {
              throw "Memory access violation at " + address;
          }

          if(address > 500) this.isMonitor = true;
          else this.isMonitor = false;

          self.lastAccess = address;
          value = self.data[address];
          value += self.data[address+1]<<8;
          return value;
        },

        store: function (address, value) {
            var self = this;

            if (address < 0 || address >= self.data.length) {
                throw "Memory access violation at " + address;
            }

            self.lastAccess = address;
            self.data[address] = value;
        },

        storeHalf: function (address, value) {
            var self = this;
            var first = value & 0xFF;
            var second = (value>>8) & 0xFF;

            if (address < 0 || address >= self.data.length) {
                throw "Memory access violation at " + address;
            }

            self.lastAccess = address;
            self.data[address] = first;
            self.data[address+1] = second;
        },

        storeWord: function (address, value) {
            var self = this;
            var first = value & 0xFF;
            var second = (value>>8) & 0xFF;
            var third = (value>>16) & 0xFF;
            var fourth = (value>>24) & 0xFF;

            if (address < 0 || address >= self.data.length) {
                throw "Memory access violation at " + address;
            }

            self.lastAccess = address;
            self.data[address] = first;
            self.data[address+1] = second;
            self.data[address+2] = third;
            self.data[address+3] = fourth;
        },

        reset: function () {
            var self = this;

            self.lastAccess = -1;
            for (var i = 0, l = self.data.length; i < l; i++) {
                self.data[i] = 0;
            }
        },

        getColor: function(i){
          if(i == 200) return  "rgba(86,182,194,0.6)"; // SP
          else if(i == 8) return "rgba(198,120,221,0.6)"; // PC
          else if(this.data[i] != 0 && i<2048) return "rgba(72,156,72,0.6)";// Text Segment
          else if(this.data[i] != 0 && i>=2048) return "rgba(209,154,102,0.6)"; // Data Segment
          else return "none";
        },

        subset: function(start,end){
          var mem = new Uint8Array(end-start);
          for(var i = start; i<=end; i++)
            mem[i] = this.data[i];
            //this.displayMem[i-start] = {data: this.data[i], color:this.getColor(i)};
          return mem;
        }
    };

    memory.reset();
    return memory;
}]);
