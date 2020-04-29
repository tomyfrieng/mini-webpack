# webpack 原理
## webpack 原理流程图
![流程图](https://github.com/tomyfrieng/mini-webpack/blob/master/src/images/lctu.png)

## 涉及到的babel

#### "@babel/core": "^7.9.0",   // babel/core  ES6->ES5
#### "@babel/parser": "^7.9.4", //  把import的模块全部转成AST
#### "@babel/preset-env": "^7.9.5",   babel.transformFromAstSync 通过ast 把code从es6转换成es5
#### "@babel/traverse": "^7.9.5", // 拿到AST节点，拿到依赖dependencies，用数组存储起来
