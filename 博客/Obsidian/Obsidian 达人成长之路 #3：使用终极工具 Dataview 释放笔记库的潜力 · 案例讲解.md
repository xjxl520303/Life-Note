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

### `FLATTEN` 语句

`FLATTEN` 语句是 `GROUP UP` 的相反操作，但事实上它的作用不止这一点，它扮演了一个很重要的角色：声明新变量。

在介绍数据分组时有提及过 `FLATTEN` 语句的作用，现在我们再次以书籍数据为例子，将书籍的分类和话题查询出来：

````
```dataview
TABLE genres, booktopics
FROM "10 Example Data/books"
```
````

结果：

![[Pasted image 20240517160559.png]]

因为分类和话题其实是多对多的关系，因此我们可以使用 2 个 `FLATTEN` 语句对其展开成 1 维的数据列。

````
```dataview
TABLE genres, booktopics
FROM "10 Example Data/books"
FLATTEN genres
FLATTEN booktopics
LIMIT 4
```
````

结果：

![[Pasted image 20240517161616.png]]

##### 声明新属性

使用 `FLATTEN` 语句可以将数组展开成一维数组，但对于一个不能进行展开操作的数据类型如：数字、字符串、布尔值以及对象会原样输出。利用这一特点再结合 `AS` 语句可以声明属性并将 `FLATTEN` 后面的值赋值给指定的别名。

下面我们通过 `FLATTEN` 语句分别声明了一个字符串 `arr`，一个数字 `num` 和一个对象 `obj`，对象中包含一个数组 `[1, 2, 3]`，看一下结果如何：

````
```dataview
TABLE WITHOUT ID num, str, obj
FLATTEN 123 AS num
FLATTEN "hello" AS str
FLATTEN {"数字": num, "字符串": str, "数组": [1,2,3]} AS obj
WHERE file = this.file
```
````

结果：

![[Pasted image 20240517170018.png]]

现在我们再进行一点小改变，将数组 `[1, 2, 3]` 单独提取出来使用 `FLATTEN` 语句声明一个新的属性 `arr`，即：`FLATTEN [1, 2, 3] AS arr`，然后再将 `obj` 修改成：`FLATTEN {"数字": num, "字符串": str, "数组": arr} AS obj`，结果如下：

![[Pasted image 20240517170551.png]]

可以看到我们得到了一个完全不同的结果，这说明在使用 `FLATTEN` 语句声明数组时会影响结果的维数，我们可以大胆的猜测，假如使用 `FLATTEN` 语句声明 3 个 2 维数组，那么结果将产生 8 种结果：

![[Pasted image 20240517172832.png]]

#### 处理嵌套

**数据嵌套** 通常指的是在数据结构或数据模型中，一个数据元素内部包含另一个或多个相同或不同类型的数据元素。这种结构使得数据能够以层次化或树状的方式组织起来，从而更好地表示复杂的数据关系。

##### 对象嵌套对象

这种情况下，不需要额外的处理，使用和不适用 `FLATTEN` 语句效果是一样的。

````
%% 属性样例 %%
---
obj:
  obj1:
    obj2:
      prop1: 1
      prop2: 2
---

%% 查询 %%
```dataview
TABLE WITHOUT ID obj
WHERE file = this.file
FLATTEN obj
```
````

结果：

![[Pasted image 20240517152437.png]]

有了上面的知识，下面我们来分析一个查询书籍中阅读进度不足 50% 的案例：

````
```dataview
TABLE pagesRead, totalPages, percentage
FROM "10 Example Data/books"
FLATTEN round((pagesRead / totalPages) * 100) AS progress
WHERE progress < 50
FLATTEN progress + "%" AS percentage
```
````

结果：

![[Pasted image 20240517173908.png]]

分析：

1. 第一个 `FLATTEN` 语句用于计算阅读进度百分比。
2. `WHERE` 语句用于对进度进行条件限定。
3. 最后一个 `FLATTEN` 语句对结果进行美化。

##### 对象和数组嵌套

这种情况下，数组项为对象或者普通类型（字符串，数字和布尔值），在对象中属性也可能为数组，相互嵌套多次。

下面是一个数组中包含了 2 个对象和一个字符，对象的属性值为数组。可以看到使用 `FLATTEN` 语句后对象依然保持不变。

````
%% 属性样例 %%
---
arr2:
  - a1:
    - a2
    - a3
  - b1:
    - b2
    - b3
  - c1
---

%% 查询 %%
```dataview
TABLE WITHOUT ID arr2
WHERE file = this.file
FLATTEN arr2
```
````

结果：

