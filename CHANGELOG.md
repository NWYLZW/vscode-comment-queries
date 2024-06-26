# Change Log

All notable changes to the "vscode-comment-queries" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

* [ ] 多语言支持
  * [ ] ...任何有 lsp 的语言
* [ ] 更多的文件支持
  * [ ] markdown
  * [ ] html
  * [ ] vue
  * [ ] ...一切可以嵌套其他语言的语言
* [ ] 配置增强
  * [ ] 移除提示消息的前缀
  * [ ] 消息展示长度限制
* [ ] 辅助生成类型查询注释
  * [ ] 右键菜单
  * [ ] 快捷键
* [ ] 使用 `ZoneWidget(折叠面板)` 的方式展示消息
  * 需求来自于 [orta/vscode-twoslash-queries#2](https://github.com/orta/vscode-twoslash-queries/issues/2)
  * 目前 vscode 未暴露任何 API，需要等待 vscode 支持该功能。[microsoft/vscode#140752](https://github.com/microsoft/vscode/issues/140752)
* [ ] 子查询

  ```ts
  type T = { a: { b: c: number } }
  //   ^?.a.b.c (property) [number]
  //   ^2?['a'] (property) [{ b: { c: number; }; }]
  ```
  * vscode's ts language server 尚未允许调用[更多的指令](https://github.com/microsoft/vscode/blob/3a52e79cead6fa54139f5d0098c3380c6546ab4a/extensions/typescript-language-features/src/commands/tsserverRequests.ts#L26-L37)，无法通过 run command 的方式拿到对应的类型。

## [1.2.4] - 2024-05-24

### 新功能

* [x] 支持 rust

## [1.2.3] - 2022-12-02

No changes, only update README.md.

## [1.2.2] - 2022-12-02

### 新功能

* [x] 支持 ⌄vV

## [1.2.1] - 2022-11-28

### 新功能

* [x] 快速跳转到查询目标的位置

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
