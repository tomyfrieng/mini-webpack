const fs = require('fs')
const parse = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')

module.exports = class Creatasset{
    constructor(filename,id){
        this.id =  id
        this.filename = filename
        this.ast = this.getAst()
        this.fileArray = this.getFileArray()
        this.code = this.getCode()
        return  {
            filename:this.filename,
            ast:this.ast,
            fileArray:this.fileArray,
            code:this.code,
            id : this.id++
        }
    }
    //code ->ast
    getAst(){
        const content = fs.readFileSync(this.filename,'utf-8')   
        //获取ast
        const ast = parse.parse(content,{
            sourceType:'module'
        })
        return ast
    }

    // 获取文件里面的依赖
    getFileArray(){
        let fileArray = []
        traverse(this.ast,{
            ImportDeclaration:({node})=>{
                fileArray.push(node.source.value)
            }
        })
        return fileArray
    }

    //拿到文件的code
    getCode(){ 
        const {code}  = babel.transformFromAstSync(this.ast,'',{
            presets:['@babel/preset-env']
        })
        return code
    }
}