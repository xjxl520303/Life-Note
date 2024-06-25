---
tags:
  - 博客
  - Obsidian
  - CriticMarkup
  - Commentator
created_at: 2024-06-22 23:59:05
plugins:
  - Obsidian-CriticMarkup
platforms:
  - name: 知乎
    url: ""
    date: ""
    last_update: ""
  - name: 掘金
    url: ""
    date: ""
    last_update: ""
---

| 平台                          | 发布时间                                | 更新时间                                       | 文章地址                           |
| :-------------------------- | :---------------------------------- | :----------------------------------------- | :----------------------------- |
| `VIEW[{platforms[0].name}]` | `INPUT[dateTime:platforms[0].date]` | `INPUT[dateTime:platforms[0].last_update]` | `INPUT[text:platforms[0].url]` |
| `VIEW[{platforms[1].name}]` | `INPUT[dateTime:platforms[1].date]` | `INPUT[dateTime:platforms[1].last_update]` | `INPUT[text:platforms[1].url]` |

想必读者朋友们对于微信读书，知乎读书等不陌生——在阅读时，会发现在标题和段落处有很多人分享了自己的感悟、理解、疑问……。

在 Obsidian 中我们也可以实现同样的效果，只不过发表评论的是你自己。

在介绍本文涉及的插件前，我们先来了解一下一个存在于很早的！——专门为纯文本提供的文本更改跟踪语法：**Critic Markup**。

>Critic Markup 旨在提供纯文本文件中的基本编辑更改跟踪。语法与 Markdown、MultiMarkdown 和 HTML 兼容。

在介绍具体语法前我们先穿插一个关于 Markdown 代码变更的语法（目的在于两者结合使用）：「diff 代码块」：

````
```diff
-print("hello")
+print("world!")
```
````

结果：

```diff
-print("hello")
+print("world!")
```

可以看到【删除】的部分显示成了红色，【变更】或者【新增】部分为绿色。

现在我们切入主题——Critic Markup 提供了 5 种标记语法：

- Addition `{++ ++}`
- Deletion `{-- --}`
- Substitution `{~~ ~> ~~}`
- Comment `{>> <<}`
- Highlight `{== ==}{>> <<}`

用中文表示就是【添加】、【删除】、【替换】、【评论】和【高亮】。

下面我们来看一下实际应用截图：

- ⑴ 错别字纠正：

![[Pasted image 20240624120352.png]]

- ⑵ 阅读时标记重要文本：

![[Pasted image 20240624121300.png]]

- ⑶ 阅读时添加弹评（知乎中的叫法）：

![[Pasted image 20240624121925.png]]

- ⑷ 添加和删除内容：

![[Pasted image 20240624122548.png]]

## 总结

最后，动动你发财的小手，关注，点赞一键三连，你的鼓励是我坚持下去的动力。有任何问题欢迎加作者微信（`jenemy_xl`）沟通交流一起成长或者加入读者交流微信群一起探讨 Obsidian 的使用技巧和资源分享。

更多内容，请关注我的专栏：[Obsidian 达人成长之路 - 知乎 (zhihu.com)](https://www.zhihu.com/column/c_1776563728286670848)

## 参考

- [Fevol/obsidian-criticmarkup: Annotate notes with comments and suggestions using CriticMarkup in Obsidian (github.com)](https://github.com/Fevol/obsidian-criticmarkup)
- [CriticMarkup/CriticMarkup-toolkit: Various tools to use CriticMarkup in your daily workflow (github.com)](https://github.com/CriticMarkup/CriticMarkup-toolkit)
- [New Plugin: Commentator - Share & showcase - Obsidian Forum](https://forum.obsidian.md/t/new-plugin-commentator/66013/16)