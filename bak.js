const fs = require('fs')
const path = require('path');
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')
let id = 0
function creatAsset(fileName){
    const content = fs.readFileSync(fileName,'utf-8')
    // 通过 import 拿到AST
    const ast = parser.parse(content,{
        sourceType:'module'
    })
    //visitor
    const dependencies = []
    traverse(ast,{
        ImportDeclaration:({node})=>{
            dependencies.push(node.source.value)
        }
    })
    // 转化ES5
    const { code } = babel.transformFromAstSync(ast,null,{
        presets :['@babel/preset-env']
    })
    return {id:id++,fileName,code,dependencies}
}
function creatGraph(entry){
    const mainAstst = creatAsset(entry);
    const queue = [mainAstst]
    for (const asset of queue) {
        const dirname  = path.dirname(asset.fileName)
        
        asset.mapping = {};

        asset.dependencies.forEach((relPath)=>{
            const absPath = path.join(dirname,relPath)
            const child = creatAsset(absPath);
            asset.mapping[relPath] = child.id
            console.log('asset.mapping',asset.mapping)
            queue.push(child)
        })
    }
    return queue
}
function bundle(graph){
    let modules ='';
    graph.forEach((mod)=>{

        /*
         0:[
                function(require,modules,exports){
                    "use strict";

var _person = _interopRequireDefault(require("./person.js"));

var _person2 = _interopRequireDefault(require("./person2.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

console.log(_person["default"]);
console.log(_person2["default"]);
                },
                {"./person.js":1,"./person2.js":2}
            ],
*/
        modules += `
            ${mod.id}:[
                function(require,module,exports){
                    ${mod.code}
                },
                ${JSON.stringify(mod.mapping)}
            ],
        `
    })
    console.log('modules',modules)
    const  result = `
        (function(modules){
            function require(id){
                const [fn,mapping] = modules[id]
                function localRequire(pathUrl){
                    return require(mapping[pathUrl])
                }
                const module = {
                    exports:{}
                }
                
                fn(localRequire,module,module.exports);
                return module.exports
            }   
            require(1);
        })({${modules}})
    `;
    return result
}
const graph = creatGraph('./src/index.js')
const result  = bundle(graph)
console.log('result',result)
