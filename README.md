# mf

基于react以及redux、react-router、react-router-redux等react全家桶，采用[choo](https://github.com/yoshuawuyts/choo)语法，简化redux数据流管理的轻量级框架

## 把例子跑起来

    全局安装`dora`；

### 没有`router`的版本：
```bash
$ cd examples/count
$ npm install
$ npm start
$ open http://localhost:8989/index.html
```

### 有`router`的版本：
```bash
$ cd examples/count-router
$ npm install
$ npm start
$ open http://localhost:8989/index.html
```


## 项目由来

受[dva](https://github.com/dvajs/dva/tree/master)的启发，简洁的使用方式（参考了choo语法），大大减轻了使用redux时的成本。但是`dva`默认使用了[redxu-saga](https://github.com/yelouafi/redux-saga/tree/master)，让不太熟悉`generator`语法的开发同学上手成本还是有点高，另一方面，对于移动端来说，Generator被Babel编译后的代码量有点大，移动端大范围使用Generator也不太合适。于是做了这版更简洁的使用自己开发的`redux中间件`来实现简化开发流程的版本。

## TODOS

    [√] 判断effects返回结果是否为promise，按照`redux-promise`规范加入`Promise`自动dispatch支持；
    [√] 拆分框架为`有router`和`无router`两块，可按需引入；
    [√] 为框架添加插件机制；
    [√] `Loading加载`插件开发。

## 相关插件

1、自动Loading执行插件：mf-loading
