---
tags:
  - 博客
  - Obsidian
---
DataView 是 Obsidian 社区最受欢迎的插件之一，它提供了一个在知识库上实时索引和查询的引擎，我们通过在笔记中添加**属性**（Properties）或者称之**元数据**（Metadata）来为 DataView 查询语言提供检索数据来源，通过 Dataview 我们可以列出、筛选、排序和分组数据，类似于我使用数据库查询语言。

**注意**：这里我们以属性或元数据来描述文档中由官方提供、第三方插件提供或者自定义的描述变量，前者为 Obsidian 官方的叫法，后者为 Dataview 中的叫法，两者实际上为同一个实体，不同的概念，后续文章以属性来描述。

本文基于 Davaview 0.5.56 版本撰写，如果发现文章与官方内容有所出入，请以官方最新文档为参考。

## 快速入门

直接在官方插件搜索名称即可安装，然后在选项中将【Enable JavaScript Queries】 和【Enable Inline JavaScript Queries】开启，并将选项【Date Format】 设置为 `yyyy-MM-dd`，【Date + Time Format】设置为 `yyyy-MM-dd HH:MM:ss`，这样子更符合我们的使用习惯。

接下来我们在 Obsidian 中新建一个文档然后添加一个标签属性，使用快捷键 `CMD/CTRL+;` 来触发属性编辑。

```yaml
---
tags:
  - 博客
  - Obsidian
---
```

然后我们使用 Dataview 查询语言（DQL）在当前笔记中以列表的形式将标签属性读取出来：

````
```dataview
LIST tags
WHERE file = this.file
```
````

结果：

![[Pasted image 20240425121828.png]]

> 这里我们遵循官方的写法，将查询语法的关键词以大写方式表示。

然后, 我们再使用 Dataview JavaScript 查询方式来同样获取当前文档的标签：

````
```dataviewjs
dv.list(dv.pages("").file.tags.distinct())
```
````

结果：

![[企业微信截图_17140459602815.png]]

## YAML 简介

在介绍具体使用之前我们先来了解一下在 Obsidian 中描述属性的 **YAML** 语言。

