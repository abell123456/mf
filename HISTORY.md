# mf

## 0.1.4

- no-router部分完成插件支持，并添加自动Loading插件

## 0.1.3

- router部分实现改造完成

## 0.1.2

- 十二宫发布组件找不到src文件夹以外的文件，做了修改

## 0.1.1

- 抽出公共helper；
- 增添基于router的demo。

## 0.1.0

- 将整个应用拆分为依赖router以及不依赖router的两个版本；
- 两个部分可以单独引用；
- 默认是不依赖router的部分，整个应用更小更轻量；
- 依赖router的部分可以用来做单页应用；
- 自己实现redux中间件，不再依赖于`redux-thunk`。

## 0.0.9

- `react-router`依赖改版，zodiac平台还没有2.7.0版本

## 0.0.7

- 修复`app.start()`未传入参数没有返回数据的问题

## 0.0.6

- `react-eouter`采用最新版本，不然armor构建会报错

## 0.0.4

- `babel`配置去掉`babel-runtime`，zodiac平台无法发布该模块- 增添`HISTORY.md`
- 增添`HISTORY.md`文件


## 0.0.3

- zodiac平台发布只发布`index.js`，作相应适配


## 0.0.1

- 新版本的 mf 第一次 release
