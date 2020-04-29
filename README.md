# webpack 原理
## webpack 原理流程图
![流程图](https://github.com/tomyfrieng/mini-webpack/blob/master/src/images/lctu.png)

## 涉及到的babel

"@babel/core": "^7.9.0",   // babel/core  ES6->ES5
"@babel/parser": "^7.9.4", //  把import的模块全部转成AST
"@babel/preset-env": "^7.9.5",   babel.transformFromAstSync 通过ast 把code从es6转换成es5
"@babel/traverse": "^7.9.5", // 拿到AST节点，拿到依赖dependencies，用数组存储起来

## 依赖图谱
 `
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
`