![[Pasted image 20240517153559.png]]

##### 多维数组

这种情况下，数组内部嵌套数组，可能为 2 维（示例：`[[1,2], [3, 4]]`），3 维（示例：`[[[1,2,3], [4,5, 6], [7, 8, 9]]]`）甚至多维，但是 ` FLATTEN ` 语句只能处理 2 维数组，如果是多维的数据，需要结合 `flat(array, [depth])` 函数，通过指定 `depth` 来根据实际情况指定要处理的层级。


````
%% 属性样例 %%
---
arr3:
  -
    - a1
    - b1
  -
    - c1
    -
      - e1
      -
        - f1
---

%% 查询 %%
```dataview
TABLE WITHOUT ID flat(arr3, 2)
WHERE file = this.file
FLATTEN arr3
````

结果：

![[Pasted image 20240517154843.png]]

>[!Tip] 还有一种方法来实现多维数组展开，修改上面的示例，连续使用 4 次 `FLATTEN arr3`，得到一个展开的结果。这个结果并不能推断出原始数组是由几维展开的，在显示上也没有出现列表符号，读者可以根据需求灵活选用。

![[Pasted image 20240517164859.png]]

### 根据不同的条件来查询日记

在 Obsidian 中日记文件通常以 `xxxx-xx-xx` 的日期格式创建。我们可以通过 DQL 来精确查询完整年/月/日的日记，也可以查询指定年份、月份和具体某天的日记。下面我们以 10 Example Data/daily 中的日记数据 `wake-up` 为例。

>[!Tip] obsidian 为日记提供了一个专门的属性 `file.day` 来方便我们获取以日期表示的文件名。

#### 日期精确查询

要查询一个精确的日期，只需要使用表达式来判断两个 DateView 对象是否相等。在 DQL 查询语言中可以使用一个等号来判断相等，如果要查询多个日期也可以使用逻辑运算符 `OR` 来添加条件。

需要注意的是，在比较时需要将目标日期使用 `date()` 方法封装后才能进行比较，因为 `file.day` 是一个 DateView 对象，不能和字符串去比较，比如：`file.day = "2022-01-04"` 就是一个无效表达。

````
```dataview
LIST WITHOUT ID file.link + " 起床时间：" + wake-up
WHERE file.day = date(2022-01-04) OR file.day = date(2022-01-24)
```
````

结果：

![[Pasted image 20240527170356.png]]

#### 忽略年份/月份查询

有些情况下我们并不关心是哪一年、哪一个月的日记中所记载的事项，只想知道某个月的某一天或着每年每个月 17 号自己做了些什么。

>[!Tip] 如果使用 API 来查询的话还可以结合：[jjonline/calendar.js: 中国农历（阴阳历）和西元阳历即公历互转JavaScript库 (github.com)](https://github.com/jjonline/calendar.js) 来查询每年自己农历生日的日记信息。

要查询这样的数据，需要将日期使用 `dateformat()` 方法进行格式化后进行比较。

````
按月-日查询：

```dataview
LIST WITHOUT ID file.link + " 起床时间：" + wake-up
WHERE dateformat(file.day, "MM-dd") = "02-17"
```

按日查询：

```dataview
LIST WITHOUT ID file.link + " 起床时间：" + wake-up
WHERE dateformat(file.day, "dd") = "17"
```
````

结果：

![[Pasted image 20240527184049.png]]

第一个查询结果因为 2020 和 2021 年日记数据中没有内联字段 `wake-up`，所以没有数据。第二个查询前 2 个也是同样的原因，第 4 个结果我们可以看出，只要文件面中包含符合日期的格式就会被解析出来。

#### 根据日记中特定属性查询

上面 2 个示例中我们在查询结果中显示了内联属性 `wake-up`，会发现有的日记并没有定义这个属性，同时在已有的数据情况下，我们还可以进一步进行过滤，例如：起床时间在 6:00 ~ 6:30 的日期。

由于在 DQL 查询语言中我们无法将 `wake-up` 的值读取并传入 `date()` 函数，所以只能采取一种不友好的方式来实现：将时间按 `:` 拆分后单独判断。

>[!Tip] 我们无法将内联属性传 `date()` 函数，但是使用 `FLATTEN AS` 声明的日期、`file.day` 和 `file.frontmatter.xx` 的日期值还是可以传入正常解析的。

下面是两方式实现示例：

````
```dataview
LIST WITHOUT ID file.link + " 起床时间：" + wake-up
FROM "10 Example Data/dailys"
WHERE wake-up
FLATTEN number(split(wake-up, ":")[0]) AS hour
FLATTEN number(split(wake-up, ":")[1]) AS minute
WHERE hour = 6 AND minute <= 30
```

```dataviewjs
const dt = dv.luxon.DateTime

