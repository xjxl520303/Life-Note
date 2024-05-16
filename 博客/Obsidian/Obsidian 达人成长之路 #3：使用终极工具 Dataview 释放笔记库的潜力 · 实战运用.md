---
tags:
  - Blog
  - Dataview
  - Obsidian
---

## 初级篇：Dataview 基础应用

初级篇主要涉及一些比较简单的查询操作，适用于初学者练手，主要聚焦在 DQL 查询上以及基础的 JavaScript API 查询操作。

### 内联查询

内联查询适合于不需要作过多逻辑判断的属性查询，不需要指定代码块，可以在页面正文中任意位置插入查询语句。下面是 DQL 和 JavaScript API 两种语法示例。

DQL 内联查询示例：

````
topic:: basic inline queries
description:: Showcase basic syntax of DQL and JS Inline Queries

创建时间：`= this.file.ctime` %% 2024-05-13 11:05:56 %%
修改时间：`= this.file.mtime` %% 2024-05-15 12:05:44 %%
标签：`= this.tags` %% Blog, Dataview, Obsidian %%
内联字段查询：`= this.topic` %% basic inline queries %%
文本截取：`= truncate(this.description, 20, "...")` %% Showcase basic synt… %%
条件判断：`= choice(contains(this, "topic"), "Set", "Missing!")` %% Set %%
获取带有特殊字符的链接访问失败：`= [[博客/Obsidian/Obsidian 达人成长之路 #1：使用终极工具 Dataview 释放笔记库的潜力 · DQL查询语言]].file.ctime` %% - %%
需要调整为：`= link("博客/Obsidian/Obsidian 达人成长之路 #1：使用终极工具 Dataview 释放笔记库的潜力 · DQL查询语言").file.ctime` %% 2024-05-06 11:05:12 %%
文章包含的链接数量：`= length(link("博客/Obsidian/Obsidian 达人成长之路 #1：使用终极工具 Dataview 释放笔记库的潜力 · DQL查询语言").file.outlinks)` %% 27 %%
除图片以外的链接数量：`= length(filter(link("博客/Obsidian/Obsidian 达人成长之路 #1：使用终极工具 Dataview 释放笔记库的潜力 · DQL查询语言").file.outlinks, (x) => !meta(x).embed))` %% 2 %%
现在时间：`= date(now)` %% 2024-05-15 16:05:24 %%
持续时间：`= dur(1mo2d)` %% 1个月、2天 %%
格式化时间：`= dateformat(date(now), "M'月'dd'号'")` %% 5月15号 %%
````

JavaScript API 示例：

````
创建时间：`$= dv.current().file.ctime` %% 2024-05-13 11:05:56 %%
修改时间：`$= dv.current().file.mtime` %% 2024-05-15 12:05:44 %%
标签：`$= dv.current().file.tags` %% Blog, Dataview, Obsidian %%
内联字段查询：`$= dv.current().topic` %% basic inline queries %%
文本截取：`$= dv.evaluate("truncate(this.description, 20, \"…\")").value` %% Showcase basic synt… %%
或者：`$= dv.tryEvaluate("truncate(this.description, 20, \"…\")")` %% Showcase basic synt… %%
条件判断：`$= dv.current().topic ? 'Set' : 'Missing!'` %% Set %%
获取文件创建时间：`$= dv.page("博客/Obsidian/Obsidian 达人成长之路 #1：使用终极工具 Dataview 释放笔记库的潜力 · DQL查询语言").file.ctime` %% - %%
文章包含的链接数量：`$= dv.page("博客/Obsidian/Obsidian 达人成长之路 #1：使用终极工具 Dataview 释放笔记库的潜力 · DQL查询语言").file.outlinks.length` %% 27 %%
除图片以外的链接数量：`$= dv.page("博客/Obsidian/Obsidian 达人成长之路 #1：使用终极工具 Dataview 释放笔记库的潜力 · DQL查询语言").file.outlinks.where(link => !link.embed).length` %% 2 %%
现在时间：`$= dv.date('now')` %% 2024-05-15 16:05:24 %%
持续时间：`$= dv.duration('1mo2d')` %% 1个月、2天 %%
格式化时间：`$= dv.date('now').toFormat("M'月'dd'号'")` %% 5月15号 %%
````

> [!Tip] 使用内联 API 查询出来的标签在结果显示上和内联 DQL 的结果略有不同，前者是可交互的结果，后者为纯文本。

> [!Warning] 在 API 中没有对应的 `truncate()` 函数使用，但是我们可以 `dv.evalute()` 或者 `dv.tryEvaluate()` 函数在 API 中执行 DQL 查询。

> [!Warning] 在文件名不要包含 `#` 符号，在使用链接时会被错误的识别为标签或者页面标题。

### 数据分组

数组分组适用于数据具有一对多或多对多的关系，例如一个作者对应多本书籍，那么我们在查询数据时就可以按作者去分组。

在使用 DQL 查询语言 `GROUP BY` 时，需要明确一点的是，我们经过分组后的数据是保存在固定变量 `rows` 中的，这是一组数据，而非单一数据。例如在 `TABLE` 中没有分组时取文件链接是通过 ` file.link ` 来获取，经过分组后就需要使用 `rows.file.link ` 来取值了。需要注意的是 `rows` 是一个数组，我们可以使用 `rows[0]` 来获取分组数据的第一项，但是我们通常不会这样做。

