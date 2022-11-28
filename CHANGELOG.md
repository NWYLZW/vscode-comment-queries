# Change Log

All notable changes to the "vscode-comment-queries" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

* [ ] 多语言支持
  * [ ] rust
  * [ ] ...任何有 lsp 的语言
* [ ] 更多的文件支持
  * [ ] markdown
  * [ ] html
  * [ ] vue
  * [ ] ...一切可以嵌套其他语言的语言
* [ ] 配置增强
  * [ ] 移除提示消息的前缀
  * [ ] 消息展示长度限制
* [ ] 使用折叠面板的方式展示消息 [Hover Marker](https://vshaxe.github.io/vscode-extern/vscode/Hover.html)
* [ ] 子查询

  ```ts
  type T = { a: { b: c: number } }
  //   ^?.a.b.c (property) [number]
  //   ^2?['a'] (property) [{ b: { c: number; }; }]
  ```

## [1.1.0] - 2022-11-28

### 新功能

* [x] 跨文件追踪

## [1.0.1] - 2022-11-27

### 新功能

* [x] 多语言支持
  * [x] python
  * [x] golang

## [1.0.0] - 2022-11-26

### 新功能

* 相对文件行类型查询
* 绝对当前文件行列查询
