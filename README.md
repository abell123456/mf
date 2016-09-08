# mf
基于react以及redux、redux-thunk等react全家桶，采用`elm`语法，简化redux数据流管理的轻量级框架

## 把例子跑起来
    1. 全局安装`dora`；
    2. 到`mv/examples/count`目录下，执行`npm install`安装依赖；
    3. 依赖安装完成后，执行`npm start`即可开启本地服务；
    4. 到浏览器中`http://localhost:8989/`的地址查看效果。


## 项目由来
受[dva](https://github.com/dvajs/dva/tree/master)的启发，简洁的使用方式（参考了elm语法），大大减轻了使用redux时的成本。但是`dva`默认使用了[redxu-saga](https://github.com/yelouafi/redux-saga/tree/master)，让不太熟悉`generator`语法的开发同学上手成本还是有点高。于是做了这版更简洁的默认使用[redux-thunk](https://www.npmjs.com/package/redux-thunk)来实现简化开发流程的版本。
