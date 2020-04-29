const fs = require('fs')
const path  = require('path')
const parse = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')

let id= 0
function createAsset(filename){
    const content = fs.readFileSync(filename,'utf-8')   
    //获取ast
    const ast = parse.parse(content,{
        sourceType:'module'
    })
    // 获取文件里面的依赖
    let fileArray = []
    traverse(ast,{
        ImportDeclaration:({node})=>{
            fileArray.push(node.source.value)
        }
    })
    //拿到文件的code
    const {code}  = babel.transformFromAstSync(ast,'',{
        presets:['@babel/preset-env']
    })

    const obj = {
        id:id++,
        filename,
        code,
        fileArray
    }
    return obj
}

class aa{
    constructor(){
        
    }
    getAst(){
        const content = fs.readFileSync(filename,'utf-8')   
        //获取ast
        const ast = parse.parse(content,{
            sourceType:'module'
        })
        return ast
    }
}

function creatGraph(entry){
    const entryCode = createAsset(entry)
    const entryArray  = [entryCode]

    for (const keyCode of entryArray) {
        const dirname = path.dirname(keyCode.filename)
        keyCode.mapping = {}
        keyCode.fileArray.forEach((pathUrl)=>{
            const absPath = path.resolve(dirname,pathUrl)
            //console.log('pathUrl',absPath)
            const child = createAsset(absPath)
            keyCode.mapping[pathUrl] = child.id
            entryArray.push(child)
        })
    }
    console.log('entryArray',entryArray)
    return entryArray
}

function bundel (graph){
    let modules = ''
    graph.forEach((mod)=>{
        modules+=`
            ${mod.id}:[
                function(require,modules,exports){
                    ${mod.code}
                },
                ${JSON.stringify(mod.mapping)}
            ],
        `
    })

    const result = `
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
        })({${modules}})
    `
    return result
}

const graph =  creatGraph('./src/index.js')
const result = bundel(graph)

console.log('~~~~~~开始~~~~~~~~~')
console.log('~~~~~~~~~~~~~~~')
console.log('~~~~~~~~~~~~~~~')
//console.log('result',result)

console.log('~~~~~~~~~~~~~~~')
console.log('~~~~~~~~~~~~~~~')
console.log('~~~~~~~~~结束~~~~~~')


fs.writeFileSync('./dist/main1.js',result,['utf-8'])