Dataview 提供的 DQL 查询语言为不同背景和需求的用户带来了便利，特别是对于那些不擅长或不愿意深入学习复杂编程语言的用户降低了使用门槛，让其数据查询和管理更多直观和易于上手。

然而，用户的群体是多种多样的，不同的用户对体验的要求是不尽相同的。这种多样性体现在对编辑器或工具的选择上，还体现在对数据查询和管理的个性化需求上。就拿代码编辑器来举例，有些用户倾向于使用功能丰富、界面友好的集成开发环境（IDE）；有的用户则更喜欢轻便、快捷的文本编辑器；还有一部分极客喜欢 DIY 神器 Vim。

在这方面，Dataview 的优势在于其灵活性和可扩展性。与其说 Dataview 提供了 2 种方式来满足不同用户的需求，不如说它为用户提供了一个开放平台，让用户可以根据自己的喜欢和需求来定制和优化自己的查询结果。

这是《Obsidian 达人成长之路》系列的第 2 篇，专注于 Dataview JavaScript API 的使用，这对于希望充分利用 Obsidian 笔记工具高级功能的用户来说是非常有价值的。

## 快速入门

在编程的世界中，有一个广泛接受的传统，那就是使用“Hello World”作为学习新编程语言时的第一个示例程序，本文也不例外。

任意新建一个文档将下面的内容复制粘贴并运行。

````
greet:: Hello World!

- [ ] `= this.greet`

```dataviewjs
const page = dv.current()
const inlineGreet = page["greet"]

console.log(inlineGreet)
dv.header(2, inlineGreet)
dv.list([inlineGreet])
dv.el("span", `- [ ] ${inlineGreet}`)
dv.taskList(page.file.tasks)
dv.table(["问候"], [[inlineGreet]])
```
````

结果：

![[Pasted image 20240511112532.png]]

下面我们来分析一下上述示例：

首先，我们在文档中创建了一个内联属性 `greet`，然后创建了一个任务并通过内联 DQL 查询出 `greet` 属性并作为任务的名称。

接下来，我们通过调用 `dv.current()` 函数获取脚本当前正在执行的页面的页面信息，这相当于调用 `dv.page("当前文档名")` 函数。然后赋值给常量 `page`，紧接着读取了页面中的内联属性 `greet` 并赋值给常量 `inlineGreet`。

第一个输出使用浏览器的控制台作为载体，通过调用 JavaScript 的 `console.log()` 函数来实现。如果你不知道怎么显示开发者工具，1）在 Windows 或 Linux 下可以使用快捷键 <kbd>Ctrl+Shift+I</kbd>；2）macOS 请使用<kbd>Cmd+Opt+I</kbd>。

接下来我们分别使用了 `div.header(2, inlineGreet)` 函数来将问候输出为二级标题；使用 `dv.list([inlineGreet])` 将其输出为列表元素；使用 `dv.el("span", ...)` 函数来将其输出为任务（这里只是为了演示，通常我们是从文档中获取任务）；使用 `dv.taskList(page.file.tasks)` 函数将页面中的任务查询出来；最后使用 `dv.table(["问候"], [[inlineGreet]])` 函数将其输出为表格显示。

## `DataArray` 接口介绍

`DataArray` 接口是 Dataview 提供的列表数据操作的抽象，它是对 JavaScript 数组操作的扩展和基于 Dataview 环境的本地化。我们可过 `dv.array()` 将一个普通的数组转换成 `DataArray` 类型，也可以反向操作将其转换成普通的 JavaScript 数组，比如：`dv.list(dv.current()).array()`。

下面是官方提供的 `DataArray` 接口定义，为了简少行数，删除了所有注释：

```ts
export type ArrayFunc<T, O> = (elem: T, index: number, arr: T[]) => O;
export type ArrayComparator<T> = (a: T, b: T) => number;
export interface DataArray<T> {
    length: number;
    where(predicate: ArrayFunc<T, boolean>): DataArray<T>;
    filter(predicate: ArrayFunc<T, boolean>): DataArray<T>;
    map<U>(f: ArrayFunc<T, U>): DataArray<U>;
    flatMap<U>(f: ArrayFunc<T, U[]>): DataArray<U>;
    mutate(f: ArrayFunc<T, any>): DataArray<any>;
    limit(count: number): DataArray<T>;
    slice(start?: number, end?: number): DataArray<T>;
    concat(other: Iterable<T>): DataArray<T>;
    indexOf(element: T, fromIndex?: number): number;
    find(pred: ArrayFunc<T, boolean>): T | undefined;
    findIndex(pred: ArrayFunc<T, boolean>, fromIndex?: number): number;
    includes(element: T): boolean;
    join(sep?: string): string;
    sort<U>(key: ArrayFunc<T, U>, direction?: "asc" | "desc", comparator?: ArrayComparator<U>): DataArray<T>;
    groupBy<U>(key: ArrayFunc<T, U>, comparator?: ArrayComparator<U>): DataArray<{ key: U; rows: DataArray<T> }>;
    distinct<U>(key?: ArrayFunc<T, U>, comparator?: ArrayComparator<U>): DataArray<T>;
    every(f: ArrayFunc<T, boolean>): boolean;
    some(f: ArrayFunc<T, boolean>): boolean;
    none(f: ArrayFunc<T, boolean>): boolean;
    first(): T;
    last(): T;
    to(key: string): DataArray<any>;
    expand(key: string): DataArray<any>;
    forEach(f: ArrayFunc<T, void>): void;
    array(): T[];
    [Symbol.iterator](): Iterator<T>;
    [index: number]: any;
    [field: string]: any;
}
```

