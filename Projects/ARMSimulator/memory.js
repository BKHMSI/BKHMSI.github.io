app.service('memory', [function () {
    var memory = {
        data: new Uint8Array(4096),
        lastAccess: -1,
        load: function (address) {
            var self = this;
            if (address < 0 || address >= self.data.length) {
                throw "Memory access violation at " + address;
            }

            self.lastAccess = address;
            return self.data[address];
        },

        loadWord: function(address){
          var self = this;
          var value = 0;
          if (address < 0 || address >= self.data.length) {
              throw "Memory access violation at " + address;
          }

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
        }
    };

    memory.reset();
    return memory;
}]);
