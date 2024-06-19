---
created_at: 2024-06-14 19:44
updated_at: 2024-06-14 19:51
---

已发布文章 Dataview 查询：

```dataview
TABLE WITHOUT ID
file.link AS 链接,
file.frontmatter.platforms.name AS 发布平台,
file.frontmatter.platforms.url AS 文章地址,
file.frontmatter.platforms.date AS 发布时间,
file.frontmatter.platforms.last_update AS 更新时间
FROM "博客/Obsidian"
WHERE filter(file.frontmatter.platforms, (f) => f.url != "")
SORT file.frontmatter.platforms.date DESC
```

DataviewJS 查询：

```dataviewjs
const files = dv.pages('"博客/Obsidian"').filter(f => {
    return f['platforms'] && f['platforms'].length > 0 && f['platforms'][0]['url']
}).sort(f => f.frontmatter?.platforms?.date)

const tableMd = await dv.markdownTable(['文章名称', '发布平台', '文章地址', '发布时间', '更新时间'], files.flatMap((f, i) => {
    return f.platforms.flatMap((p, j) => {
        if (j === 0) {
            return [[ f.file.name, f.platforms[j].name, f.platforms[j].url, f.platforms[j].date, f.platforms[j].last_update ]]
        } else {
            return [[ '', f.platforms[j].name, f.platforms[j].url, f.platforms[j].date, f.platforms[j].last_update ]]
        }
    })
}))
console.log(tableMd)
```

## 已发布文章

| 文章名称                                                         | 发布平台 | 文章地址                                        | 发布时间             | 更新时间             |
| ------------------------------------------------------------ | ---- | ------------------------------------------- | ---------------- | ---------------- |
| 小插件推荐 #2：Obsidian Note Definitions                           | 知乎   | https://zhuanlan.zhihu.com/p/703193841      | 2024-06-13 15:40 | 2024-06-13 15:40 |
|                                                              | 掘金   | https://juejin.cn/post/7379487557598003237  | 2024-06-13 15:48 | 2024-06-13 15:48 |
| 小插件推荐 #1：Obsidian-II-Quicker                                 | 知乎   | https://zhuanlan.zhihu.com/p/702247623      | 2024-06-07 19:53 | 2024-06-07 19:53 |
|                                                              | 掘金   | https://juejin.cn/post/7377355452890693641  | 2024-06-07 19:58 | 2024-06-07 19:58 |
| Obsidian 达人成长之路 #1：使用终极工具 Dataview 释放笔记库的潜力 · DQL查询语言        | 知乎   | https://zhuanlan.zhihu.com/p/699143387      | 2024-06-12 18:24 | 2024-06-12 18:24 |
|                                                              | 掘金   | https://juejin.cn/post/7366454784122093595  | 2024-05-08 20:28 | 2024-05-08 20:28 |
| Obsidian 达人成长之路 #2：使用终极工具 Dataview 释放笔记库的潜力 · JavaScript API | 知乎   | https://zhuanlan.zhihu.com/p/699841771      | 2024-06-12 18:24 | 2024-06-12 18:24 |
|                                                              | 掘金   | https://juejin.cn/post/7372768355777839104  | 2024-05-27 11:33 | 2024-05-27 11:33 |
| Obsidian 达人成长之路 #3：使用终极工具 Dataview 释放笔记库的潜力 · 案例讲解           | 知乎   | https://zhuanlan.zhihu.com/p/700968386      | 2024-06-12 18:23 | 2024-06-12 18:23 |
|                                                              | 掘金   | https://juejin.cn/post/7374988830494228491  | 2024-05-31 17:25 | 2024-05-31 17:25 |
| Obsidian 达人成长之路 #4：使用 Text expand 插件插入查询结果                   | 知乎   | https://zhuanlan.zhihu.com/p/701245101      | 2024-06-12 18:23 | 2024-06-12 18:23 |
|                                                              | 掘金   | https://juejin.cn/post/7375871100523954227  | 2024-06-03 12:22 | 2024-06-03 12:22 |
| Obsidian 达人成长之路 #5：使用 Templater 减少重复工作，提高效率                  | 知乎   | https://zhuanlan.zhihu.com/p/703459656      | 2024-06-14 20:20 | 2024-06-14 20:20 |
|                                                              | 掘金   | https://juejin.cn/spost/7381347654767804425 | 2024-06-17 19:53 | 2024-06-17 19:53 |


## 计划写的文章

这里是一些后续有精力打算去分享的插件。
### 电子表格相关：


涉及插件：

- [divamgupta/obsidian-spreadsheets (github.com)](https://github.com/divamgupta/obsidian-spreadsheets)
- [klaudyu/CalcCraft: have formulas in tables like in excel: a1+a2, sum(), etc. (github.com)](https://github.com/klaudyu/CalcCraft)
- [Canna71/obsidian-sheets (github.com)](https://github.com/Canna71/obsidian-sheets)

文章参考：

- [Obs147｜簡易試算表外掛：CalcCraft，運算式儲存格 – 簡睿隨筆 (jdev.tw)](https://jdev.tw/blog/8274/obsidian-calccraft-easy-calculation-cells)