const start = dt.fromObject({ hour: 6, minute: 0 })
const end = dt.fromObject({ hour: 6, minute: 30 })

dv.list(
    dv.pages('"10 Example Data/dailys"')
        .where(p => p["wake-up"])
        .filter(p => {
            const time = dt.fromFormat(p["wake-up"], "HH:mm")
            return time >= start && time <= end
        })
        .map(p => `${p.file.link} 起床时间：${p["wake-up"]}`)
)
```
````

结果：

![[Pasted image 20240527200105.png]]

在处理时需要注意，在表示 6 点时，数据源中有少部分是 `6:xx` 其它为 `06:xx`。我们上面的代码中无须担心会被其影响，因为在使用 `number()` 方法时，`06` 会变成数字 `6`，而在脚本实现中 `dt.fromFormat()` 方法会自动处理。如果是字符串比较就需要慎重一些，将其考虑在内。
### 查询特定标题下的任务

创建一个页面，在页面中复制以下面容：

````
# title 1

- [ ] task 1
- list 1

## title 2

- [x] task 2
- [ ] task 2.1
- list 2

### title 3

- [ ] task 3
- list 3
````

现在我们来看如何在当前页面中查询标题 `title 2` 下的任务。

````
```dataview
TASK
WHERE file = this.file AND meta(section).subpath = "title 2"
```
````

结果：

![[Pasted image 20240528152438.png]]

>[!Tip] 我们在查询中使用的 `section` 属性只存在于 `TASK` 查询中，虽然在 Dataview 中任务也是一种列表项，内部使用了 `task` 属性是否为 `true` 来判断列表为任务。但是，需要注意的是换成 `LIST` 查询就会出现执行错误。

进一步，如果想判断任务是否完成，还可以结合 `completed` 和 `fullyCompleted` 属性来过滤任务：`WHERE file = this.file AND meta(section).subpath = "title 2" AND completed`。

接下来我们来使用 API 的方式同样实现任务的查询，但在这里我们有 3 种方式来实现。

1. 直接从 `file.tasks` 获取任务，以 `dv.taskList()` 输出。
2. 从 `file.lists` 获取列表，并通过 `task` 属性为 `true` 来判断任务，以 `dv.taskList()` 输出。
3. 接着第 2 种，但以 `dv.list()` 输出，同时模拟任务显示。

参考代码如下：

````
```dataview
TASK
WHERE file = this.file AND meta(section).subpath = "title 2"
```

```dataviewjs
dv.taskList(
    dv.current().file.tasks
        .where(t => t.section.subpath === "title 2")
)

dv.taskList(
    dv.current().file.lists
        .where(t => t.section.subpath === "title 2" && t.task)
)

