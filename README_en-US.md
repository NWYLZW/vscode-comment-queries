<p align="center">
  <img src="https://raw.githubusercontent.com/NWYLZW/vscode-comment-queries/main/extension/favicon.png" width=128 height=128 >
</p>

# Vscode Comment Queries

|[zh-Hans](https://github.com/NWYLZW/vscode-comment-queries/blob/main/READM_zh-Hans.md)
|en-US

Show the (variable) types in your code through annotation syntax and inline prompts, install it by [marketplace](https://marketplace.visualstudio.com/items?itemName=YiJie.vscode-comment-queries).

## Demo

### Relative Query

![pre-line-point](https://raw.githubusercontent.com/NWYLZW/vscode-comment-queries/main/images/pre-line-point.gif)

![next-line-point](https://raw.githubusercontent.com/NWYLZW/vscode-comment-queries/main/images/next-line-point.gif)

![left-right-point](https://raw.githubusercontent.com/NWYLZW/vscode-comment-queries/main/images/left-right-point.gif)

![cross-line-point](https://raw.githubusercontent.com/NWYLZW/vscode-comment-queries/main/images/cross-line-point.gif)

### Absoulute Query

![absolute-point](https://raw.githubusercontent.com/NWYLZW/vscode-comment-queries/main/images/abs-in-cur-file.gif)

![cross-file-point](https://raw.githubusercontent.com/NWYLZW/vscode-comment-queries/main/images/cross-file-point.gif)

## Features

* Support for multiple programming languages
  * TypeScript
  * Python
  * Golang
  * Rust

* [x] Relative file line column query
    * [x] Up and down

    ```ts
    //   _x2?
    //   _?
    type T = 1 | 2
    //   ^?
    //   ^x2?
    ```

    * [ ] Left and right

    ```ts
    type /*>?*/ T /*<?*/ = 1 | 2 //<4?
    ```

* [x] Absoulute file line column query
    * [x] Current file

        ```ts
        // @114,514?
        // @[114, 514]?
        ```

    * [x] Cross file
        * [x] Absoulute path

            ```ts
            // @./foo.ts:114:514?
            ```

        * [x] Relative path

            ```ts
            // @/users/xxx/codes/foo.ts:114:514?
            ```

## Configure

* [ ] Remove the prefix of the prompt message
* [ ] Message display length limit

## Q&A

* Q: Why can't the prompt message be displayed?
* A: Please check if your vscode version supports the `editor.inlayHints.enabled` configuration item and set it to `on`.
* Q: An error may occur when querying in the top row or bottom row.
* A: I haven't done the verification, so I won't fix it for now.
* Q: There may be calculation errors when querying for elements with no corresponding row and column.
* A: I don't want to fix it yet, you can fix it yourself.
* Q: Why doesn't it support jumping to definition in python and go (<ctrl|cmd> + mouse right click)?
* A: It has not been implemented, and I personally do not have the need for it (you can provide a PR to support it).

## About

Using in [IDEA](https://github.com/NWYLZW/idea-comment-queries).

## [Release Notes](./CHANGELOG.md)