接下来我们将分类介绍接口中的属性和方法的用法。

### 数据读取

一个数组通过索引来获取其对应的数据项的值是一个很常规的操作。这里我们有一个数组 `arr`，那么就可以通过 `arr[0]` 和 `arr[arr.length - 1]` 来分别读取第一项和最后一项的值，这对应 `DataArray` 中的 `first()` 和 `last()` 方法。如果数组项是一个对象值，那么我们想要获取读取对象中某个字段的值，就需要使用遍历方法，比如 `for` 语句，或者数组的 `forEach()` 方法，为了方便操作，`DataArray` 接口直接提供了一个通过属性来获取数组中对象值的方法 `to()`，也可以在 ` DataArray ` 实例中直接访问这个属性名。

````
```dataviewjs
const arr = [1, 2, 3]
const arr2 = [{name: 'jenemy', age: 34}, {name: 'xiaolu', age: 33}, {name: 'lulu', age: 25 }]

const dvArr = dv.array(arr)
const dvObjArr = dv.array(arr2)

console.log(dvArr.length) // 3
console.log(dvArr.first(), dvArr.last()) // 1 3
console.log(dvArr[0], dvArr[dvArr.length - 1]) // 1 3

console.log(dvObjArr.name.array()) // ['jenemy', 'xiaolu', 'lulu']
console.log(dvObjArr['name'].array()) // ['jenemy', 'xiaolu', 'lulu']
console.log(dvObjArr.to('name').array()) // ['jenemy', 'xiaolu', 'lulu']
console.log(dvObjArr[0]) // {name: 'jenemy', age: 34}

// 通过遍历获取属性值
for (p of dvObjArr) {
console.log(p.name) // jenemy, xiaolu, lulu
}

// 使用 `.forEach()` 遍历
dvObjArr.forEach(p => console.log(p.name)) // jenemy, xiaolu, lulu
```
````

- 获取当前文档内容
- 显示列表、任务
- 获取当前文档中的 YAML 属性、内联字段属性、任务中的属性
- 列表的遍历
- 插入 HTML
- 加载 HTML 和 CSS 文件


使用 `dv.array(<array>)` 将普通的 JavaScript 数组转换成 Dataview 列表。

使用 `DataArray#array()` 将 Dataview 列表转成普通的 JavaScript 数组。



TODO:

- [ ] 如何读取 yaml 中的 JSON 属性

## Luxon 库介绍

Luxon 是一个完整的日期与时间处理库，它提供了 ISO 8601 规范的解析、格式化、本地化以及日期与时间运算等功能。在 Dataview 中我们使用 `dv.luxon` 来获取 Luxon 实例。

Luxon 提供了以下几个操作类：

- `DateTime`: 表示特定的毫秒时间，以及时区和区域设置。
- `Duration`: 表示时间量，例如：“1 小时 5 分钟”。
- `FixedOffsetZone`: 表示任何永不改变偏移的区域，例如 UTC。
- `IANAZone`: 通过 IANA 字符串来标识区域，例如：“Asia/Shanghai”。
- `Info`: 包含用于检索与常规时间和日期相关的数据的静态方法。例如，它具有用于查找时区是否具有 DST、列出任何受支持区域设置中的月份的方法，以及用于发现当前环境中可用的 Luxon 功能。
- `Interval`: 表示半开的时间间隔，其中每个终结点都是一个 `DateTime`。
- `InvalidZone`: 表示解析失败的区域。
- `Settings`: 设置包含控制 Luxon 整体行为的静态 getter 和 setter。
- `SystemZone`: 表示当前 JavaScript 运行环境的本地区域。
- `Zone`: 表示区域。

在 Dataview 中我们只关心如何使用 `DateTime` 和 `Duration` 这 2 个类。因为文章主要但要 Dataview 的使用，所以只会介绍 Luxon 的常用功能。

接下来文章中使用的 `DateTime` 均指代 `dv.luxon.DateTime`，`Duration` 同样如此。

>![Note] 这部分但介绍的内容有点多，实际在 Dataview 中我们可能并不会涉及到所有这些知识。

### `DateTime` 使用

`DateTime` 是一种不可变的数据结构，表示特定的日期和时间以及附带的方法。它包含用于创建、分析、查询、转换和格式化的类和实例方法。

#### 创建日期和时间

Luxon 提供了多种方式来创建和获取日期和时间。