dv.list(
    dv.current().file.lists
        .where(t => t.section.subpath === "title 2" && t.task)
        .map(t => `- [${t.checked ? "x" : " "}] ${t.text}`)
)
```
````

结果：

![[Pasted image 20240528155240.png]]

实现一、二都没有问题，优先采用实现一，第三种实现只是模拟，不能反向操作，对查询结果任务状态的改变不会反应到原任务。从结果截图中还可以看出第三种显示又是列表又是任务，两者叠加在一起了，其实我们可以换一种方式，使用 `dv.paragraph()` 来渲染，就会好看一点，就不具体展开了。

## 中级篇：Dataview 进阶应用

### 链接查询

Obsidian 作为双链笔记应用中的佼佼者，提供了强大的链接支持。而我们作为使用者，能够熟练掌握并应用链接，同时在 Dataview 中根据需求写出相应的查询语句或代码，更是如虎添翼。

链接在 Obsidian 中可以理解成一个文件（主要是指 Markdown 文件）的抽象，查询链接实际就是在查询一个文件名或者其内容。

如果初学读者没有阅读过系列文章前 2 篇，不了解 Obsidian 中的链接建议先去补充一下基础知识。这里我也简单汇总一下链接的知识点。

- 链接以 `[[xxx]]` 的语法引入文档中，如果在前面加感叹号，即：`![[xxx]]`，则表示将链接的内容嵌入文档中。
- 我们将当前文档引入的链接称之为**出链**（Outgoing links），如果有其它文档引用了当前文档，则将其它文档称之为**外链**（Backlinks）。
- 链接有 4 种方式：`[[xxx]]` | `[[xxx#x]` | `[[xxx#^x]` 和 `[[xxx#^x|x]`，分别表示链接到文档、标题、段落（又叫块）以及使用显示别名。

#### 查询不存在的引用链接

在 Obsidian 中使用 `[[xxx]]` 引用链接时，不一定要求链接指向的文件存在于库中，因此，会存在大量空链接。页面中引用的链接存放在 `file.outlinks` 属性中，我们可以读取其中的值来进一步判断链接是否存在。

````
```dataview
TABLE WITHOUT ID key AS "unresolved link", rows.file.link AS "referencing file"
FROM "10 Example Data"
FLATTEN file.outlinks as outlinks
WHERE !(outlinks.file) AND !(contains(meta(outlinks).path, "/"))
GROUP BY outlinks
```
````

上面代码 `!(outlinks.file)` 用于判断 `[[]]` 的情况，对于 `[[xxx]]` 通过 `meta()` 函数得到的链接描述信息中 `path` 值为 `xxx`，而有效的链接路径为：`xx/xx/xxx.md` 的形式，因此示例中判断路径是否包含 `/` 是可以排除这种无效链接的。

在 Dataview 提供的 API 中，我们使用 `dv.app.metadataCache` 来获取 Obsidian API 中链接文本对象，这个对象有两个属性，分别为：

- `resolvedLinks: Record<string, Record<string, number>>` 包含所有已解析的链接。
- `unresolvedLinks: Record<string, Record<string, number>>` 包含所有未解析的链接。

假如文档 `测试.md` 包含一个不存在的 `[[xxx]]` 链接，那么在 `unresolvedLinks` 中表示如下：

```json
{
	"测试.md": {
	    "xx": 1
	}
}
```

`xx` 代表链接名称，它的值是一个数字，表示在当前文档中出现的次数。

下面我们来遍历输出当前文档中不存在的链接：

```js
dv.list(Object.keys(dv.app.metadataCache.unresolvedLinks[dv.current().file.path]))
```

如果要查询库中所有不存在的链接，将遍历方式修改一下：

```js
dv.list(new Set(Object.values(dv.app.metadataCache.unresolvedLinks).flatMap(l => Object.keys(l)).sort()).values())
```

这里需要使用 `Set()` 来去重，因为同一个链接可能在不同的页面引用多次。

上面我们只是将仓库中所有不存在的链接遍历并以列表的形式显示出来了，现在我们进一步将每一个链接所包含的文件列举出来：

````
```dataviewjs
const unresolvedLinksMap = dv.app.metadataCache.unresolvedLinks

const res = {}
for (let page in unresolvedLinksMap) { // page 为文件路径
    const unresolved = Object.keys(unresolvedLinksMap[page])
    if (unresolved.length === 0) continue
    for (let link of unresolved) { // file 为链接名
        if (!res[link]) res[link] = {link, usages: []}
        res[link].usages.push(dv.fileLink(page))
    }
}

dv.table(["Unresolved Link", "Contained in"], Object.values(res).map(l => [dv.fileLink(l.link), l.usages]))
```
````

结果部分截图：

![[Pasted image 20240528190213.png]]

进一步阅读：[List non existing, linked pages - Dataview Example Vault (s-blu.github.io)](https://s-blu.github.io/obsidian_dataview_example_vault/20%20Dataview%20Queries/List%20non%20existing%2C%20linked%20pages/)

#### 查询所有未被使用的附件

在 Obsidian 中文档是以 Markdown 格式保存的，所以其它文档类型我们都可以视作附件。当然这也不是绝对的，如果安装的插件自带了特定格式的源文件我们不能将其作附件。

要获得所有文件列表，我们需要用到 `app.vault.getFiles()` 方法，并过滤掉所有 Markdown 文件得到附件列表。同时，查询所有文档中的外链，过滤掉指向 Markdown 文档的链接。如果非 Markdown 文档的链接列表中包含附件列表中的文件，则说明附件已使用。

注意：这里的 `app` 是一个全局属性，可以在 Dataviewjs 代码块直接访问。

````
```dataviewjs
const allNonMdFiles = app.vault.getFiles().filter(f => f.extension !== "md")
const allNonMdOutlinks = dv.pages().file.outlinks.path.filter(link => !link.endsWith(".md"))
const notReferenced = allNonMdFiles.filter(f => !allNonMdOutlinks.includes(f.path))
dv.list(dv.array(notReferenced).map(link => dv.fileLink(link.path)))
```
````

结果部分截图：

![[Pasted image 20240528194056.png]]

如果要指定多个非附件文档后缀，比如截图中的 `.loom` 文件后缀，可以将第一行代码中的过滤语句修改成：`['md', 'loom'].includes(file.extension)`。




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