#### 示例一：书籍按作者分组

````
%% 属性样例 %%
---
author: Conrad C
---

%% 查询 %%
```dataview
TABLE rows.file.link AS 书籍
FROM "10 Example Data/books"
GROUP BY author AS 作者
```
````

結果：

![[Pasted image 20240516114029.png]]

#### 示例二：书籍按类型分组

````
%% 属性样例 %%
---
genres:
- Romance
- Children
- Magic
---

%% 查询 %%
```dataview
TABLE rows.file.link AS 书籍
FROM "10 Example Data/books"
FLATTEN genres
GROUP BY genres AS 类别
```
````

结果：

![[Pasted image 20240516114930.png]]

>[!Tip] 这里需要注意的是 `FLATTEN` 语句很关键，如果不使用将会得到一个错误的结果。原因是在原始数据中每一本书可以对应多个类别，而在按类别查询分组后，结果变成多个类别对应一本书。因此我们需要把每个类别对应上同一本书来修正数据，这样再使用分组时就符合预期了。

下面是一个转换过程示例图解：

![[Pasted image 20240516115704.png]]

#### 示例三：根据计算结果分组

这里对任务的 `due` 进行分组，如果在 `2022-05-12` 前没有完成就视为过期。

````
%% 属性样例 %%
---
class: history
received: 2022-03-20
due: 2022-05-05
---

%% 查询 %%
```dataview
LIST rows.file.link
FROM "10 Example Data/assignments"
GROUP BY choice(due < date("2022-05-12"), "已过期", "还有机会")
```
````

结果：

![[Pasted image 20240516121939.png]]

#### 示例四：分组后的元数据

在分组章节提到了分组后的数据属性 `rows`，实际上使用 `GROUP BY` 语句后返回的是一个对象，类似于：

```ts
{
	key: groupName;
	rows: ArrayOfDataColumns
}
```

在使用时通常不会直接去显示获取 `key` 值，默认情况下 Dataview 会直接读取了这个字段的值作为分组名。

如【示例三】所示，可以使用 `choice()` 函数来执行条件判断，返回 2 个状态描述，如果我们将 `LIST rows.file.link` 改成 `LIST`，那么读取的就是 `key` 值，这个 `key` 值就是 `choice()` 函数执行后返回的两个状态描述文本。

在 `GROUP BY` 语句后面我们可以使用 `AS` 语句定义一个别名，例如：`statusText`，我们再次将列表查询语句修改成 `LIST statusText`，观察结果会发现会显示成类似 `- 还有机会: 还有机会`，这样的结果。这个时候 `statusText` 和 `key` 其实是同一个实体，如果只想显示一个分组名，或者不显示，可以使用 `LIST WITHOUT ID` 来达到目的。

进一步我们还可以在 `LIST` 语句中拼接文本（包含有效果 HTML 标签），比如给结果加上 `<kbd>` 标签：`LIST WITHOUT ID "<kbd>" + statusText + "</kbd>"`，有一点需要谨记的是不能在里面使用模板字符串。

有了上面提到的技巧，对于【示例三】的结果可以进一步改成 `LIST join(rows.file.link, " | ")` 来减少空间占用。

对于 `GROUP BY` 语句我们还可以不提供分组属性，而是提供一个文本，然后只针对 `rows` 进行处理，比如获取其长度 `length(rows)`，这实际上是将所有查询的数组归为一个组了。

````
```dataview
LIST length(rows)
FROM "10 Example Data/assignments"
GROUP BY "什么也不做"
```
````

结果：

![[Pasted image 20240516180032.png]]

现在我们来把【示例三】根据上面提及的一些知识点进行一次改造：

1. 在链接后显示 `due` 的具体日期值
2. 对结果进行合并，显示在一个列表中

````
```dataview
LIST join(map(rows.file, (f) => f.link + " " + f.frontmatter.due), ", ")
FROM "10 Example Data/assignments"
FLATTEN file.frontmatter.due AS path
GROUP BY choice(due < date("2022-05-12"), "已过期", "还有机会")
```
````

结果：

![[Pasted image 20240516182930.png]]

进一步我们可以使用 `FLATTEN` 语句改造实现同样的效果，可以不用 `map()` 函数，直接将需要格式化显示的结果作为 `rows` 分组后的数据的一个属性。

````
```dataview
LIST join(rows.desc, ", ")
FROM "10 Example Data/assignments"
FLATTEN file.link + " " + file.frontmatter.due AS desc
GROUP BY choice(due < date("2022-05-12"), "已过期", "还有机会")
```
````




`$= dv.date('now').toFormat("M'月'dd'号'")`

- `FLATTEN` 语句
- 数据分组
- 数据排序
- 定制 DQL 查询输出
- 在表格中显示图片
- 属性查询

## 中级篇：Dataview 进阶应用

- 进度条
- 标签云
- 计算周期
- 根据条件显示/隐藏结果
- 文字搜索
- 根据双链查询
- 日期和时间操作

## 高级篇：Dataview 高级技巧与探索

- 和 chart.js 结合
- 日历渲染

## 总结

## 参考
