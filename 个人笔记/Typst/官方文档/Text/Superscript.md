---
created_at: 2024-06-21 18:35:56
url: https://typst.app/docs/reference/text/super/
updated_at: 2024-06-21 18:51:07
---
#super

## 参数

![[Pasted image 20240621183650.png]]

### typographical

是否首选字体的专用上标字符。

如果启用此功能，Typst 将首先尝试将文本转换为上标代码点。如果失败，它将回退到渲染凸起和缩小的普通字母。

默认：`true`。

````typst
#code(
```typ
N#super(typographic: true)[1]
N#super(typographic: false)[1]
```
)
````

### baseline

合成上标的基线偏移。如果 typography 为 true，并且字体具有给定正文的上标代码点，则不适用。

默认：`-0.5em`。

````typst
#code(
```typ
N#super(typographic: false, baseline: 0.3em)[1] \
N#super(typographic: false, baseline: -1.2em)[1]
```
)
````

### size

合成上标的字体大小。如果 `typographic` 为 `true`，并且字体具有给定正文的上标代码点，则不适用。

默认：`0.5em`。

````typst
#code(
```typ
N#super(typographic: false, size: 0.8em)[1] \
N#super(size: 0.8em)[1]
```
)
````

### body

上标显示的内容。