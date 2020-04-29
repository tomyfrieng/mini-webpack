const fs = require('fs')
const path  = require('path')
const config = require('./lib/config')// 配置文件
const Creatasset = require('./lib/create-asset.js')

let id= 0
class Jscode {
    constructor(entry){
        this.graph =  this.creatGraph(entry)
        this.result = this.bundel()
    }

    //建立文件依赖图谱
    creatGraph(entry){
        const entryCode = new Creatasset(entry,id++)
        const entryArray  = [entryCode]
        for (const keyCode of entryArray) {
            const dirname = path.dirname(keyCode.filename)
            keyCode.mapping = {}
            keyCode.fileArray.forEach((pathUrl)=>{
                const absPath = path.resolve(dirname,pathUrl)
                const child = new Creatasset(absPath,id++)
                keyCode.mapping[pathUrl] = child.id
                entryArray.push(child)
            })
        }
        return entryArray
    }

    //将图谱遍历拿到code，放在自执行函数里面
    bundel (){
        let modules = ''
        this.graph.forEach((mod)=>{
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
                        exports :{}
                    }
                    fn(localUrl,module,module.exports)
                    return module.exports
                }
                require(0)
            })({${modules}})
        `
        return result
    }
}
const jscode = new Jscode(config.entry)
const output = config&&config.output

if(output.path&&output.filename&&jscode.result){
    fs.writeFileSync(path.join(output.path,output.filename),jscode.result,['utf-8'])
}