- `DateTime.now()`  方法在系统的时区中为当前时刻创建 `DateTime`。
- 使用 `DateTime.local(year?, month, day, hour, minute, second, millisecond)` 创建。
- 使用 `DateTime.utc(year?, month, day, hour, minute, second, millisecond)` 创建。
- 从 JavaScript 日期对象去解析（`DateTime.fromJSDate(date, options)`）。
- 从 ISO 8601 解析（`DateTime.fromISO(test, opts)`）。
- 从时间缀去解析（`DateTime.fromMillis(milliseconds, options)` 和 `DateTime.fromSeconds(seconds, options)`）。
- 从 JavaScript 对像创建（`DateTime.fromObject(obj, opts)`）。
- 从字符串中以特定格式去解析（`DateTime.fromFormat(text, fmt, opts)`）。

````
```dataviewjs
const dt = dv.luxon.DateTime
const print = date => console.log(date.toFormat('yyyy-MM-dd HH:mm:ss'))

print(dt.now()) // 2024-05-06 17:08:32

print(dt.local(2023, 8, 20)) // 2023-08-20 00:00:00
print(dt.local(2023, 8, 20, 8, 45, 0)) // 2023-08-20 00:00:00
console.log(dt.local(2017, 3, 12, { locale: "fr" }).toLocaleString(DateTime.DATE_FULL)) // 12 mars 2017
console.log(dt.local(2017, 3, 12, { zone: 'America/New_York' }).toFormat('FFFF')) // 2017年3月12日星期日 北美东部标准时间 0:00:00

print(dt.utc(2023, 8, 20, 8, 45, 22)) // 2023-08-20 08:45:22

print(dt.fromObject({ year: 2023, month: 8, day: 20, hour: 8, minute: 45, second: 23})) // 2023-08-20 08:45:23
print(dt.fromJSDate(new Date())) // 2024-05-06 17:35:58
print(dt.fromMillis(1714983450291)) // 2024-05-06 16:17:30
print(dt.fromSeconds(1646710400)) // 2022-03-08 11:33:20

print(dt.fromISO('2023-08-20')) // 2023-08-20 00:00:00
print(dt.fromISO('2023-08-20T08:23:23')) // 2023-08-20 08:23:23
print(dt.fromISO('2024-01-11T10:30:25+03:00')) // 2024-01-11 15:30:25
print(dt.fromISO('2023-W34-2T04:04:04')) // 2023-08-22 04:04:04

print(dt.fromFormat('12/17/2025', 'MM/dd/yyyy')) // 2025-12-17 00:00:00
print(dt.fromFormat('May 25, 1982', 'MMMM dd, yyyy')) // 1982-05-25 00:00:00
```
````

#### 输出时期和时间

将一个 `DateTime` 对象解析成易于读取的方式，我们可以选择使用 `toFromat()` 函数来使用格式字符显示表示一个日期和时间，也可以使用特定格式规范表示的输出函数如：`toJSDate()`，`toISO()`，`toISODate()`，`toRFC2822()` 等，也可以单独获取年、月、日、时、分、钞、季度和周信息，例如：`dt.now().year`。

##### 获取 `DateTime` 对象属性

一个日期和时间通常可以解读为年、月、日、时、分、秒、毫秒、区域、季度、周等，下面我们通过实例来快速一阅。

````
```dataviewjs
const dt = dv.luxon.DateTime
console.log(dt.now().get("year")) // 2024
console.log(dt.now().locale) // zh-CN
console.log(dt.now().zone.ianaName) // Asia/Shanghai
console.log(dt.now().zone.name) // Asia/Shanghai
console.log(dt.now().zoneName) // zh-CN
console.log(dt.now().year) // 2024
console.log(dt.now().quarter) // 2
console.log(dt.now().month) // 5
console.log(dt.now().day) // 7
console.log(dt.now().hour) // 15
console.log(dt.now().minute) // 24
console.log(dt.now().second) // 1
console.log(dt.now().millisecond) // 661
console.log(dt.now().weekYear) // 2024
console.log(dt.now().weekNumber) // 19
console.log(dt.now().weekday) // 2
console.log(dt.now().ordinal) // 128
console.log(dt.now().monthShort) // 5月
console.log(dt.now().monthLong) // 五月
console.log(dt.now().offset) // 480
console.log(dt.now().offsetNameShort) // GMT+8
console.log(dt.now().offsetNameLong) // 中国标准时间
console.log(dt.now().isOffsetFixed) // false
console.log(dt.now().isInDST) // false
console.log(dt.now().isInLeapYear) // true
console.log(dt.now().daysInYear) // 366
console.log(dt.now().weeksInWeekYear) // 52
console.log(dt.now().resolvedLocaleOptions()) // {locale: 'zh-CN', numberingSystem: 'latn', outputCalendar: 'gregory'}
```
````

##### `toFormat(fmt, opts)` 函数

使用格式字符（又叫令牌（Token））来格式化日期和时间是比较常用的一种方式，通常我们使用 `yyyy-MM-dd HH:mm:ss` 来显示日期和时间，下面是一些简单使用举例：