YAML 其实更多时候是用于编写配置文件，其文件以 `.yml` 为后缀，它的语法简洁直观，比 JOSN 输入起来要快。如果熟悉 JSON 格式我们可以直接使用网站 [JSON to YAML Converter: Best Free Tool (jsonformatter.org)](https://jsonformatter.org/json-to-yaml) 将其转成 YAML 表示形式，看图就能直观掌握其写法。

![[Pasted image 20240425113911.png]]

关于 YAML 简单使用只需要记住：

- 用 `#` 表示注释。
- 用缩进表示层级关系，并且只能使用空格来缩进，同一层级在空格数量上需要保持一致。
- 变量是大小写敏感的。
- 数据使用 `变量名: 变量值` 的形式来表示数据。
- 使用 `|` 来保留数据的换行，每行的缩进和行尾空白都会被去掉，而额外的缩进会被保留。
- 使用 `>` 来表示折叠换行，只有空白行才识别为换行。
- 只使用 `true` 和 `false` 来表示布尔值。
- `null`、`Null` 和 `~` 以及不指定值默认都为空。

## 认识属性

Obsidian 官方为属性描述提供了 6 种数据类型：

- 文本（Text）：普通的文本以及笔记链接（示例：`link: "[[Link]]"`）文本。
- 列表（List）：包含多个普通文本的数组。
- 数字（Number）：包含整数，小数及负数。
- 布尔值（Checkbox）：要么是 `true` 或者 `false`，空值默认为 `false`。
- 日期（Date）和时间（Time）：以格式 `YYYY-MM[-DDTHH:mm:ss.nnn+ZZ]` 的形式表示，比如：`2024-04-25`。

Dataview 在则在此基础上额外提供了 2 种数据类型持续时间（`Duration` ）和对象（`Object`）。

持续时间的语法为 `<time> <unit>`，例如：`6 hours` 或者 `4 minutes`，下面是更多的表达场景：

```
Example:: 7 hours
Example:: 16days
Example:: 4min
Example:: 6hr7min
Example:: 9 years, 8 months, 4 days, 16 hours, 2 minutes
Example:: 9 yrs 8 min
```

> 注意：这些时间值是可以在代码中进行运算的，后面实例部分会讲解。

对象就是在一个父字段下多个字段的映射，只能定义在 YAML 中，例如：

```
---
obj:
  key1: "Val"
  key2: 3
  key3: 
    - "List1"
    - "List2"
    - "List3"
---
```

Dataview 提供了一种内联字段，让我们可以在笔记内容中任意位置定义数据，其语法为：`变量名:: 变量值`。

```
Basic Field:: Some random Value
**Bold Field**:: Nice!
带❤变量:: 我是表情+非拉丁字母
I would rate this a [rating:: 9]! It was [mood:: acceptable].
- [ ] Send an mail to David about the deadline [due:: 2022-04-05].
This will not show the (longKeyIDontNeedWhenReading:: key).

基础字段：`= this.basic-field`
加粗字段：`= this.bold-field`
在语句中：Rating: `= this.rating`, Mood: `= this.mood`
在任务列表中：`= this.due`
不显示变量名：`= this.longkeyidontneedwhenreading`
非常规变量：`= this.带❤变量`
```

结果：

![[Pasted image 20240425155428.png]]

注意如果内联字段独占一行可以不加 `[]`，如果在文本内部必须加上，此外可通过 `()` 来包裹内联字段可以在渲染时只显示值，不显示变量名。如果变量名使用空格来分隔的，在内部会被表示成小写字母+连字符的方式，驼峰命名会表示成全小写的（**实际运行发现并不能成功读取**）。

### 文档中的默认属性

Obsidian 中每个文档都有一系列默认的属性，最常见的就是 `tags`, `aliases` 和 `cssclasses`，分别表示页面的标签、别名和样式类名。此外，还有一些和发布相关的，暂时我们不关注，可自行查阅官方文档。

Dataview 为每个文档自动生成了一个 `file` 的属性，用于访问文件相关的信息。

| 文件属性           | 字段类型       | 属性说明                                                                                                           |
|:------------------ |:-------------- |:------------------------------------------------------------------------------------------------------------------ |
| `file.name`        | Text           | 文件名                                                                                                             |
| `file.folder`      | Text           | 所在文件夹                                                                                                         |
| `file.path`        | Text           | 文件路径（包含文件名）                                                                                             |
| `file.ext`         | Text           | 扩展名                                                                                                             |
| `file.link`        | Link           | 链接至本文件                                                                                                       |
| `file.size`        | Number         | 文件大小 (bytes)                                                                                                   |
| `file.ctime`       | Date with Time | 创建时间                                                                                                           |
| `file.cday`        | Date           | 创建日期                                                                                                           |
| `file.mtime`       | Date with Time | 最后修改时间                                                                                                       |
| `file.mday`        | Date           | 最后修改日期                                                                                                       |
| `file.tags`        | List           | 笔记中所有标签的数组。子标签按每个级别细分，因此 `#Tag/1/A`&nbsp;将存储在数组中，作为 `[#Tag, #Tag/1, #Tag/1/A]`。 |
| `file.etags`       | List           | 同上，但是只存储最终的 `[#Tag/1/A]`                                                                                |
| `file.inlinks`     | List           | 反向链接                                                                                                           |
| `file.outlinks`    | List           | 正向链接                                                                                                           |
| `file.tasks`       | List           | 文中的任务列表                                                                                                     |
| `file.lists`       | List           | 文中的列表 (包含任务列表)                                                                                          |
| `file.frontmatter` | List           | 文件中的 YAML 块内容                                                                                               |
| `file.day`         | Date           | 如果文件名使用日期定义（格式为 `yyyy-mm-dd`&nbsp;或者 `yyymmdd`），则返回其日期值。                                |
| `file.starred`     | Boolean        | 是否使用核心插件 "Bookmarks"&nbsp;标记过。                                                                         |

示例：

````
```dataview
TABLE file.name AS 文件名, file.ctime AS 创建时间, file.mtime AS 修改时间, file.tags AS 标签
WHERE file = this.file
```
````

结果：

![[Pasted image 20240425180855.png]]

### 任务相关属性

使用 `TASK` 查询类型，我们可以查询所有文档中的任务（又叫待办事项）。下面我们创建几个不同类型的任务，并使用内联属性指定创建日期（`created`），开始日期（`start`），计划日期 （`scheduled`），截止日期（`due`），取消日期（`cancelled`）和完成日期（` completion `）几个属性。

```
- [ ] 任务创建 [created:: 2024-04-25]
- [ ] 任务开始 [start:: 2024-04-26]
- [ ] 任务开始2 [start:: 2024-04-22]
- [x] 任务完成
	- [x] 子任务完成 1 
	- [ ] 子任务未完成 1
	- [x] 子任务完成 2 [completion:: 2024-04-28]
- [x] 任务全部完成
	- [x] 完成 1
	- [x] 完成 2
```

下面我们来查询任务开始日期为 `2024-04-22` 的任务：

````
```dataview
TASK
WHERE start = date("2024-04-22")
```
````

结果：

![[Pasted image 20240425191442.png]]

其它几个属性也可以使用类似的方法来判断，这里就不举例了，然后我们接下来使用 Dataview 提供的任务相关的属性 `completed` 和 `fullyCompleted` 来过滤任务，两者的区别请参考后续表格。

````
```dataview
TASK
WHERE completed
```
````

`completed` 过滤结果：

![[Pasted image 20240425192540.png]]


````
```dataview
TASK
WHERE fullyCompleted
```
````

`fullyCompleted` 过滤结果：

![[Pasted image 20240425193026.png]]

下面给出 Dataview 为列表和任务提供的内置属性，更多操作参考后面的综合实例部分。

| 字段名           | 数据类型 | 描述                                                                                                              |
|:---------------- |:-------- |:----------------------------------------------------------------------------------------------------------------- |
| `status`         | Text     | 返回完成状态文本（`[]`中的文本）`" "`&nbsp;表示未完成，`[x]`&nbsp;表示已完成，也支持自定状态来替代默认的。        |
| `checked`        | Boolean  | 用于判断当前状态是否为空，也就是说 `[]`&nbsp;中有内容，但不一定是 `x`，也排除 `[ ]`                               |
| `completed`      | Boolean  | 判断任务是否完成，不要求所有子任务都完成，如果使用非 `[x]`&nbsp;来标记完成，例如 `[-]` ，那么不会被包含在结果中。 |
| `fullyCompleted` | Boolean  | 同上，但要求所有子任务完成才算完成。                                                                              |
| `text`           | Text     | 任务的纯文本，包含属性和批注。                                                                                    |
| `visual`         | Text     | 由 Dataview&nbsp;渲染出的任务文本，可以使用 Dataviewjs&nbsp;来覆盖实现自定义渲染效果，同时保留验证逻辑的正确性。  |
| `line`           | Number   | 任务在文档中所在的行数。                                                                                          |
| `lineCount`      | Number   | 任务占据的行数，包含子任务的任务会占用多行。                                                                      |
| `path`           | Text     | 任务所在的文档路径。                                                                                              |
| `section`        | Link     | 任务所在章节链接。                                                                                                |
| `tags`           | List     | 任务中包含的标签。                                                                                                |
| `outlinks`       | Link     | 任务中定义的任何链接。                                                                                            |
| `link`           | Link     | 指向任务最近可被链接的区域的链接，对于通过链接指向到当前任务十分有用。                                            |
| `children`       | List     | 当前任务的子任务列表。                                                                                            |
| `task`           | Boolean  | 通过这个属性来判断当前项是否为任务。                                                                              |
| `annotated`      | Boolean  | 用于判断当前任务项是否包含属性。                                                                                  |
| `parent`         | Number   | 用于获取子任务的父任务所在行号，如果当前任务为根任务则为空值。                                                    |
| `blockId`        | Text     | 如果使用 `^blockId`&nbsp;语法定义了块ID，则返回其对应的任务或者列表。                                             |

### Tasks 插件提供的属性

[obsidian-tasks](https://github.com/obsidian-tasks-group/obsidian-tasks) 是综合管理任务的第三方插件，后续文章会专门探讨，现在我们只需要关注它提供的任务分类状态表情速记符（emoji-shorthands），让我们不用自己来使用内联属性定义任务状态，它直接开箱即用提供了以下几种速记语法：

| 属性名       | 速记语法       | 解释     |
|:------------ |:-------------- |:-------- |
| `due`        | `🗓️YYYY-MM-DD` | 截止日期 |
| `completion` | `✅YYYY-MM-DD` | 完成日期 |
| `created`    | `➕YYYY-MM-DD` | 创建日期 |
| `start`      | `🛫YYYY-MM-DD` | 开始日期 |
| `scheduled`  | `⏳YYYY-MM-DD` | 计划日期 |

除此之外，还有优先级等速记符，这里不再展开。

我们下载插件后，使用 【Ctrl/CMD + P】打开命令面板，然后输入命令 `Tasks: Create or edit`，会弹出一个对话框让你输入任务描述，优先级，是否循环等，下面是我创建的 3 个任务：

```
- [ ] 早上跑步 🔁 every day ➕ 2024-04-26 🛫 2024-04-27 📅 2024-04-27
- [x] 早上跑步 🔁 every day ➕ 2024-04-26 🛫 2024-04-26 📅 2024-04-26 ✅ 2024-04-26
- [ ] 看书 ➕ 2024-04-26
- [ ] 上班 ⏫ ➕ 2024-04-26 🛫 2024-04-26 📅 2024-04-26
```

现在我们来查询当前文档中 4 月 26 日完成的任务：

````
```dataview
TASK
WHERE completion = date("2024-04-26") AND file = this.file
```
````

结果：

![[企业微信截图_17141199186147.png]]

## 数据查询方式

上一章节我们了解了如何使用 YAML 和内联属性来定义属性，现在我们来看一下 Dataview 中如何查询这些属性。

### DQL 查询语言

Dataview 查询语言（Dataview Query Language 简称 **DQL**）类似于数据库查询语言，它支持 4 种查询类型（`TABLE` / `LIST` / `TASK` / `CALENDAR`）来生成不同的输出，例如对结果进行选择、优化和分组，得到你想要的结果。

要使用 DQL，只需要在文档中的代码块中将类型指定为 `dataview` 并加上查询代码即可：

````
```dataview
TABLE rating AS "Rating", summary AS "Summary" FROM #games
SORT rating DESC
```
````

### 内联 DQL 查询

这种方式使用内联块格式（而不是代码块）和可配置的前缀来将内联代码块标记为 DQL 块，语法如下：

```
`= <变量名>`
```

>注意：这里的 `=` 是可以在 DataView 选项中指定为其它符号的，例如：`dv:` 或者 `~`，但通常我们保持默认。

我们可以在文档中任意位置插入内联 DQL：

```
今天是：`= date(today)` 我还有 < `= [[打造极致体验笔记：Obsidian Meta Bind 插件使用]].file.name` > 计划要去写！
```

结果：

```
今天是：2024-04-26 我还有 <打造极致体验笔记：Obsidian Meta Bind 插件使用> 计划要去写！
```

> 注意：DataView 提供的各种函数我们同样也可以在内联 DQL 中使用，后续会介绍各种函数的使用。

### 使用 Dataview JS 查询

使用 DataView 提供的 JavaScript API 可以实现复杂的功能，结合 Obsidian 的 API 一起使用可以极大的发挥创造性。

在使用时只需要将代码块的类型设置为 `dataviewjs` 即可：

````
```dataviewjs
let currentFilename = dv.current().file.name
dv.list([currentFilename])
```
````

上面的示例直接将当前文档的文件名作为列表查询结果显示。

### 使用内联 Dataview JS 查询

内联 JavaScript 的写法如下，同样也可以通过选项来更改语法前缀为 `dvjs:` 或 `$~`。

```
`$= dv.current().file.name`
```

## DQL 查询语言详解

现在开始我们将深入了解 DQL 查询语言的一切，从小白到熟练工转变。

### 语法结构

DQL 查询语言的语法定义如下：

````
```dataview
<QUERY-TYPE> <WITHOUT ID> <fields>
<FROM> <source>
<WHERE> <condition>
<SORT> <field> <direction>
<GROUP-BY> <rule>
<LIMIT> <count>
<FLATTEN> <condition>
```
````

#### `<QUERY_TYPE>`

 `<QUERY-TYPE>` 表示查询类型，官方提供了 4 种类型：

- `TABLE`: 以表格方式显示结果。
- `LIST`: 以列表方式显示结果。
- `TASK`: 显示满足过滤条件的交互式任务（对过滤结果的操作状态会同步到原始文档中对应的任务）。
- `CALENDAR`：在日历中对应的日期中标记点。

#### `<WITHOUT ID>`

`<WITHOUT ID>` 用于 `LIST` 类型中，表示在查询的结果中不显示文件名和分组键值。

![[Pasted image 20240426192402.png]]

`<WITHOUT ID>` 用于 `TABLE` 类型中，表示在查询的结果中不显示第一列文件名。

![[Pasted image 20240426193451.png]]

#### `<FROM>`

`<FROM>` 表示查询来源，如果不指定将查询当前笔记仓库中的所有笔记。

如果在当前文件中进行查询，可以将 `<FROM>` 来源指定为当前文档的路径：

````
```dataview
TABLE file.name, file.ctime
FROM "博客/Obsidian/打造极致体验笔记：Obsidian Dataview 插件使用"
```
````

上面我们从指定的文档获取数据源，当然也可以指定目录，例如：`FROM "博客/Obsidian"`。此外，也可以指定标签，再结合运算符来过滤数据源，例如：`FROM #博客 AND "Go"`，结果为博客中 Go 目录下的所有文件。

#### `<WHERE>`

`<WHERE>` 用于过滤数据，我们在这里指定条件表达式来

```dataview
TABLE file.name, file.ctime
FROM "博客/Obsidian"
```



## 综合实例



## 参考

- [Dataview (blacksmithgu.github.io)](https://blacksmithgu.github.io/obsidian-dataview/)
- [Properties - Obsidian Help](https://help.obsidian.md/Editing+and+formatting/Properties)
- [Obsidian 插件之 Dataview - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/373623264)
- [Obsidian DataView 入门保姆级引导手册 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/614881764)
- [一文看懂 YAML - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/145173920)
- [obsidian插件dataview官方文档翻译 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/393550306)
- [Dataview综合文档 | obsidian文档咖啡豆版](https://obsidian.vip/zh/dataview/)
- [Dataviewjs的奇技淫巧 - 经验分享 - Obsidian 中文论坛](https://forum-zh.obsidian.md/t/topic/5954)