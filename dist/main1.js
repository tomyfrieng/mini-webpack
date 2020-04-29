
        (function(modules){
            function require(id){
                const [fn,mapping]= modules[id]
                function localUrl(pathUrl){
                    return require(mapping[pathUrl])
                }
                const module = {
                    exports :{

                    }
                }
                
                fn(localUrl,module,module.exports)
                return module.exports
            }
            require(0)
        })({
            0:[
                function(require,modules,exports){
                    "use strict";

var _person = _interopRequireDefault(require("./person.js"));

var _person2 = _interopRequireDefault(require("./person2.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

document.write('person:' + _person["default"] + '<br/>' + 'person2:' + _person2["default"]);
                },
                {"./person.js":0,"./person2.js":0}
            ],
        
            0:[
                function(require,modules,exports){
                    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _content = require("./content.js");

var _default = "hello ".concat(_content.content);

exports["default"] = _default;
                },
                {"./content.js":0}
            ],
        
            0:[
                function(require,modules,exports){
                    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _content = require("./content.js");

var _default = "hello ".concat(_content.content);

exports["default"] = _default;
                },
                {"./content.js":0}
            ],
        
            0:[
                function(require,modules,exports){
                    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.content = void 0;
var content = 'world';
exports.content = content;
                },
                {}
            ],
        
            0:[
                function(require,modules,exports){
                    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.content = void 0;
var content = 'world';
exports.content = content;
                },
                {}
            ],
        })
    