````
```dataviewjs
const dt = dv.luxon.DateTime
console.log(dt.now().toFormat('yyyy-MM-dd HH:mm:ss')) // 2024-05-06 14:55:23
console.log(dt.now().toFormat('MMMM dd, yyyy')) // May 06, 2024
console.log(dt.now().setLocale('fr').toFormat('MMMM dd, yyyy')) // mai 06, 2024
console.log('IANA区域:', dt.now().toFormat('z')) // IANA区域：Asia/Shanghai
console.log('周数:', dt.now().toFormat('WW'), '周') // 周数: 19 周
console.log('一年中的第:', dt.now().toFormat('ooo'), '天') // 一年中的第: 127 天
console.log('包含完整月份和工作日的本地化日期:', dt.now().toFormat('DDDD')) // 包含完整月份和工作日的本地化日期 2024年5月6日星期一
console.log('带秒和完整偏移的本地时间:', dt.now().toFormat('tttt')) // 带秒和完整偏移的本地时间: 中国标准时间 19:02:48
console.log('额外详细的本地化日期和时间（以秒为单位）:', dt.now().toFormat('FFFF')) // 额外详细的本地化日期和时间（以秒为单位）: 2024年5月6日星期一 中国标准时间 19:04:22
console.log('unix 时间戳（以秒为单位）:', dt.now().toFormat('X')) // unix 时间戳（以秒为单位）: 1714993513
console.log('unix 时间戳（以毫秒为单位）:', dt.now().toFormat('x')) // unix 时间戳（以毫秒为单位）: 1714993520929
```
````

