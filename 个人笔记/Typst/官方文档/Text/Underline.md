---
created_at: 2024-06-21 18:01:53
url: https://typst.app/docs/reference/text/underline/
updated_at: 2024-06-22 21:34:41
tags:
  - Typst
---
#underline

## 参数

![[Pasted image 20240621180341.png]]

### stroke

描边颜色。默认 `auto`。

下面这个示例中指定了描边厚度和颜色。

````typst
#code(
```typ
Take #underline(
	stroke: 3.5pt + red,
	[care]
)
```
)
````

### offset

下划线偏移。默认 `auto`。

````typst
#code(
```typ
#underline(offset: 15pt)[
  The Tale Of A Faraway Line I
]
```
)
````

### extent

将行延伸到内容之外（如果为负数，则在内容之内）的量。默认 `0pt`。

````typst
#code(
```typ
#align(center,
  underline(extent: 20pt)[Chapter 1]
) \
#align(center,
  underline(extent: -20pt)[Chapter 1]
)
```
)
````

### evade

该行是否跳过了与字形发生冲突的部分。默认 `true`。

````typst
#code(
```typ
This #underline(evade: true)[is great].
This #underline(evade: false)[is less great].
```
)
````

### background

该行是否位于其下划线的内容后面。默认 `false`。

````typst
#code(
```typ
#set underline(stroke: (thickness: 1em, paint: maroon, cap: "round"))
#underline(background: true)[This is stylized.] \
#underline(background: false)[This is partially hidden.]
```
)
````