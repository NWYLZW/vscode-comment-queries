# vscode-comment-queries README

通过注释语法与内嵌提示展示你的代码中的变量类型。

## 演示

```ts
type T = {
  a: string
  c?: boolean
  d: 'some desc\n\\n'
  e: {
    f: string
    g: true
  }
  fff: 'fier'
}

//   _?
type T0 = T['a']
//   ^?

type T2 = T['e']['f']
//   ^?
//           ^x2?
//               ^x3?

// @4,4?
```

## 功能

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
    type /*>?*/ T /*<?*/ = 1 | 2
    ```

* [x] 绝对文件行列 query 查询
    * [x] 当前文件指定行列

        ```ts
        // @114,514?
        // @[114, 514]?
        ```

    * [ ] 跨文件指定行列查询
        * [ ] 相对路径支持
            
            ```ts
            // @./foo.ts:114:514?
            ```

        * [ ] 绝对路径支持

            ```ts
            // @/users/xxx/codes/foo.ts:114:514?
            ```

## TODO

* [ ] 多语言支持
  * [ ] python
  * [ ] golang
  * [ ] rust
  * [ ] ...任何有 lsp 的语言

## 插件配置

~~还不知道有啥配置~~

## Q&A

* Q: 在顶行上行查询或者底行下行查询会报错（可能）
* A: 我没做校验，先不做

## Release Notes

### 1.0.0

#### 新功能

* 相对文件行类型查询
* 绝对当前文件行列查询
