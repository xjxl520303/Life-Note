---
created_at: 2024-06-20 13:20:15
url: https://typst.app/docs/reference/layout/block
tags:
  - Typst
updated_at: 2024-06-22 21:32:58
---
#block

## 示例

设置块背景色和内容。

```typst
#set page(height: 150pt, fill: blue)
#block(
	fill: luma(230),
	inset: 8pt,
	radius: 4pt,
	breakable: true,
	[
	    #lorem(30)
	]
)

#block(
    fill: luma(110),
    height: 40pt,
    lorem(10)
)
```

块还可用于强制原本内联的元素变为块级元素，尤其是在编写显示规则时。

```typst
#show heading: it => it.body
= Blockless
More text.

#show heading: it => block(it.body)
= Blocky
More text.
```

## 参数

![[Pasted image 20240620154726.png]]

### width

````typst
#code(
```typ
#set align(center)
#block(
    width: 60%,
    inset: 8pt,
    fill: silver,
    lorem(10)
)
```
)
````

### height

在设置块的高度时，如果超过页面的高度，内容默认会在下一页继续显示。可以通过 `breakable` 属性来控制，默认情况下为 `true`，表示下一页显示剩下内容。

```typst
#set page(height: 80pt)
#set align(center)
#block(
    breakable: true,
    height: 150%,
    width: 80%,
    fill: aqua,
)
```

### breakable

是否可以打破块并继续下一页。

### fill

填充背景颜色。

### stroke

描边。

### radius

圆角。

### inset

填充块内容的量。

### outset

在不影响布局的情况下扩展块大小的程度。

```typst
#set align(center)
#lorem(20)
#block(
    width: 80%,
    fill: aqua,
    outset: 30pt,
    lorem(30)
)
#lorem(20)
```

### spacing

此块周围的间距。这是将 `above` 和 `below` 设置为相同值的简写。

默认：`1.2em` 

```typst
#set align(center)
#lorem(20)
#block(
  width: 80%,
  fill: aqua,
  spacing: 3em,
  lorem(10)
)
#lorem(20)
```

### above

此块与其前一个块之间的间距。优先于间距。可以与 show 规则结合使用，以调整任意块级元素周围的间距。

默认：`1.3em` 

### below

此块与其后继块之间的间距。优先于间距。

默认：`1.2em` 

### clip

是否剪辑块内的内容。

```typst
#set align(center)
#lorem(20)
#block(
    width: 50%,
    height: 23pt,
    fill: aqua,
    clip: true,
    lorem(30)
)
#lorem(20)
```

### body

块内容。