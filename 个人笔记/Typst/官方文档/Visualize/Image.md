---
created_at: 2024-06-20 18:06:39
url: https://typst.app/docs/reference/visualize/image/
updated_at: 2024-06-20 18:16:19
---
#image

## 参数

![[Pasted image 20240620180801.png]]

### path

图片路径。

### format

图片格式，默认为 `auto`，可选值：`png`, `jpg`, `gif` 和 `svg`。

### width

图片宽度。

### height

图片高度。

### alt

图片描述。

### fit

图片适应方式。默认为 `cover`，可选：`cover`, `contain` 和 `stretch`。

## 定义

从字节或字符串中解码光栅或矢量图形。

![[Pasted image 20240620181414.png]]

示例：

````tab
tab: 示例代码
```
#let original = read("diagram.svg")
#let changed = original.replace(
  "#2B80FF", // blue
  green.to-hex(),
)

#image.decode(original)
#image.decode(changed)
```
tab: 结果
![[Pasted image 20240620181617.png]]
````

