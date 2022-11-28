# vscode-comment-queries README

通过注释语法与内嵌提示展示你的代码中的变量类型。

## 演示

### 相对查询

[pre-line-point](./images/pre-line-point.gif)

[next-line-point](./images/next-line-point.gif)

[left-right-point](./images/left-right-point.gif)

[cross-line-point](./images/cross-line-point.gif)

### 绝对查询

[absolute-point](./images/abs-in-cur-file.gif)

[cross-file-point](./images/cross-file-point.gif)

## 功能

* 支持多语言
  * TypeScript
  * Python
  * Golang

* [x] 相对文件行列 query 查询
    * [x] 上下文件行

    ```ts
    //   _x2?
    //   _?
    type T = 1 | 2
    //   ^?
    //   ^x2?
    ```

    * [ ] 左右文件列

    ```ts
    type /*>?*/ T /*<?*/ = 1 | 2 //<4?
    ```

* [x] 绝对文件行列 query 查询
    * [x] 当前文件指定行列

        ```ts
        // @114,514?
        // @[114, 514]?
        ```

    * [x] 跨文件指定行列查询
        * [x] 相对路径支持

            ```ts
            // @./foo.ts:114:514?
            ```

        * [x] 绝对路径支持

            ```ts
            // @/users/xxx/codes/foo.ts:114:514?
            ```

## 插件配置

* [ ] 移除提示消息的前缀
* [ ] 消息展示长度限制

## Q&A

* Q: 在顶行上行查询或者底行下行查询会报错（可能）
* A: 我没做校验，先不做

## [Release Notes](./CHANGELOG.md)
