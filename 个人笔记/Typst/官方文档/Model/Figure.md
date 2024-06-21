---
created_at: 2024-06-18 20:02:36
updated_at: 2024-06-21 17:49:54
url: https://typst.app/docs/reference/model/figure
---
#figure

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

## 自定义 Caption

通过修改 `caption` 函数来实现自定义 Caption。

````typst
#code(
```typ
#show figure.caption: emph
#figure(
rect[Hello],
caption: [I am emphasized!]
)
```
)
````

也可以给中文加上着重号：

````typst
#code(
```typ
#show figure.caption: content => {
    show regex("\p{sc=Han}"): it => box(place(text("·", size: 1.3em), dx: 0.2em, dy: 0.02em)) + it
    content.body
}
#figure(
    rect[Hello],
    caption: [我是中文描述文字]
)
```
)
````

使用 `where` 选择器来设置特定类型的 figure。

````typst
#code(
```typ
#show figure.where(
    kind: table
): set figure.caption(position: top)

#figure(
    table(columns: 2)[A][B][C][D],
    caption: [I'm up here],
)
```
)
````

## 参数

![[Pasted image 20240620180423.png]]

### body

图的内容。通常为 [[Image|image]]。

### placement

图在页面上的显示位置。值为 `none`, `auto`, `top` 或 `bottom`。

### caption

图的描述信息。

### kind

图的类型，默认类型有 `image`, `table`，其它需要自行定义：

`````````typst
#code(
``````typ
#show figure.where(
    kind: "code",
): emph

#figure(
    rect[
        ```typ
        #set page(font: "Times New Roman")
        ```
    ],
    kind: "code",
    caption: [
        在 Typst 中设置页面字体代码。
    ],
    supplement: [代码]
)
``````
)
`````````

### suplement

该图的补充。会根据语言选择合适的文字。如英文图片显示为：`Figure 1:` 中文显示为 `图片 1`。

### numbering

图编号。默认为 `1`，参考 [[Numbering|numbering]]。

### gap

正文和标题之间的垂直间隙。默认为 `0.65em`。

````typst
#code(
```typ
#figure(
    rect[内容],
    gap: 3em,
    caption: [我是描述文字]
)
```
)
````

### outlined

该图是否应出现在图的轮廓中。默认为 `true`。

参考 [[Outline]]

## Caption 自定义

![[Pasted image 20240620201954.png]]

### position

标题在图中的位置。`top` 或 `bottom`。默认 `bottom`。

### seperator

将出现在数字和正文之间的分隔符。根据不同的语言和区域会有所不同。

````typst
#code(
```typ
#set text(lang: "zh")
#set figure.caption(separator: [: ])

#figure(
  rect[Hello],
  caption: [A rectangle],
)
```
)
````

### body

标题的正文。可以与种类、补充、计数器、编号和位置一起使用，以完全自定义标题。

````typst
#code(
```typ
#set text(lang: "zh")
#show figure.caption: it => [
  #underline(it.body) |
  #it.supplement
  #context it.counter.display(it.numbering)
]

#figure(
  rect[Hello],
  caption: [A rectangle],
)
```
)
````