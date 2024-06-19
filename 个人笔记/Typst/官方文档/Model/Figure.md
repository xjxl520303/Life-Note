---
created_at: 2024-06-18 20:02:36
updated_at: 2024-06-18 20:26:36
---
#figure

官网：[Figure Function – Typst Documentation](https://typst.app/docs/reference/model/figure/)

## 示例

如果语言为英文则图片描述默认添加 `Figure 1:` 后面为添加的内容，要显示为中文需要设置 `#set text(lang: 'zh')` ，然后显示为 `图 1`。

- 示例 1：图片添加描述文字

示例中使用 `@xxx` 来引用我们定义的标签 `<xxx>`。

````tab
tab: 示例代码
```
#set text(lang: "zh")

从 @示例_1 中可以看出执行成功了。

#figure(
  image("附件/24.png", width: 50%),
  caption: [
    图片描述文字。
  ]
) <示例_1>
```
tab: 结果
![[Pasted image 20240618201459.png]]
````

- 示例 2：表格添加描述文字

````tab
tab: 示例代码
```
#figure(
  table(
    columns: 4,
    [t], [1], [2], [3],
    [y], [0.3s], [0.4s], [0.8s],
  ),
  caption: [
    表格描述文字
  ]
)
```
tab: 结果
![[Pasted image 20240618202630.png]]
````