更多格式化符号请参考：[Formatting (moment.github.io)](https://moment.github.io/luxon/#/formatting?id=table-of-tokens)

在格式化时 Luxon 还提供了一种在双引号中使用单引号进行字符串转义的使用方式，举例如下：

````
```dataviewjs
const dt = dv.luxon.DateTime
console.log(dt.now().toFormat("HH 'hours' mm 'minutes'")) // 12 hours 08 minutes
console.log(dt.now().toFormat("'现在是：'HH'点'mm'分'")) // 现在是：13点18分
```
````

##### `toLocaleString(formatOpts, opts)` 函数

返回表示此日期的本地化字符串。接受与 `Intl.DateTimeFormat` 构造函数相同的选项以及 Luxon 定义的任何预设，如 `DateTime.DATE_FULL` 或 `DateTime.TIME_SIMPLE`。

下面是官方提供的预设在作者本地环境输出示例：

````
```dataviewjs
const dt = dv.luxon.DateTime

console.log(dt.now().toRFC2822())
console.log(dt.now().toLocaleString(dt.DATE_SHORT)) // 2024/5/6
console.log(dt.now().toLocaleString(dt.DATE_MED)) // 2024年5月6日
console.log(dt.now().toLocaleString(dt.DATE_MED_WITH_WEEKDAY)) // 2024年5月6日周一
console.log(dt.now().toLocaleString(dt.DATE_FULL)) // 2024年5月6日一
console.log(dt.now().toLocaleString(dt.DATE_HUGE)) // 2024年5月6日星期一
console.log(dt.now().toLocaleString(dt.TIME_SIMPLE)) // 19:21
console.log(dt.now().toLocaleString(dt.TIME_WITH_SECONDS)) // 19:21:47
console.log(dt.now().toLocaleString(dt.TIME_WITH_SHORT_OFFSET)) // GMT+8 19:22:05
console.log(dt.now().toLocaleString(dt.TIME_WITH_LONG_OFFSET)) // 中国标准时间 19:22:20
console.log(dt.now().toLocaleString(dt.TIME_24_SIMPLE)) // 19:22
console.log(dt.now().toLocaleString(dt.TIME_24_WITH_SECONDS)) // 19:23:03
console.log(dt.now().toLocaleString(dt.TIME_24_WITH_SHORT_OFFSET)) // GMT+8 19:23:50
console.log(dt.now().toLocaleString(dt.TIME_24_WITH_LONG_OFFSET)) // 中国标准时间 19:24:01
console.log(dt.now().toLocaleString(dt.DATETIME_SHORT)) // 2024/5/6 19:24
console.log(dt.now().toLocaleString(dt.DATETIME_MED)) // 2024年5月6日 19:25
console.log(dt.now().toLocaleString(dt.DATETIME_MED_WITH_WEEKDAY)) // 2024年5月6日周一 19:25
console.log(dt.now().toLocaleString(dt.DATETIME_FULL)) // 2024年5月6日 GMT+8 19:25
console.log(dt.now().toLocaleString(dt.DATETIME_HUGE)) // 2024年5月6日星期一 中国标准时间 19:26
console.log(dt.now().toLocaleString(dt.DATETIME_SHORT_WITH_SECONDS)) // 2024/5/6 19:26:30
console.log(dt.now().toLocaleString(dt.DATETIME_MED_WITH_SECONDS)) // 2024年5月6日 19:27:23
console.log(dt.now().toLocaleString(dt.DATETIME_FULL_WITH_SECONDS)) // 2024年5月6日 GMT+8 19:27:09
console.log(dt.now().toLocaleString(dt.DATETIME_HUGE_WITH_SECONDS)) // 2024年5月6日星期一 中国标准时间 19:26:57
```
````

除了显示本地环境输出外，我们也可以通过调用 `setLocale()` 函数来指定其它语言输出环境：

```
console.log(dt.now().setLocale('fr').toLocaleString(DateTime.DATE_FULL)) // 7 mai 2024
```

`Intl` 对象是 ECMAScript 国际化 API 的命名空间，它提供对语言敏感的字符串比较、支持数字格式化以及日期和时间的格式化。下面我们使用 `Intl.DateTimeFormat` 相同的选项来格式化日期和时间：

````
```dataviewjs
console.log(dt.now().toLocaleString({
	year: 'numeric',
	weekday: 'long',
	month: 'long',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
	hour12: true
})) // 2024年5月06日星期一 下午08:23:52

console.log(dt.now().toLocaleString({
	year: '2-digit',
	weekday: 'short',
})) // 24年 周一
```
````

从上面的示例中可以看出在格式化日期和时间相关的数据时，有 `full` / `long` / `medium` / `short` / `2-digit` / `numeric` 这几种样式选项，下面通过一个表格来更好的演示几种样式的不同：

|   日期和时期属性       |   `full`    |   `long`    |   `medium`    |  `short`   |   `2-digit`    |  `numeric`       |
|:--------------|:------------|:------------|:--------------|:-----------|:---------------|:-----------------|
|  年（`year`）    |  -          |  -          |  -            |  -         |  24年           |  2024年           |
|  月（`month`）   |  -          |  五月         |  -            |        5月  |           05月  |              5月  |
|  日（`day`）     |  -          |  -          |  -            |  -         |           06日  |              6日  |
|  时（`hour`）    |  -          |  -          |  -            |  -         |           20时  |             20时  |
|  分（`minute`）  |  -          |  -          |  -            |  -         |            14  |              11  |
|  秒（`second`）  |  -          |  -          |  -            |  -         |            19  |               7  |
| 周（`weekday`）  | -           | 星期一         | -             | 周一         | -              | -                |  

需要注意的是如果要将小时数设置为 12 小时制，需要将选项 `hour12` 设置为 `false`。

##### 输出为 ISO 8601 格式

ISO 8601 是使用最广泛的日期和时间字符串格式集。下面给出几个 Luxon 提供的相关输出函数示例：

````
```dataviewjs
const dt = dv.luxon.DateTime
console.log(dt.now().toISO()) // 2024-05-07T11:51:35.464+08:00
console.log(dt.now().toISODate()) // 2024-05-07
console.log(dt.now().toISOWeekDate()) // 2024-W19-2
console.log(dt.now().toISOTime()) // 11:52:22.894+08:00
```
````

##### 输出为 Unix 时间缀

通常，日期和时间的数值表达形式包括毫秒和秒两种，用于精确呈现时间数据。

````
```dataviewjs
const dt = dv.luxon.DateTime
console.log(dt.now().toMillis()) // 1715054074747
console.log(dt.now().toSeconds()) // 1715054084.961
console.log(dt.now().toUnixInteger()) // 1715054097
console.log(dt.now().valueOf()) // 1715054111806
```
````

##### 输出 JavaScript 格式

这里主要是指输出为 JavaScript 对象，Date 日期格式以及 JSON 格式。

````
```dataviewjs
const dt = dv.luxon.DateTime
console.log(dt.now().toJSDate()) // Tue May 07 2024 14:32:53 GMT+0800 (中国标准时间)
console.log(dt.now().toJSON()) // 2024-05-07T14:29:54.238+08:00
console.log(dt.now().toObject()) // {year: 2024, month: 5, day: 7, hour: 14, minute: 28, second: 12, millisecond: 374}
```
````

##### 输出相对时间

将输出的日期和时间与当前对比，输出类似于 `x天前`、`前天` 、`去年` 这种描述形式。

````
```dataviewjs
const dt = dv.luxon.DateTime
const date = dt.local(2024, 5, 5, 22, 23, 12)
const date2 = dt.local(2023, 8, 5, 22, 23, 12)
const date3 = dt.local(2024, 5, 9, 22, 23, 12)

console.log(date.toRelativeCalendar()) // 前天
console.log(date.toRelative()) // 1天前
console.log(date2.toRelativeCalendar()) // 去年
console.log(date2.toRelative()) // 9个月前
console.log(date3.toRelativeCalendar()) // 后天
console.log(date3.toRelative()) // 2天后
```
````

##### 其它输出

这里是一些不常用，但会在特定场景下适用的输出方式：

````
```dataviewjs
const dt = dv.luxon.DateTime
console.log(dt.now().toRFC2822()) // Tue, 07 May 2024 15:05:47 +0800
console.log(dt.now().toHTTP()) // Tue, 07 May 2024 07:06:25 GMT
console.log(dt.now().toSQLDate()) // 2024-05-07
console.log(dt.now().toSQLTime()) // 15:07:04.616 +08:00
console.log(dt.now().toSQL()) // 2024-05-07 15:07:23.940 +08:00
console.log(dt.now().toBSON()) // Tue May 07 2024 15:08:04 GMT+0800 (中国标准时间)
```
````

#### 日期和时间的数学运算

这里所指的运算通常是日期的相加、相减、差异比较等。在运算中不变的是时间始终为 60 分钟，分钟始终为 60 秒，秒始终为 1000 毫秒，其余的很多都不是固定的，比如年份因闰年而异，月份各不尽相同，季度始终为 3 个月，但是月份长度不同，因此天数也不相同等等。

##### 相加和相减

使用 `plus(duration: (Duration | Object | number)): DateTime` 和 `minus(duration: (Duration | Object | number)): DateTime)` 来对日期和时间执行加减操作。

````
```dataviewjs
const dt = dv.luxon.DateTime
const print = date => console.log(date.toFormat('yyyy-MM-dd HH:mm:ss.SSS'))
const now = dt.local(2024, 5, 7, 12, 0, 0, 100)
print(now) // 2024-05-07 12:00:00.100
print(now.plus(55)) // 2024-05-07 12:00:00.155
print(now.plus({ minutes: 30 })) // 2024-05-07 12:30:00.100
print(now.plus({ days: 2 })) // 2024-05-09 12:00:00.100
print(now.plus({ days: -2 })) // 2024-05-05 12:00:00.100
print(now.minus({ days: 2 })) // 2024-05-05 12:00:00.100
print(now.plus({ hours: 5, minutes: 30 })) // 2024-05-07 17:30:00.100
print(now.plus(Duration.fromObject({ hours: 3, minutes: 13 }))) // 2024-05-07 15:13:00.100
```
````

在上面的示例中我们传入的 `duration` 如果为对象则可以使用下面的属性单位：

- `years`: 年
- `months`: 月
- `days`: 天数
- `quarters`: 季度
- `weeks`: 周数
- `hours`: 小时数
- `minutes`: 分钟数
- `seconds`: 秒数

##### 比较

可以使用 `<`、`>` 、`<=` 和 `>=` 来进行日期和时间比较，因为 DateTime 在比较时使用了 `valueOf()` 函数返回纪元时间缀进行数字对比。

````
```dataviewjs
const dt = dv.luxon.DateTime

const date1 = dt.local(2024, 5, 7, 12, 0, 0, 100)
const date2 = dt.local(2024, 5, 7, 12, 12, 30, 100)
const date3 = dt.local(2024, 5, 7, 12, 0, 0, 100)
console.log(date1 > date2) // false
console.log(date1 >= date3) // true
```
````

此外，还可以使用 `hasSame(otherDateTime: DateTime, unit: string, opts: Object): boolean` 函数来进行微妙的比较。需要注意的是这里的比较是基于日历进行检查的，也就是说在比较月的时候我们要保证年份是相同的，同理，比较分钟时，要确保是在同样的小时内。

````
```dataviewjs
const dt = dv.luxon.DateTime

const date1 = dt.local(2024, 5, 7, 12, 0, 0, 100)
const date2 = dt.local(2024, 5, 7, 12, 12, 30, 100)
const date3 = dt.local(2022, 5, 7, 12, 22, 22, 100)

console.log(date1.hasSame(date3, 'year')) // false
console.log(date1.hasSame(date2, 'month')) // true
console.log(date1.hasSame(date2, 'minute')) // false
```
````

##### 差异

使用 `diff(otherDateTime: DateTime, unit: (string | Array<string>), opts: Object): Duration` 函数可以来对比两个日期和时间的差异。如果要比较与当前时刻的时差，可以使用 `diffNow(unit: (string | Array<string>), opts: Object): Duration` 函数。

````
```dataviewjs
const dt = dv.luxon.DateTime
const d1 = dt.local(2024, 5, 7, 12, 23, 45, 100)
const d2 = dt.local(2023, 11, 27, 12, 23, 45, 100)

console.log(d1.diff(d2, 'years').toObject()) // {years: 0.4426229508196721}
console.log(d1.diff(d2, 'months').toObject()) // {months: 5.333333333333333}
console.log(d1.diff(d2, 'days').toObject()) // {days: 162}
console.log(d1.diff(d2).toObject()) // {milliseconds: 13996800000}
console.log(d1.diff(d2, ['months', 'days']).toObject()) // {months: 5, days: 10}
console.log(d1.diffNow('hours').toObject()) // {hours: -5.035617222222222}
```
````

#### 获取日期和时间的开始和结束表示

有时候我们想要舍弃日期和时间中的一部分值，比如只关心小时数，不关心具体多少秒，或者我们想输出一天的开始和结束时间，即：`00:00:00 - 23:59:59` 这种形式，这时可以使用 `statOf(unit: string, opts: Object): DateTime` 和 `endOf(unit: string, opts: Object): DateTime` 函数来实现：

````
```dataviewjs
const dt = dv.luxon.DateTime
const d = dt.local(2024, 5, 7, 12, 23, 45, 100)

console.log(d.startOf('year').toISODate()) // 2024-01-01
console.log(d.startOf('year').toISO()) // 2024-01-01T00:00:00.000+08:00
console.log(d.startOf('month').toISO()) // 2024-05-01T00:00:00.000+08:00
console.log(d.startOf('minute').toISOTime()) // 12:23:00.000+08:00
console.log(d.endOf('year').toISO()) // 2024-12-31T23:59:59.999+08:00
console.log(d.endOf('minute').toISOTime()) // 12:23:59.999+08:00
```
````


### Duration 使用

持续时间（Duration）指一个时间段的长度，比如几天、几小时、几分钟等。

#### 创建持续时间

要创建一个持续时间，可以通过以下几种试：

- 通过 `fromMillis(count: number, opts: Object): Duration` 函数传入毫秒数。
- 通过 `fromObject(obj: Object, opts: Object): Duration` 函数传入一个对象（属性包含：`years` | `quarters` | `months` | `weeks` | `days` | `hours` | `minutes` | `seconds` | `milliseconds`）。
- 通过 `fromDurationLike(durationLike: (Object | number | Duration)): Duration` 函数，个函数相当于不传 `opts` 的 `fromMillis()` 和 `fromObject()` 函数，同时还持续传入已有的 `Duration` 对象实例来创建持续时间。
- 通过 `fromISO(text: string, opts: Object): Duration` 和 `fromISOTime(text: string, opts: Object): Duration` 函数来创建。

````
```dataviewjs
const dur = dv.luxon.Duration
const d = dur.fromMillis(1715238823499)

console.log(dur.fromMillis(86400000).toObject()) // {milliseconds: 86400000}
console.log(dur.fromObject({ hours: 2, minutes: 8 }).toObject()) // {hours: 2, minutes: 8}
console.log(dur.fromDurationLike(86400000).toObject()) // {milliseconds: 86400000}
console.log(dur.fromDurationLike({ hours: 2, minutes: 8 }).toObject()) // // {hours: 2, minutes: 8}
console.log(dur.fromDurationLike(d).toObject()) // {milliseconds: 1715238823499}
console.log(dur.fromISO('P3Y6M1W4DT12H30M5S').toObject()) // { years: 3, months: 6, weeks: 1, days: 4, hours: 12, minutes: 30, seconds: 5 }
console.log(dur.fromISOTime('11:22:33.444').toObject()) // { hours: 11, minutes: 22, seconds: 33, milliseconds: 444 }
```
````

>[Note] 对于 ISO 格式的持续时间请参考官方网站，这里不作说明。

#### 输出持续时间

这时令 `d` 为一个 `Duration` 的实例，可以通过 `d.locale` 获取当前持续时间的本地类型，通常为 `zh-CN`，然后通过 `years` | `quarters` | `months` | `weeks` | `days` | `hours` | `minutes` | `seconds` | `milliseconds` 实例属性可获取相应的日期和时间值，也可以将基作为参数传入 `get()` 函数来获取值，例如：`d.get("months")`。

接下来我们看一下几个相关的输出函数：

##### `toFormat()` 函数

通过前面 DateTime 的介绍，相信对于这个函数的使用不会存在任何疑惑，但是这里需要注意的是这是一个阉割版的，因为它所支持的格式符号仅限以下几种：

- `S`: 毫秒
- `s`: 秒
- `m`: 分钟
- `h`: 小时
- `d`: 天
- `w`: 周
- `M`: 月
- `y`: 年，`yy` 将填充为 2 位年数表示法。

这里的 `toFormat()` 函数同样也支持在字符串内使用单引号进行转义。

````
```dataviewjs
const dur = dv.luxon.Duration
const d = dur.fromISO('P3Y6M1W4DT12H30M5S')

console.log(d.toFormat('yy-MM-dd hh-mm-ss')) // 03-06-11 12-30-05
console.log(d.toFormat("yy'年'MM'月'")) // 03年06月
```
````

##### `toHuman()` 函数

`toHuman(opts: Object)` 函数返回包含所有单位的 Duration 的字符串表示形式。

````
```dataviewjs
const dur = dv.luxon.Duration
const d = dur.fromISO('P3Y6M1W4DT12H30M5S')

console.log(d.toHuman()) // 3年、6个月、1周、4天、12小时、30分钟、5秒钟
console.log(d.toHuman({ unitDisplay: 'short' })) // 3年、6个月、1周、4天、12小时、30分钟、5秒
```
````

>[Tips] 关于 `opts` ，可以参考 [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options)

##### `toObject()` 函数

这个函数就是将持续时间输出为 JavaScript 对象表示，没有什么好说的。

##### `toISO()` / `toISOTime()` 函数

ISO 8601 形式的持续时间表示法，对很多人来讲很陌生，作者也是一样第一次接触，但是查阅相关资源后其实也挺容易理解的，例如：`P5M` 表示 `5个月`，下面作一个简单的介绍。

持续时间以 `P` （表示 Period） 开头，格式为： 

1. `P[n]Y[n]M[n]DT[n]H[n]M[n]S`
2. `P[n]W`
3. `P<date>T<time>`

基中 `[n]` 为要被替换的具体日期或时间值，例如 `P2Y` 表示 `02年`，`P1Y-2M` 表示 `1年负2个月`，也就是 `10个月`。

`W` 表示周数，例如：`P2W` 表示 `第2周`。

`T` 后面表示时间，格式为 `Thh:mm:ss.sss` 或者 `hh:mm:ss.sss`，可通过 `toISOTime()` 函数的选项 `opts.includePrefix` 来控制是否显示前缀 `T`。

下面是一些示例：

````
```dataviewjs
const dur = dv.luxon.Duration

console.log(dur.fromObject({years: 2024}).toISO()) // P2024Y
console.log(dur.fromObject({months: 5}).toISO()) // P5M
console.log(dur.fromObject({weeks: 5}).toISO()) // P5W
console.log(dur.fromObject({minutes: 5}).toISO()) // PT5M
console.log(dur.fromObject({seconds: 5}).toISO()) // PT5S
console.log(dur.fromObject({seconds: 5, milliseconds: 234}).toISO()) // PT5.234S

console.log(dur.fromObject({ hours: 11 }).toISOTime()) // 11:00:00.000
console.log(dur.fromObject({ hours: 11 }).toISOTime({ suppressMilliseconds: true })) // 11:00:00
console.log(dur.fromObject({ hours: 11 }).toISOTime({ includePrefix: true })) // T11:00:00.000
console.log(dur.fromObject({ hours: 11 }).toISOTime({ format: 'basic' })) // 110000.000
```
````

>[Tips] 还有 2 个函数 `toJSON()` 和 `toString()` 也是输出为 ISO 8601，只不过一个适用于 JSON,一个适用于调式。

除了上述几个函数外，还可以使用 `toMillis()` 和 `valueOf()` 来输出持续时间的毫秒表示。

#### 持续时间的数学运算

持续时间的数学运算只支持相加（`plus(duration: (Duration | Object | number)): Duration`）和相减（`minus(duration: (Duration | Object | number)): Duration`）以及比较（`equals(others: Duration): boolean`）运算，此外还提供了一个遍历函数 ` mapUnits(fn: function): Duration ` 来根据条件作运算。

````
```dataviewjs
const dur = dv.luxon.Duration

const dur1 = dur.fromISO('P1Y')
const dur2 = dur.fromISO('P2M')

console.log(dur1.equals(dur2)) // false
console.log(dur1.plus(dur2).toISO()) // P1Y2M
console.log(dur1.minus(dur2).toISO()) // P1Y-2M
console.log(dur1.plus(dur2).mapUnits(x => x * 2).toISO()) // P2Y4M
console.log(dur1.plus(dur2).mapUnits((x, u) => u === "months" ? x * 3 : x).toISO()) // P1Y6M
```
````

#### 日期和时间的换算

我们知道 1 天有 24 小时，1 小时有 60 分钟，1 分钟有 60 秒，1 秒有 1000 毫秒，然后 1 天可以表示成 8640000 毫秒，在 Luxon 中提供了 `as(unit: string): number` 和 `shiftTo(units: ...any): Duration` 函数来处理，些外还有一个 `shiftToAll(): Duration` 函数，等同于调用 `shiftTo("years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds")`。

````
```dataviewjs
const dt = dv.luxon.DateTime
const dur = dv.luxon.Duration
const d1 = dt.local(2024, 5, 7, 12, 23, 45, 100)

const dur1 = dur.fromObject({days: 1})
console.log(dur1.as('minutes')) // 1440
console.log(dur1.as('seconds')) // 86400
console.log(dur1.as('milliseconds')) // 86400000
console.log(dur1.shiftTo('hours', 'minutes').toObject()) // {hours: 24, minutes: 0}

const dur2 = dur.fromObject(d1.toObject())
console.log(dur2.as('days')) // 738917.5164942129
console.log(dur2.shiftTo('weeks', 'days').toObject()) // {weeks: 105269, days: 0.5164942129629635}

const dur3 = dur.fromObject({ months: 2, weeks: 3, days: 3})
console.log(dur3.as('days')) // 84
console.log(dur3.shiftTo('weeks', 'days').toObject()) // {weeks: 11, days: 3}
console.log(dur3.shiftToAll().toObject()) // {"years":0,"months":2,"weeks":3,"days":3,"hours":0,"minutes":0,"seconds":0,"milliseconds":0}
```
````

 既然有将日期和时间换算成毫秒表示，自然也有对应的将毫秒转换成相应的对象表示形式，这里我们需要用到 `rescale(): Duration` 函数，使用方法如下：

````
```dataviewjs
const dur = dv.luxon.Duration
const dur1 = dur.fromObject({milliseconds: 86400000})

console.log(dur1.valueOf()) // 86400000
console.log(dur1.toObject()) // {milliseconds: 86400000}
console.log(dur1.rescale().toObject()) // {days: 1}
console.log(dur.fromMillis(1715245618057).toObject()) // {milliseconds: 1715245618057}
console.log(dur.fromMillis(1715245618057).rescale().toObject()) // {years: 59, months: 1, hours: 9, minutes: 6, seconds: 58, milliseconds: 55}
```
````

## 参考

- [luxon 3.4.4 | Documentation (moment.github.io)](https://moment.github.io/luxon/api-docs/index.html)
- [moment.github.io/luxon/demo/global.html](https://moment.github.io/luxon/demo/global.html)
- [深入了解ISO 8601：日期和时间的国际标准化-CSDN博客](https://blog.csdn.net/weixin_53742691/article/details/135534399)
- [JS Intl对象完整简介及在中文中的应用 « 张鑫旭-鑫空间-鑫生活 (zhangxinxu.com)](https://www.zhangxinxu.com/wordpress/2019/09/js-intl-zh/)
- [Array.prototype.flatMap() - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)
- [ISO 8601 - Wikipedia](https://en.wikipedia.org/wiki/ISO_8601#Durations)