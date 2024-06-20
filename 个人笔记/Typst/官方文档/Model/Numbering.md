---
created_at: 2024-06-20 18:58:51
url: https://typst.app/docs/reference/model/numbering/
updated_at: 2024-06-20 20:02:32
---
 #numbering

将编号应用于数字序列。

编号定义了如何将数字序列显示为内容。它通过模式字符串或任意函数进行定义。

编号模式由计数符号（实际数字替换）、其前缀和一个后缀组成。前缀和后缀按原样重复。

## 示例

```typst
#numbering("1.1)", 1, 2, 3, 4, 5, 6, 7)\
#numbering("一月", 1, 2, 3)\

#let formatNumber(type, ..nums) = {
    numbering(
        (..nums) => nums
        .pos()
        .map(str => numbering(type, str))
        .join(", "),
        ..nums
    )
}

#formatNumber("i", 1,2,3,4,5,6,7) \
#formatNumber("I", 1,2,3,4,5,6,7) \
#formatNumber("一", 1,2,3,4,5,6,7) \
#formatNumber("a", 1,2,3,4,5,6,7) \
#formatNumber("A", 1,2,3,4,5,6,7) \
#formatNumber("壹", 1,2,3,4,5,6,7, 8, 9, 10) \
#formatNumber("あ", 1,2,3,4,5,6,7) \
#formatNumber("い", 1,2,3,4,5,6,7) \
#formatNumber("ア", 1,2,3,4,5,6,7) \
#formatNumber("イ", 1,2,3,4,5,6,7) \
#formatNumber("가", 1,2,3,4,5,6,7) \
#formatNumber("ㄱ", 1,2,3,4,5,6,7) \
```

## 参数

![[Pasted image 20240620200031.png]]

计数符号为 `1`、`a`、`A`、`i`、`I`、`一`、`壹`、`あ`、`い`、`ア`、`イ`、`א`、`가`、`ᄀ` 和`*`。在给定的情况下，它们被序列中的数字替换。 `*` 字符表示应使用符号进行计数，顺序为 `*`、`†`、`‡`、`§`、`¶` 和 `‖`。如果项目超过 6 个，则使用多个符号表示该数字。

## 参考

- [How to set numbering only for specific heading level? · typst/typst · Discussion #1363 (github.com)](https://github.com/typst/typst/discussions/1363)