<p align="center">
  <img src="https://raw.githubusercontent.com/NWYLZW/vscode-comment-queries/main/favicon.png" width=128 height=128 >
</p>

# Vscode Comment Queries

通过注释语法与内嵌提示展示你的代码中的变量类型。

## 演示

### 相对查询

![pre-line-point](https://raw.githubusercontent.com/NWYLZW/vscode-comment-queries/main/images/pre-line-point.gif)

![next-line-point](https://raw.githubusercontent.com/NWYLZW/vscode-comment-queries/main/images/next-line-point.gif)

![left-right-point](https://raw.githubusercontent.com/NWYLZW/vscode-comment-queries/main/images/left-right-point.gif)

![cross-line-point](https://raw.githubusercontent.com/NWYLZW/vscode-comment-queries/main/images/cross-line-point.gif)

### 绝对查询

![absolute-point](https://raw.githubusercontent.com/NWYLZW/vscode-comment-queries/main/images/abs-in-cur-file.gif)

![cross-file-point](https://raw.githubusercontent.com/NWYLZW/vscode-comment-queries/main/images/cross-file-point.gif)

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
* Q: 查询对应行列无元素的时候会偏移计算失误
* A: 还不想修，你自己可以修
* Q: 为什么不支持在 python 和 go 中 (<ctrl|cmd> + mouse right click) 跳转到定义
* A: 没有实现，个人暂时没有需求（你可以提供一个 pr 支持）

## 相关

在 [IDEA](https://github.com/NWYLZW/idea-comment-queries) 中使用

## [Release Notes](./CHANGELOG.md)
