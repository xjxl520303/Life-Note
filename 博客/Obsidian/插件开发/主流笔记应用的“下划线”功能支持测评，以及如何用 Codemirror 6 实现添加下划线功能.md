---
created_at: 2024-07-11 19:29:50
tags:
  - Codemirror
updated_at: 2024-07-26 11:27:16
---
本文以文本编辑器中一个比较常见的【下划线】功能为聚焦点来探讨一下一个小小的功能在各大笔记应用中的细节。我们以小见大、精益求精，从一个非常小的细节来看这些笔记应用（作者主要以网页版作为测评）对于功能上的打磨程度，用户体验如何。

最近几个月一直在写 Obsidian 一些重要的插件（如：Dataview，Templater,……）使用教程。在写作的过程中自己也尝试过很多插件，发现有的插件很不错可惜作者已不再维护或者说归档了——于是就开始自己去了解一些插件开发的知识。

在 Obsidian 的插件开发文档中有关**编辑器**扩展的部分文档提到了使用 Codemirror 来创建视图，还提到了很多以前没有接触过的 “State Field”、“Decorations”和“State Effect”概念。但是看了 Obsidian 的文档还是一知半解，不知道如何入手，同时通过搜索引擎查阅 Codemirror 6 相关的文章也寥寥无几，只好跟着 Codemirror 官方[示例](https://codemirror.net/examples/)来了解相关的知识。

本文不去解释有关 **State**、**Effect** 和 **Decoration** 的概念——因为写这篇文章时还处于懵懂状态，就不误导人了。文章主要是基于官方示例([Example: Decorations](https://codemirror.net/examples/decoration/))中有关 Mark Decoration 的使用进行思考和扩展，并使用 React（并不依赖于它） 来实现。

## 高能预警

因为作者现阶段只是了解了一点 Codemirror 的知识，所以文章也就局限在对通过 `Decoration.mark` 添加下划线和去除下划线的一些特殊场景的思考上，代码实现并不据有实际应用性（仅作思路参考）。目前作者还不知道如何保存操作后的结果，以及加载已标记过的内容——特别是在 Obsidian 中保存操作的结果以及获取标记后的 HTML 原始内容——希望哪位大神能指点一二。
## 主流笔记应用对下划线功能的支持程度测评

接下来我们以二段简单地，分别包含中英文的文字来作为测试样例文本：

```
基于 IKAnalyzer 字典分词器的 node.js 实现。
Lorem ipsum dolor sit amet, consectetur adipisicing elit
```

我们选取主流的几款笔记应用并设计几个测试用例点来看一下各个笔记应用地表现。

- 印象笔记
- 有道云笔记
- 语雀
- Notion
- Obsidian

测试功能主要为：

1. 对于中英文选词的支持程度（测试点：光标位于词语/单词的位置〔头、中间和尾〕、选区）
2. 如何添加和取消下划线。
3. 如何扩展、缩小下划线的范围（基于单个、多个组合在一起）。
4. 下划线的展现和编辑方式。

>注：后续我们以“「用例➊」”的形式来分别引用上述几个测试功能点。

「用例➌」我们将其分成以下几个小的分类（蓝色框表示接下来操作选中的选区）：

![[Pasted image 20240716161253.png]]

### 印象笔记

对于「用例➊」，印象笔记在选词上支持中英文在光标前后选词。以“下划线”为例：光标位于“下”前面则选中整个词语,在“线”后面同样如此，但是如果在“线”后面出现别的文本（包含空格）只会向右选择。在中文分词上，当光标位于“分词器”的“分”前面只能选中“分词”，无法选中整个词语（这个跟使用的分词词典有关，语料库越丰富就能识别更多的词语）。印象笔记在选中英文单词时会包含右侧的单词分隔符（空格），对于中文同样支持（多个空格也会选中）。

对于「用例➋」，印象笔记支持通过【工具栏】和【快捷键（<kbd>Ctrl+U</kbd>）】来操作。

接下来我们来重点看一下「用例➌」的测试结果：

![[Pasted image 20240716162503.png]]

- 图中 1）通过查看浏览器的开发者工具，会发现合并后的下划线区域文本是分开的 `"amet, "` 和 `"consectetur"` 合在一起后会变成 `"amet, "\n"consectetur"` （其中 `\n` 表示换行），而不是合并后的 `"amet, consectetur"`。
- 图中 2）这个操作可能不太符合作者的认知（如果自己设计应该是合并操作才对）。
- 图中 3）符合期望。
- 图中 4）符合期望，成功取消了单词内部部分字符的下划线。
- 图中 5、6）符合期望，成功合并在一起了，并且单词也没有被分隔成二段。
- 图中 7）应该执行合并操作才对。
- 图中 8）符合期望，成功合并了。
- 图中 9）成功取消了，但是单词前后的空格中的下划线并没有去除掉。

对于「用例➍」，印象笔记是可以通过鼠标任意选中的，编辑器内部显示为：

```html
<span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">amet, consectetur</span>
```

从代码中的 `data-mce-style` 可以看出印象笔记使用了 [TonyMCE](https://github.com/tinymce/tinymce) 文本编辑器。

### 有道云笔记

对于「用例➊」，功能几乎同印象笔记一致，但是不支持单词尾部选择词语/单词——直接选中了整行文本——这或许是为了方便用户选中整行文本（用户体验优化）。在鼠标快速【双击】选中词语/单词上不包含右侧的空格，这一点作者看来更符合操作习惯。

对于「用例➋」两者支持程度也一致。

对于「用例➌」，两者是否有大的差异呢？请看结果：

![[Pasted image 20240716171530.png]]

测试结果让作者很满意（与自己的认识高度一致），只不过在最后一种单词在句中取消下划线时是否连同单词左右的空格一同去除有所差异。通过查看开发者工具中的文本合并情况，会发现并没有出现像印象笔记那样表现不致的地方，表现很完美。

「用例➍」表现和印象笔记一致，其内部表示为：

```html
<span class="underline" style="text-decoration: underline;">consectetur</span>
```

有道云的文本编辑器是自己实现的，具体可参考：

- [前端 - 有道云笔记新版编辑器架构设计（上） - 有道技术团队 - SegmentFault 思否](https://segmentfault.com/a/1190000039046174)
- [前端 - 有道云笔记新版编辑器架构设计（下） - 有道技术团队 - SegmentFault 思否](https://segmentfault.com/a/1190000039104198)

### 语雀

对于「用例➊」和有道云笔记几乎一致，除了在行末【双击】鼠标时不既不选中鼠标前的文本，也不选中整行——主打一个不响应。

对于「用例➋」支持程度一致。

同有道云笔记——都是自研的文本编辑器，对于「用例➌」是否有不同的想法呢？谜底揭晓：

![[Pasted image 20240716174920.png]]

结果居然和印象笔记出奇地一致，难道语雀自研时参考了 TonyMCE 编辑器😂？不过在合并细节处理上和有道云笔记一样保持了统一。

「用例➍」结果为：

```html
<ne-text ne-underline="true" id="u410ac03c">consecte</ne-text>
```

单从代码来看语雀的实现更加现代化和简洁。

有关语雀文本编辑器的介绍可以参考：[语雀编辑器自研之路 - 掘金 (juejin.cn)](https://juejin.cn/post/7036551063498915877)

### Notion

对于「用例➊」，Notion 在选择词语/单词时与印象笔记保持一致（会选中后面的空格）；在行末【双击】时和语雀保持一致。

对于「用例➋」支持程度一致。

对于「用例➌」，Notion 和有道云笔记保持一致。

![[Pasted image 20240716182854.png]]

「用例➍」结果为：

```html
<span style="color:inherit;border-bottom:0.05em solid;word-wrap:break-word" data-token-index="1" class="notion-enable-hover">amet, consectetur </span>
```

从代码中可以看出 Notion 使用了下边框来实现下划线，并未使用 `text-decoration: underline;`。

### Obsidian

Obsidian 很遗憾在这方面支持有点差强人意，本身没有提供添加下划线的功能，但我们可以通过在编辑器中直接输入 `<u>文本</u>` 来实现。

想要通过工具栏来实现添加下划线，我们需要使用由 PKMer 社区开发的 [Editing Toolbar](https://github.com/PKM-er/obsidian-editing-toolbar) 来实现：

![[Pasted image 20240716190032.png]]

对于快捷键我们可以为 Editing Toolbar 提供的命令【Editing Toolbar: Toggle underline】添加快捷键来实现，但是……其功能就……一言难尽了。

![[动画2 68.gif]]

可以看到操作起来并不顺畅，只能应对简单的场景。取消下划线时需要进入标签内部才能取消，好在在分词方面因为有插件 [Word Splitting for Simplified Chinese in Edit Mode and Vim Mode](https://github.com/aidenlx/cm-chs-patch) 稍微找点安慰🤔。

---

行文至此，作者发现对于在浏览器中【双击】选中文本时的分词功能可能是浏览器提供的，与这几个编辑器无关。在选中词语/单词上文本右侧的空格也是浏览器的默认行为。

此外，作者还看了一下知乎的文本编辑器对于下划线的支持情况——同印象笔记和语雀保持一致。

总的说来在处理下划线的场景下可以分为两派：

- 印象笔记、语雀和知乎
- 有道云笔记、Notion

分歧点在于：已添加下划线的文本右侧再次选中别的文本时，是将其作为下划线部分合并还是将重叠部分去除掉。

如果按照用户体验度排名，本次测评结果排名为：**Notion > 有道云笔记、语雀 > 印象笔记 > Obsidian**。

虽然 Obsidian 垫底，但是凭借其强大地开源社区插件生态，相信未来会弥补这一交互体验上的不足。

## Obsidian 插件开发准备

>[!tip] 由于文章写作时使用的是 Windows 系统，所以后面开发是基于 Windows 环境，如果读者使用的是 MacOS，请自行调整。

新建一个 Obsidian 空白仓库（作者这里取名为："cm6-underline"），然后在资源管理器中打开笔记所在的目录并进入 `.obisidan` 目录；接着创建目录 `plugins`。

开发 Obsidian 插件，我们通常选择基于社区主流的模板 [Obsidian Sample Plugin](https://github.com/obsidianmd/obsidian-sample-plugin) 作为脚手架；此外，我们还需要一个插件 [Hot-Reload](https://github.com/pjeby/hot-reload) 来实现代码变更后插件实时刷新。

因为 Hot Reloat 插件并没有发布到社区插件市场中，因此我们需要手动下载并将其放置到 `.obsidian/plugins` 目录中。要下载插件，我们需要在 Github 中直接找到其发布的最新版本，并选择下载 *hot-reload.zip* 资源到插件目录即可。

接下来我们克隆 Sample Plugin 项目到插件目录中：

```shell
git clone https://github.com/obsidianmd/obsidian-sample-plugin.git
```

当前目录结构如下：

```
E:\NOTE\CM6-UNDERLINE
└─.obsidian
    └─plugins
        ├─hot-reload
        └─obsidian-sample-plugin
```

紧接着，我们进入 `obsidian-sample-plugin` 目录中并执行 `npm i` 命令来下载 NPM 资源库。完成资源下载后，我们就可以使用 `npm run dev` 来启动插件了。

接下来打开 Obsidian，在【选项】中开启插件；此时，应该还看不到我们安装的 Hot Reloat 以及 Sample 插件。要加载插件我们需要重新启动当前仓库，但这里我们可以使用命令（<kbd>Ctrl+P</kbd> 来触发命令列表）【Reload app without saving】来重启仓库；命令执行后，我们再次进入【选项】-> 【社区插件】就可以看到安装的插件了，此时这 2 个插件还处于未开启状态——开启即可。

到此，Obsidian 插件开发地准备工作就结束了，读者可以浏览一下 Sample Plugin 插件提供的样例代码，修改内容看一下 Obsidian 会不会自动刷新插件。

## React 中 Codemirror 6 环境准备

这里可以选择任意前端框架，或者使用 Vanilla（通常指不使用任何框架的原生 JavaScript 环境） 直接开发。

在资源管理器中任意目录（你想要放置代码的目录）中使用 `npm init vite@latest` 来初始化一个 React 开发环境。根据命令行中的提示，依次输入项目名称：`cm6-underline`；框架选择 `React`；开发语言选择 `TypeScript`。完成后，根据终端中的提示进入 `cm6-underline` 目录并执行 `npm i` 来下载项目的初始依赖资源。

接下来下载 Codemirror 6 相关的资源：

```shell
npm i codemirror @codemirror/state @codemirror/view @codemirror/commands
```

现在我们使用 Visual Studio Code 打开项目，使用编辑器自带的 Git 管理工具初始化一个仓库。接下来删除（项目不需要设置样式） `src` 目录下的 App.css 和 index.css 样式文件，并且删除 App.tsc 和 main.tsx 中对于这二个样式文件的引用代码。

然后在 `src` 目录下创建目录 `components` 并添加文件 `Editor.tsx `，将下面内容复制并粘贴到目标文件中：

```tsx
import React, { useRef, useEffect } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { defaultKeymap } from '@codemirror/commands'
import { basicSetup } from 'codemirror'

export const Editor = () => {
    const editor = useRef(null)

    useEffect(() => {
        const startState = EditorState.create({
            doc: 'Hello World',
            extensions: [basicSetup, keymap.of(defaultKeymap)],
        });

        const view = new EditorView({ state: startState, parent: editor.current! })

        return () => {
            view.destroy()
        };
    }, []);

    return <div ref={editor}></div>
};
```

修改 `App.tsx` 文件内容为：

```tsx
import { Editor } from './components/Editor'

function App() {
  return (
    <div className="App">
      <Editor />
    </div>
  );
}

export default App;
```

使用 `npm run dev` 运行后会看到以下运行结果：

![[Pasted image 20240717142051.png]]

到此，浏览器中的 Codemirror 6 开发环境准备就绪。

## 下划线功能的构思

从前面的测评章节可以看出主流笔记应用对其功能的实现和操作方式，我们既然写文章就是在此基础上想得更多，才能彰显不凡。

这里我们以 Notion 的下划线功能为参考，在此基础上我们增加以下功能：

1. 支持光标不选中文本时通过快捷键直接添加和移除下划线。
2. 添加自动分词功能。
3. 对于移除下划线时，顺带单词边界的空格也一同去掉。

## 通用功能的实现

这一章节我们对标前面测评中的笔记应用所具有的功能开发，同时增加了：单词边界空格同时移除功能。

我们根据 Codemirror 6 官方[示例](https://codemirror.net/examples/decoration/)在 `components` 目录创建一个 `Underline.ts` 文件，内容如下：

```ts
import { StateEffect, StateField } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView, keymap } from "@codemirror/view";

const addUnderline = StateEffect.define<{from: number, to: number}>({
    map: ({from, to}, change) => ({from: change.mapPos(from), to: change.mapPos(to)})
})

const underlineField = StateField.define<DecorationSet>({
    create() {
        return Decoration.none;
    },
    update(underlines, tr) {
        underlines = underlines.map(tr.changes);
        for (let e of tr.effects) {
            if (e.is(addUnderline)) {
                underlines = underlines.update({
                    add: [underlineMark.range(e.value.from, e.value.to)]
                })
            }
        }
        return underlines;
    },
    provide: f => EditorView.decorations.from(f)
})

const underlineMark = Decoration.mark({class: "cm-underline"})

const underlineTheme = EditorView.baseTheme({
    ".cm-underline": { textDecoration: "underline 3px red" }
})


export function underlineSelection(view: EditorView) {
    let effects: StateEffect<unknown>[] = view.state.selection.ranges
        .filter(r => !r.empty)
        .map(({from, to}) => addUnderline.of({from, to}))
    
    if (!effects.length) return false;

    if (!view.state.field(underlineField, false)) {
        effects.push(StateEffect.appendConfig.of([underlineField, underlineTheme]))
    }

    view.dispatch({effects})
    return true
}

export const underlineKeymap = keymap.of([{
    key: "Alt-a",
    preventDefault: true,
    run: underlineSelection
}])
```

下面我们来简单梳理一下 Codemirror 6 中相关的概念。

Codemirror 6 中有几个核心的包：

- `@codemirror/state` 定义了编辑器的状态管理和文档模型。编辑器的状态包括文本内容、光标位置、选区和编辑器的配置选项等。
- `@codemirror/view` 提供了构建编辑器用户界面的核心功能。它定义了编辑器的视图组件、输入处理和渲染逻辑等。
- `@codemirror/commands` 定义了许多编辑命令和一些快捷键地绑定。
- `codemirror` 是一个编辑器的基础配置预设包，包含了自动补全、高亮、主题等。
- `@codemirror/lang-xxx` 为特定语言提供语法高亮和解析功能。

在 Codemirror 6 中我们会看到很多关键字，如：**State**、**Effect**、**Transaction** 和 **Decoration**。

一）State 代表了编辑器的当前状态，包含文档内容、光标位置、选区、配置项等所有与编辑器相关的信息。它是不可变的，一旦创建就不会改变，除非创建新的 State 对象来替代。

二）Effect 用于表示对编辑器状态更改的一种抽象。它并不直接修改状态，而是定义了状态应如何更改。

三）Transaction 用于封装对编辑器状态更改的实体。如果了解数据库查询语言，这和里面的事务是同一个概念；它收集一组 Effect，并将它们应用到 State 上，从而生成一个新的 State 对象。

四）Decoration 提供了如何在编辑器中绘制内容和修改样式的功能。

现在我们解释一下上面的代码：

```ts
const addUnderline = StateEffect.define<{from: number, to: number}>({
    map: ({from, to}, change) => ({from: change.mapPos(from), to: change.mapPos(to)})
})
```

这段代码定义了一个名为 `addUnderline` 的 Effect。从代码看是对变化进行映射，但是作者尝试在代码中的 `map` 函数中添加 `cosnole.log` 或者断点都未触发执行，后面我们将其改成 `const addUnderline = StateEffect.define<{from: number, to: number}>()` 姑且认为这就是定义一个操作吧。

`const underlineField = StateField.define<DecorationSet>({...})` 用于定义一个状态字段，其类型为 `DecorationSet`。`DecorationSet` 表示一组 Decoration 对象，每一个 Decoration 都和编辑器中的一个特定范围相关联。

`create` 方法用于创建初始状态，这里我们一开始是不会添加下划线，因为没有可操作的选区，直接设置为 `Decoration.none`。如果是实际项目中，这里我们需要做的就是对已加载的文档进行解析，找出标记为下划线的文本的位置信息，然后使用 `Decoration.set([underlineMark.range(0, 2)])` 来标记。在当前的项目中我们需要将 `underlineField` 和 `underlineTheme` 导出并在 `Editor.tsx` 文件中引入并在 `extensions` 中添加。

`update` 方法用于更新内容。如果运行时有 `view.dispatch("xxx")` 发送，这里就可以捕捉到，接着判断关心的 Effect 就可以了。在 `update` 内部我们从 Transaction 中获取到所有的改变并遍历其中的 Effect，找到与 `addUnderline` 关联的操作，然后通过 `RangeSet.update` 方法来更新选区内容。在 `RangeSet.update` 方法中我们传递的是 `RangeSetUpdate` 类型参数，该类型定义了相关的更新方式：`add`, `sort`, `filter`, `filterFrom` 和 `filterTo` 5 种；这里我们使用 `add` 属性来添加一个带有下划线的选区。

`provide: f => EditorView.decorations.from(f)` 用于将 `underlineField` 提供的装饰集传递给 EditorView，使其能够在视图中显示这些 Decoration。如果没有这一行代码，你将无法看到效果。

`Decoration.mark({class: "cm-underline"})` 用于添加一个标记，这里默认会生成一个类似 `<span class="cm-underline">内容</span>` 的 HTML 标签。除了指定类名（`class`）外，这里还可以指定属性（`attributes`）、标签名（`tagName`）以及其它一些由 `MarkDecorationSpec` 接口定义的属性。

`EditorView.baseTheme({...})` 用于向 Codemirror 添加自己的样式。

`function underlineSelection(view: EditorView) {}` 用于定义用户操作，它是用来响应快捷键操作的。这里我们通过调用 `view.dispatch({effects})` 来应用状态的变更。`dispatch` 方法有多个定义，这里传递的是一个 `Transaction` 类实例。`Transaction` 类有多个属性，这里我们只关心 `effects` 属性，它的类型为 `StateEffect` 数组。代码中，我们判断了选区是否为空，检查了 `underlineField` 是否位于 `view.state` 中，如果不存在就将其添加到 `effects` 数组中。

现在我们切换到 `Editor.tsx` 文件中，将基变更为：

```ts
import { useRef, useEffect } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { defaultKeymap } from '@codemirror/commands'
import { basicSetup } from 'codemirror'
import { underlineKeymap } from './Underline'

export const Editor = () => {
    const editor = useRef(null);

    useEffect(() => {
        const startState = EditorState.create({
            doc: '基于 IKAnalyzer 字典分词器的 node.js 实现。\nLorem ipsum dolor sit amet, consectetur adipisicing elit',
            extensions: [basicSetup, keymap.of(defaultKeymap), underlineKeymap],
        })

        const view = new EditorView({ state: startState, parent: editor.current! })

        return () => {
            view.destroy()
        };
    }, []);

    return <div ref={editor}></div>
};
```

然后看一下效果：

![[动画2 69.gif]]

当我们在浏览器开发工具查看应用后的效果时会发现多次应用后会出现 HTML 标签叠加现象，同时目前还无法移除已添加的下划线。

### 添加重复标记验证逻辑

对于已添加过下划线的选区我们应该取消再次标记（这里先不讨论移除逻辑）以避免标签叠加，因此我们需要实现一个过滤操作。

在 `if (e.is(addUnderline)) {}` 代码块内第一行添加以下代码：

```ts
underlines = underlines.update({
    filter: (from, to) => !(from >= e.value.from && to <= e.value.to)
})
```

这里的 `filter` 方法定义了如何过滤选区内容，如果返回 `true` 则保留选区操作，为 `false` 就丢弃。`from` 和 `to` 表示上一个状态的选区起始位置， `e.value.from` 和 `e.value.to` 表示新的状态选区的起始位置值。

在 `filter` 中的判断逻辑其实并不严谨，只适用下图中的第 2、3 两种情形，后续我们会再来改进。

![[Pasted image 20240717192708.png]]

### 添加移除下划线逻辑

要移除下划线，我们首先得获取已添加下划线的选区——好在 `DecorationSet` （实际为：`RanageSet<Decoration>` 类）类型有一个 `between` 方法，它可以在指定的选区范围内对其包含的所有选区进行遍历操作，相当数组的 `forEach` 方法。例如我们使用：

```ts
underlines.between(e.value.from, e.value.to, (from, to) => {
    console.log(from, to)
})
```

表示在控制台输出当前选区覆盖范围内已添加过下划线的选区的起始位置值，如果包含多个选区，则会对每个选区位置进行输出。基于此逻辑，我们可以定义一个标志 `isMarked` 来作为【添加】和【移除】的判断依据，修改后的代码如下：

```ts
if (e.is(addUnderline)) {
    let isMarked = false
    underlines.between(e.value.from, e.value.to, () => {
        isMarked = true
    })

    if (isMarked) {
        underlines = underlines.update({
            filter: (from, to) => !(from >= e.value.from && to <= e.value.to)
        })
    } else {
        underlines = underlines.update({
            add: [underlineMark.range(e.value.from, e.value.to)]
        })
    }
}
```

效果如下：

![[动画2 70.gif]]

到目前为此我们的实现仅仅只能应对最简单的操作，一旦涉及多个选区或者包含部分（全部）下划线加文字的情形就会不起作用。

### 应对复杂地操作

现在我们来根据不同的场景来分析一下在实现过程中需要考虑的细节。后文为了方便表达，我们以“标记”来指代包含下划线的文本（或区域）；以“头部”表示选区左侧位置，“锚点”表示选区右侧位置。

>[!tip] 【注意】实际上选区由锚点（`anchor` 〔移动选择时不移动的一侧〕）和头部（`head` 〔移动的一侧〕）组成。

#### 选区头部不包含标记，锚点位于标记中：进行合并操作

我们用一张图来描绘这种场景：

![[Pasted image 20240718113847.png]]

图中：红色部分表示上一个标记的起始位置，绿色部分表示新的选区起始位置；其中 `e.value.to` 可以和标记的起始位置重合（图中未描绘出这二种情形）。

这里我们首先要识别出这一情形，可以通过在 `underlines.between` 函数中进行以下判断：

```ts
if ((e.value.from < from && e.value.to >= from) && e.value.to <= to) {
    // ...
}
```

接下来需要将原有的标记移除掉，并添加新的标记——新标记的锚点指向上一个标记的锚点（`to` 值）。移除标记我们可以封装一个 `removeUnderline` 的方法：

```ts
const removeUnderline = () => {
    underlines = underlines.update({
        filter: () => false
    })
}
```

下面是调整后的代码：

```ts
export const underlineField = StateField.define<DecorationSet>({
    create() {
        return Decoration.none;
    },
    update(underlines, tr) {
        underlines = underlines.map(tr.changes)

        const removeUnderline = () => {
            underlines = underlines.update({
                filter: () => false
            })
        }

        for (let e of tr.effects) {
            if (e.is(addUnderline)) {
                let isMarked = false
                underlines.between(e.value.from, e.value.to, (from, to) => {
                    if ((e.value.from < from && e.value.to >= from) && e.value.to <= to) {
                        e.value.to = to
                        removeUnderline()
                        isMarked = false
                    } else {
                        isMarked = true
                    }
                })

                if (!isMarked) {
                    underlines = underlines.update({
                        add: [underlineMark.range(e.value.from, e.value.to)]
                    })
                } else {
                    removeUnderline()
                }
            }
        }

        return underlines;
    },
    provide: f => EditorView.decorations.from(f)
})
```

验证一下：

![[动画2 71.gif]]

#### 选区头部位于标记中，锚点不包含标记：执行合并操作

![[Pasted image 20240718141643.png]]

这种情形和第一种差不多，但是在处理逻辑上——从我们前面的测评来看——各主流笔记应用出现了分歧。我们这里选择进行合并选区操作，处理逻辑上第一种类似，所以接着上面的代码添加一个 `else if` 逻辑：

```ts
// ...
} else if ((e.value.from > from && e.value.from <= to) && e.value.to > to) {
    e.value.from = from
    removeUnderline()
    isMarked = false
}
// ...
```

验证一下：

![[动画2 72.gif]]

#### 选区包含标记或者被标记包含：执行合并或移除逻辑

![[Pasted image 20240718145020.png]]

在标记内部的情形就不给出图例了。

这二种情形中“包含标记”的判断逻辑很简单，处理也不复杂，直接上代码：

```ts
// ...
} else if (e.value.from < from && e.value.to > to) {
    removeUnderline()
    isMarked = false
}
// ...
```

“在标记中”的情况因为涉及到将一个标记分成 3 部分：左右两部分需要添加标记，中间部分不需要。这里我们需要将添加标记进行封装并传入指定的起始位置来标记，而不是按前面的最新选区来标记。

```ts
const createUnderline = (from: number, to: number) => {
    return underlines.update({
        add: [underlineMark.range(from, to)]
    })
}
```

接着还需要增加一个标志位 `isRemove` 来标识是否要执行移除逻辑，因为我们在处理这种情形时已经执行过一次移除操作了，所以后面再执行就把新增加的标记给移除掉了。

下面是现阶段已完成的 `update` 部分代码：

```ts
update(underlines, tr) {
    underlines = underlines.map(tr.changes)

    const removeUnderline = () => {
        underlines = underlines.update({
            filter: () => false
        })
    }

    const createUnderline = (from: number, to: number) => {
        return underlines.update({
            add: [underlineMark.range(from, to)]
        })
    }

    for (let e of tr.effects) {
        if (e.is(addUnderline)) {
            let isMarked = false
            let isRemove = true
            underlines.between(e.value.from, e.value.to, (from, to) => {
                if ((e.value.from < from && e.value.to >= from) && e.value.to <= to) {
                    e.value.to = to
                    removeUnderline()
                    isMarked = false
                } else if ((e.value.from > from && e.value.from <= to) && e.value.to > to) {
                    e.value.from = from
                    removeUnderline()
                    isMarked = false
                } else if (e.value.from < from && e.value.to > to) {
                    removeUnderline()
                    isMarked = false
                } else if (e.value.from > from && e.value.to < to) {
                    removeUnderline()
                    underlines = createUnderline(from, e.value.from)
                    underlines = createUnderline(e.value.to, to)
                    isMarked = true
                    isRemove = false
                } else {
                    isMarked = true
                }
            })

            if (!isMarked) {
                underlines = createUnderline(e.value.from, e.value.to)
            } else {
                isRemove && removeUnderline()
            }
        }
    }

    return underlines;
}
```

结果：

![[动画2 73.gif]]

#### 两个标记之间，选择部分标记和内容：执行合并操作

![[Pasted image 20240718170448.png]]

这种情形实际上同前面介绍的前二种情形的一种特殊情况，为什么说特殊呢——是因为判断逻辑不一样。我们先看一下存在的问题：

![[动画2 74.gif]]

从 GIF 图中可以看出，在我们操作时其它标记也受到了影响，这显然是不能接受地。要解决这个问题，我们需要从 `filter` 函数着手，因为在这里控制着移除标记的逻辑。

在 `filter` 内部我们只需要增加一个判断条件：新选区的头部和锚点只要其中一个位于标记中就移除这个标记。因为我们的 `removeUnderline` 方法位于 `underlines.between()` 外部，因此还需要增加新选区的起始位置作为参数传进去以便判断，同时还要更新相关调用位置的参数。

调整后的代码如下：

```ts
update(underlines, tr) {
    underlines = underlines.map(tr.changes)

    const removeUnderline = (from: number, to: number) => {
        underlines = underlines.update({
            filter: (f: number, t: number) => !((f >= from && t <= to) || (f < from && t > to))
        })
    }

    const createUnderline = (from: number, to: number) => {
        return underlines.update({
            add: [underlineMark.range(from, to)]
        })
    }

    for (let e of tr.effects) {
        if (e.is(addUnderline)) {
            let isMarked = false
            let isRemove = true
            underlines.between(e.value.from, e.value.to, (from, to) => {
                if ((e.value.from < from && e.value.to >= from) && e.value.to <= to) {
                    e.value.to = to
                    removeUnderline(e.value.from, e.value.to)
                    isMarked = false
                } else if ((e.value.from > from && e.value.from <= to) && e.value.to > to) {
                    e.value.from = from
                    removeUnderline(e.value.from, e.value.to)
                    isMarked = false
                } else if (e.value.from < from && e.value.to > to) {
                    removeUnderline(e.value.from, e.value.to)
                    isMarked = false
                } else if (e.value.from > from && e.value.to < to) {
                    removeUnderline(e.value.from, e.value.to)
                    underlines = createUnderline(from, e.value.from)
                    underlines = createUnderline(e.value.to, to)
                    isMarked = true
                    isRemove = false
                } else {
                    isMarked = true
                }
            })

            if (!isMarked) {
                underlines = createUnderline(e.value.from, e.value.to)
            } else {
                isRemove && removeUnderline(e.value.from, e.value.to)
            }
        }
    }

    return underlines;
}
```

结果：

![[动画2 75.gif]]

#### 实现移除标记时将单词左右空白符一同去掉逻辑

要实现这一功能，在判断出是在标记内部选中部分区域进行移除的同时，我们需要检查区域边界情况：如果左右两边包含空格就将空格一同移除。

要判断选区的边界是否包含空格，我们需要从选区的头部和锚点进行向外延伸，如果第一字符不为空格就不作处理，如果是空格则进一步判断空格的数量，直到不为空格为止（当然这里会出行首和行尾的特殊情况）。

前面我们所有的判断依据都是选区的起始位置，现在要判断空格的话就需要获取文本的内容了。选区所在行的信息可以通过 `tr.state.doc.lineAt(e.value.from)` 来获取，边界空白我们直接从选区起始位置遍历即可。下面我们将获取边界空白的逻辑封装成一个函数 `getSpaceCountOfWord(from, to)`，位置同前面的 `removeUnderline` 和 `createUnderline` 函数。

```ts
const getSpaceCountOfWord = (from: number, to: number): [number, number] => {
    const line = tr.state.doc.lineAt(from)
    const start = from - line.from
    const end = to - line.from
    let startSpaceCount = 0
    let endSpaceCount = 0

    // 计算左侧空格数
    for (let i = start - 1; i >= 0 && line.text[i] === ' '; i--) {
        startSpaceCount++
    }

    // 计算右侧空格数
    for (let i = end; i < line.text.length && line.text[i] === ' '; i++) {
        endSpaceCount++
    }

    return [startSpaceCount, endSpaceCount]
}
```

接着修改标记处理逻辑：

```ts
// ...
} else if (e.value.from > from && e.value.to < to) {
    // 处理标记内要移除的部分左右包含空格的情况
    const [lsc, rsc] = getSpaceCountOfWord(e.value.from, e.value.to)
    removeUnderline(e.value.from, e.value.to)
    underlines = createUnderline(from, e.value.from - lsc)
    underlines = createUnderline(e.value.to + rsc, to)
    isMarked = true
    isRemove = false
} else {
// ...
```

效果如下：

![[动画2 76.gif]]

至此，我们已完成现阶段所有的功能实现。

## 在 Obsidan 中验证效果

现在我们将已经写好的 `Underline.ts` 文件复杂到 Obsidian 插件项目中去，然后将 `main.ts` 修改为：

```ts
import { Plugin } from 'obsidian';
import { underlineKeymap } from './Underline'


export default class MyPlugin extends Plugin {
	async onload() {
		this.registerEditorExtension([underlineKeymap])
	}
}
```

然后使用 `npm run dev` 运行后，效果如下：

![[动画2 77.gif]]

>[!bug] 这里所有的操作都是基于内存的缓存内容，不会实际保存在 Obsidian 仓库中。目前所者所掌握的知识有限，这里表示致歉，后续再来变更此部分的内容。

## 实现光标位置直接添加/移除标记

这一部分内容的实现相比前面的通用功能要复杂一些，因为我们要实现光标位置处的单词识别——对于中文我们需要进行分词后再匹配文本。

通用部分功能实现主要是在 `StateField.define` 定义的 `update` 方法中进行逻辑判断地，这个的触发前提是：有选区，并使用了快捷键。然而我们现在要实现的功能是没有选区，只有光标位置，所以只能在 `underlineSelection` 函数中进行逻辑实现。

现在我们来将 `underlineSelection` 函数的逻辑调整为：

```ts
export function underlineSelection(view: EditorView) {
    let effects: StateEffect<unknown>[] = []
    // 中文字符正则
    const zhReg = /\p{sc=Han}/ug
    // 光标所在位置
    const cursor = view.state.selection.main
    // 已标记的 Decoration 集合
    const underlines = view.state.field(underlineField, false)
    // 光标所在的行信息
    const line = view.state.doc.lineAt(cursor.head)
    // 光标右则的第一字符
    const textAtCursorRight = line.text.slice(cursor.head, cursor.head + 1)

    // 空行不作处理
    if (line.from === line.to) return

    // 光标位于标记处
    if (underlines) {
        if (cursor.empty) {
            // 光标右侧有中文字符
            if (zhReg.test(textAtCursorRight)) {
				// ④
            } else {
				// ②
            }
        } else {

        }
    } else { // 光标处于非标记处
        if (cursor.empty) {
            const head = cursor.head

            // 光标右侧有中文字符
            if (zhReg.test(textAtCursorRight)) {
				// ③
            } else {
				// ①
            }
        } else {
			// 这时走的是 underlineField 的 update 函数
        }
    }

    if (!effects.length) {
        effects = view.state.selection.ranges
            .filter(r => !r.empty)
            .map(({ from, to }) => addUnderline.of({ from, to }))
    }

    if (!effects.length) return false

    if (!view.state.field(underlineField, false)) {
        effects.push(StateEffect.appendConfig.of([
            underlineField,
            underlineTheme
        ]))
    }

    view.dispatch({ effects })
    return true
}
```

上述代码中存在很多条件判断逻辑：

我们首先判断了光标所在位置是否包含标记，然后再判断是否有选区，这二个逻辑的先后顺序也可以反过来不影响后续逻辑；然后，在非选区的情况下，我们还需要判断光标右侧是中文还是英文，两者的处理逻辑不一样。

我们先来处理光标位置英文字符左侧（从前面的测评可以知道，都是选择光标右侧文本）的情况。这里我们来实现一个从光标处获取单词选区起始位置的封装函数 `getEnWordAtCuror`：

```ts
/**
 * 获取光标位置所在的英文单词的起始和结束位置
 * @param text 光标所在行文本
 * @param pos 光标位置
 * @param base 行起始位置
 * @returns 光标位置所在的英文单词的起始和结束位置
 */
function getEnWordAtCursor(text: string, pos: number, base = 0): { start: number, end: number } {
    pos = pos - base
    const left = text.slice(0, pos).match(/(?<=\b)\w+$/)
    const right = text.slice(pos, text.length).match(/^\w+(?=\b)/)
    if (left && right) {
        const start = pos - left[0].length + base
        const end = pos + right[0].length + base
        return { start, end }
    } else if (!left && right) {
        return { start: pos + base, end: pos + right[0].length + base }
    } else if (left && !right) {
        return { start: pos - left[0].length + base, end: pos + base }
    } else {
        return { start: pos + base, end: pos + base }
    }
}
```

函数中我们通过正则来匹配光标左右是否包含英文单词。以 `amet, cons|ectetur adipisicing` 为例（其中 `|` 表示光标位置），正则 `/(?<=\b)\w+$/` 用于匹配 `cons`，不包含单词边界；正则 `/^\w+(?=\b)/` 用于匹配 `ectetur`，同样不包含单词边界。最后，我们根据光标左右是否有匹配的结果来计算位置。

然后我们在前端代码注释「标记①」处添加以下代码：

```ts
const { start, end } = getEnWordAtCursor(line.text, head, line.from)
effects.push(addUnderline.of({ from: start, to: end }))
```

测试一下：

![[动画2 78.gif]]

从结果来看，目前只能添加一次，因为已有标记后就会走另外的执行逻辑。下面我们来实现已有标记情况下的添加逻辑，在「标记②」处同样添加：

```ts
const { start, end } = getEnWordAtCursor(line.text, cursor.head, line.from)
effects.push(addUnderline.of({ from: start, to: end }))
```

再测试一下：

![[动画2 79.gif]]

注意：我们这里的实现，光标位于行首会选择右边单词；位于行尾会选择左侧单词。在 GIF 截图中并未体现出来。

接下来我们来处理中文的情况，在开始前我们需要安装一个分词库：[结巴中文分词](https://github.com/fxsjy/jieba)。

### 结巴中文分词库安装

在结巴中文分词的 Github 上我们找到 Node.js 的版本：[yanyiwu/nodejieba](https://github.com/yanyiwu/nodejieba)。根据其 README 中的说明，我们使用 `npm install nodejieba` 来安装，然后就遇到下面的报错：

![[企业微信截图_17213783331883.png]]

官方文档下面提供了一些安装问题的参考，但是时间都停留在 2016 年，尝试了一番并没有得到有效解决。然后在官方文档中还发现了一个相关项目：[@node-rs/jieba](https://github.com/napi-rs/node-rs/tree/master/packages/jieba)，使用 `npm i node-rs/jieba` 安装一下，成功了。

然后，我们直接在 `Underline.ts` 代码中引入来测试一下：

```ts
import { cut, load } from '@node-rs/jieba'

load()
cut('我们中出了一个叛徒', false)
```

结果，报了以下错误：

![[Pasted image 20240719165412.png]]

根据报错提示，我们在 `vite.config.ts` 中进行了修改：

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            external: ['@node-rs/jieba-wasm32-wasi']
        }
    }
})
```

然后执行发现还是报了同样的错误，进一步分析报错可能是缺少这个库的包，于是执行 `@node-rs/jieba-wasm32-wasi`，再次运行又出现新的报错：

![[Pasted image 20240719170145.png]]

这个问题有点揪心，网上找了半天，最后使用 `npm i @node-rs/jieba-wasm32-wasi --force` 强制安装成功了。再次运行，又报了以下错误：

![[Pasted image 20240719171415.png]]

然后，对下载一个 Vite 插件 `npm i -D vite-plugin-top-level-await --force` 同时修改 `vie.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import topLevelAwait from 'vite-plugin-top-level-await'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), topLevelAwait()],
    build: {
        rollupOptions: {
            external: ['@node-rs/jieba-wasm32-wasi']
        }
    }
})
```

再次运行发现控制台没有报错了，但是（就你事多）在浏览器控制台报红了：

![[Pasted image 20240719171918.png]]

根据提示在 Chrome 属性中的【快捷方式】目录中添加 `"C:\Program Files\Google\Chrome\Application\chrome.exe" --enable-features=WebAssemblyUnlimitedSyncCompilation`。

现在运行应该不会报错了，但是这种方式并不适合实际项目（还需要另寻他法）。

### 添加中文处理逻辑

中文的处理上可能并不是想象地那么简单，因为在中文环境一段话可能包含多个重复的词语，在分词后我们需要找到光标所在位置最近的分词。

接下来，我们先处理「标记③」处的逻辑。

在这个条件分支说明光标右侧已经是中文文字（不包含中文标点符号）了，我们现在需要做的就是根据光标所在位置，像前面处理英文一样找到文字的边界。对于中文环境我们只需要将位于两个中文标点符号或者空白之前连续的文字获取到，然后传递给结巴分词，得到分词后的结果再进行标记即可。

根据前面处理获取光标处英文单词的逻辑，我们这里也封装一个函数 `getZhWordAtCursor`：

```ts
/**
 * 获取光标位置所在的中文词语的起始和结束位置
 * @param cursor 光标信息
 * @param view 编辑器视图
 * @returns 光标位置所在的中文词语的起始和结束位置
 */
function getZhWordAtCursor(cursor: SelectionRange, view: EditorView): { start: number, end: number } {
    const line = view.state.doc.lineAt(cursor.head)
    const textAtCursorRight = line.text.slice(cursor.head, cursor.head + 1)
    const reg = new RegExp(`\\p{sc=Han}*${textAtCursorRight}\\p{sc=Han}*`, "u")
    const match = line.text.match(reg)
    let start = cursor.head
    let end = cursor.head

    if (match && match.length > 0) {
        const matchText = match[0]
        const splitWords = cut(matchText)
        const targetWord = splitWords.find(w => w.includes(textAtCursorRight)) || ''
        const index = targetWord.indexOf(textAtCursorRight)
        if (index > -1) {
            if (index === 0) {
                start = line.from + cursor.head
                end = line.from + cursor.head + targetWord.length
            } else if (index === targetWord.length - 1) {
                start = line.from + cursor.head - index
                end = line.from + cursor.head + 1
            } else {
                start = line.from + cursor.head - index
                end = line.from + cursor.head + targetWord.length - index
            }
        }
    }

    return { start, end }
}
```

>[!danger] 函数中处理光标匹配就近的分词结果可能不太严谨，作者并没有去测试，可能存在问题。

接着我们在「标记③」和「标记④」处同时添加以下代码：

```ts
const { start, end } = getZhWordAtCursor(cursor, view)
effects.push(addUnderline.of({ from: start, to: end }))
```

测试一下：

![[动画2 80.gif]]

唉！还是问题很多，通过断点发现我们在前面 `underlines.between` 里面第 4 个分支语句中，未包含右边界重合的情况，因此需要调整逻辑：

```ts
// ...
} else if (e.value.from >= from && e.value.to <= to) {
    const [lsc, rsc] = getSpaceCountOfWord(e.value.from, e.value.to)
    // 处理标记内要移除的部分左右包含空格的情况
    if (e.value.from > from && e.value.to < to) {
        removeUnderline(e.value.from, e.value.to)
        underlines = createUnderline(from, e.value.from - lsc)
        underlines = createUnderline(e.value.to + rsc, to)
    } else if (e.value.from === from && e.value.to === to) {
        removeUnderline(e.value.from, e.value.to)
    } else if (e.value.from === from) {
        removeUnderline(from, to)
        underlines = createUnderline(e.value.to + rsc, to)
    } else if (e.value.to === to) {
        removeUnderline(from, to)
        underlines = createUnderline(from, e.value.from - lsc)
    }
    isMarked = true
    isRemove = false
} else {
// ...
```

再验证一下：

![[动画2 81.gif]]

到目前为止基本实现了我们想要的功能，只不过测试用例比较简单。从上面这个 GIF 中可以看出：当一个单词只标记了部分，光标位于其非标记位置处理有问题，示例如下：

![[Pasted image 20240719191535.png]]

针对这种情形我再多加一个判断分支将整个单词加上标记：

```ts
// ...
} else if (e.value.from === from && e.value.to > to) {
    removeUnderline(from, to)
    isMarked = false
} else {
// ...
```

行文至此，告一段落。下面是现阶段完整地实现代码：

```ts
import { SelectionRange, StateEffect, StateField } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView, keymap } from "@codemirror/view";
import { cut } from '@node-rs/jieba'


const addUnderline = StateEffect.define<{from: number, to: number}>()

export const underlineField = StateField.define<DecorationSet>({
    create() {
        return Decoration.none;
    },
    update(underlines, tr) {
        underlines = underlines.map(tr.changes)
        
        const removeUnderline = (from: number, to: number) => {
            underlines = underlines.update({
                filter: (f: number, t: number) => !((f >= from && t <= to) || (f < from && t > to))
            })
        }

        const createUnderline = (from: number, to: number) => {
            return underlines.update({
                add: [underlineMark.range(from, to)]
            })
        }

        const getSpaceCountOfWord = (from: number, to: number): [number, number] => {
            const line = tr.state.doc.lineAt(from)
            const start = from - line.from
            const end = to - line.from
            let startSpaceCount = 0
            let endSpaceCount = 0
        
            // 计算左侧空格数
            for (let i = start - 1; i >= 0 && line.text[i] === ' '; i--) {
                startSpaceCount++
            }

            // 计算右侧空格数
            for (let i = end; i < line.text.length && line.text[i] === ' '; i++) {
                endSpaceCount++
            }

            return [startSpaceCount, endSpaceCount]
        }

        for (let e of tr.effects) {
            if (e.is(addUnderline)) {
                let isMarked = false
                let isRemove = true
                underlines.between(e.value.from, e.value.to, (from, to) => {
                    if ((e.value.from < from && e.value.to >= from) && e.value.to <= to) {
                        e.value.to = to
                        removeUnderline(e.value.from, e.value.to)
                        isMarked = false
                    } else if ((e.value.from > from && e.value.from <= to) && e.value.to > to) {
                        e.value.from = from
                        removeUnderline(e.value.from, e.value.to)
                        isMarked = false
                    } else if (e.value.from < from && e.value.to > to) {
                        removeUnderline(e.value.from, e.value.to)
                        isMarked = false
                    } else if (e.value.from >= from && e.value.to <= to) {
                        const [lsc, rsc] = getSpaceCountOfWord(e.value.from, e.value.to)
                        // 处理标记内要移除的部分左右包含空格的情况
                        if (e.value.from > from && e.value.to < to) {
                            removeUnderline(e.value.from, e.value.to)
                            underlines = createUnderline(from, e.value.from - lsc)
                            underlines = createUnderline(e.value.to + rsc, to)
                        } else if (e.value.from === from && e.value.to === to) {
                            removeUnderline(e.value.from, e.value.to)
                        } else if (e.value.from === from) {
                            removeUnderline(from, to)
                            underlines = createUnderline(e.value.to + rsc, to)
                        } else if (e.value.to === to) {
                            removeUnderline(from, to)
                            underlines = createUnderline(from, e.value.from - lsc)
                        }
                        isMarked = true
                        isRemove = false
                    } else if (e.value.from === from && e.value.to > to) {
                        removeUnderline(from, to)
                        isMarked = false
                    } else {
                        isMarked = true
                    }
                })

                if (!isMarked) {
                    underlines = createUnderline(e.value.from, e.value.to)
                } else {
                    isRemove && removeUnderline(e.value.from, e.value.to)
                }
            }
        }

        return underlines;
    },
    provide: f => EditorView.decorations.from(f)
})

const underlineMark = Decoration.mark({class: "cm-underline"})

const underlineTheme = EditorView.baseTheme({
    ".cm-underline": { textDecoration: "underline 3px red" }
})


export function underlineSelection(view: EditorView) {
    let effects: StateEffect<unknown>[] = []
    // 中文字符正则
    const zhReg = /\p{sc=Han}/ug
    // 光标所在位置
    const cursor = view.state.selection.main
    // 已标记的 Decoration 集合
    const underlines = view.state.field(underlineField, false)
    // 光标所在的行信息
    const line = view.state.doc.lineAt(cursor.head)
    // 光标右则的第一字符
    const textAtCursorRight = line.text.slice(cursor.head, cursor.head + 1)

    // 空行不作处理
    if (line.from === line.to) return

    // 光标位于标记处
    if (underlines) {
        if (cursor.empty) {
            // 光标右侧有中文字符
            if (zhReg.test(textAtCursorRight)) {
                const { start, end } = getZhWordAtCursor(cursor, view)
                effects.push(addUnderline.of({ from: start, to: end }))
            } else {
                const { start, end } = getEnWordAtCursor(line.text, cursor.head, line.from)
                effects.push(addUnderline.of({ from: start, to: end }))
            }
        } else {

        }
    } else { // 光标处于非标记处
        if (cursor.empty) {
            const head = cursor.head

            // 光标右侧有中文字符
            if (zhReg.test(textAtCursorRight)) {
                const { start, end } = getZhWordAtCursor(cursor, view)
                effects.push(addUnderline.of({ from: start, to: end }))
            } else {
                const { start, end } = getEnWordAtCursor(line.text, head, line.from)
                effects.push(addUnderline.of({ from: start, to: end }))
            }
        } else {
            // 这时走的是 underlineField 的 update 函数
        }
    }

    if (!effects.length) {
        effects = view.state.selection.ranges
            .filter(r => !r.empty)
            .map(({ from, to }) => addUnderline.of({ from, to }))
    }

    if (!effects.length) return false

    if (!view.state.field(underlineField, false)) {
        effects.push(StateEffect.appendConfig.of([
            underlineField,
            underlineTheme
        ]))
    }

    view.dispatch({ effects })
    return true
}

export const underlineKeymap = keymap.of([{
    key: "Alt-a",
    preventDefault: true,
    run: underlineSelection
}])

/**
 * 获取光标位置所在的英文单词的起始和结束位置
 * @param text 光标所在行文本
 * @param pos 光标位置
 * @param base 行起始位置
 * @returns 光标位置所在的英文单词的起始和结束位置
 */
function getEnWordAtCursor(text: string, pos: number, base = 0): { start: number, end: number } {
    pos = pos - base
    const left = text.slice(0, pos).match(/(?<=\b)\w+$/)
    const right = text.slice(pos, text.length).match(/^\w+(?=\b)/)
    if (left && right) {
        const start = pos - left[0].length + base
        const end = pos + right[0].length + base
        return { start, end }
    } else if (!left && right) {
        return { start: pos + base, end: pos + right[0].length + base }
    } else if (left && !right) {
        return { start: pos - left[0].length + base, end: pos + base }
    } else {
        return { start: pos + base, end: pos + base }
    }
}

/**
 * 获取光标位置所在的中文词语的起始和结束位置
 * @param cursor 光标信息
 * @param view 编辑器视图
 * @returns 光标位置所在的中文词语的起始和结束位置
 */
function getZhWordAtCursor(cursor: SelectionRange, view: EditorView): { start: number, end: number } {
    const line = view.state.doc.lineAt(cursor.head)
    const textAtCursorRight = line.text.slice(cursor.head, cursor.head + 1)
    const reg = new RegExp(`\\p{sc=Han}*${textAtCursorRight}\\p{sc=Han}*`, "u")
    const match = line.text.match(reg)
    let start = cursor.head
    let end = cursor.head

    if (match && match.length > 0) {
        const matchText = match[0]
        const splitWords = cut(matchText)
        const targetWord = splitWords.find(w => w.includes(textAtCursorRight)) || ''
        const index = targetWord.indexOf(textAtCursorRight)
        if (index > -1) {
            if (index === 0) {
                start = line.from + cursor.head
                end = line.from + cursor.head + targetWord.length
            } else if (index === targetWord.length - 1) {
                start = line.from + cursor.head - index
                end = line.from + cursor.head + 1
            } else {
                start = line.from + cursor.head - index
                end = line.from + cursor.head + targetWord.length - index
            }
        }
    }

    return { start, end }
}
```

## 代码重构

前面完结的代码有一个问题：选区与光标两种方式地处理逻辑分别位于 `underlineField` 和 `underlineSelection` 函数中，这显然不符合我们奉行地开发原则。

根据 Codemirror 6 的相关概念，我们在 `addUnderline` 定义位置添加一个 `removeUnderline` 的 Effect:

```ts
const removeUnderline = StateEffect.define<{from: number, to: number}>()
```

同时调整两处实现地逻辑，具体过程就不细说了，直接上结果（根据实际情况调整了部分代码）：

```ts
import { SelectionRange, StateEffect, StateField } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView, keymap } from "@codemirror/view";
import { cut } from '@node-rs/jieba'

const addUnderline = StateEffect.define<{from: number, to: number}>()
const removeUnderline = StateEffect.define<{from: number, to: number}>()

export const underlineField = StateField.define<DecorationSet>({
    create() {
        return Decoration.none;
    },
    update(underlines, tr) {
        underlines = underlines.map(tr.changes)

        for (let e of tr.effects) {
            if (e.is(addUnderline)) {
                underlines = underlines.update({
                    add: [underlineMark.range(e.value.from, e.value.to)]
                })
            } else if (e.is(removeUnderline)) {
                underlines = underlines.update({
                    filter: (from: number, to: number) =>
                        !((from >= e.value.from && to <= e.value.to) || (from < e.value.from && to > e.value.to))
                })
            }
        }

        return underlines;
    },
    provide: f => EditorView.decorations.from(f)
})

const underlineMark = Decoration.mark({class: "cm-underline"})

const underlineTheme = EditorView.baseTheme({
    ".cm-underline": { textDecoration: "underline 3px red" }
})


export function underlineSelection(view: EditorView) {
    let effects: StateEffect<unknown>[] = []
    // 中文字符正则
    const zhReg = /\p{sc=Han}/ug
    // 光标所在位置
    const cursor = view.state.selection.main
    // 已标记的 Decoration 集合
    const underlines = view.state.field(underlineField, false)
    // 光标所在的行信息
    const line = view.state.doc.lineAt(cursor.head)
    // 光标右则的第一字符
    const textAtCursorRight = line.text.slice(cursor.head, cursor.head + 1)

    // 空行不作处理
    if (line.from === line.to) return

    // 光标位于标记处
    if (underlines && underlines.size > 0) {
        if (cursor.empty) {
            // 光标右侧有中文字符
            if (zhReg.test(textAtCursorRight)) {
                const { start, end } = getZhWordAtCursor(cursor, view)
                effects.push(addUnderline.of({ from: start, to: end }))
            } else {
                const { start, end } = getEnWordAtCursor(line.text, cursor.head, line.from)
                const left = cursor.head - start
                const right = end - cursor.head
                // 遍历当前行中所有的标记位置
                underlines.between(line.from, line.to, (from, to) => {
                    // 光标位于选区中，移除标记（注意不包含光标位置选区尾部）
                    if (from <= cursor.head && to > cursor.head) {
                        effects.push(removeUnderline.of({ from, to }))
                    } else if (to === cursor.head) { // 处于上一个单词分界符后，同时位于当前单词开头
                        effects.push(removeUnderline.of({ from, to }))
                        effects.push(addUnderline.of({ from, to: cursor.to + right }))
                    } else if (from >= cursor.head - left && to <= cursor.head) { // 单词部分选中，光标位于单词右侧
                        effects.push(removeUnderline.of({ from, to }))
                        const newFrom = from > cursor.head - left ? cursor.head - left : from
                        effects.push(addUnderline.of({ from: newFrom, to: cursor.to + right }))
                    } else if (to >= cursor.head && to < cursor.to + right) { // 单词部分选中，光标位于单词左侧（注意不包含光标位置选区尾部）
                        effects.push(removeUnderline.of({ from, to }))
                        const newTo = to < cursor.to + right ? cursor.to + right : to
                        effects.push(addUnderline.of({ from: cursor.from - left, to: newTo }))
                    } else if (to <= cursor.from + right && cursor.head - left < to) { // 左边任意选区，光标位于右边单词内
                        effects.push(removeUnderline.of({ from, to }))
                        effects.push(addUnderline.of({ from, to: cursor.to + right }))
                    } else if (from >= cursor.from - left && cursor.to + right < cursor.from) { // 右边任意选区，光标位于左边单词内
                        effects.push(removeUnderline.of({ from, to }))
                        effects.push(addUnderline.of({ from: cursor.from - left, to }))
                    } else {
                        effects.push(addUnderline.of({ from: cursor.from - left, to: cursor.to + right }))
                    }
                })
            }
        } else {
            let start = cursor.from // 用于记录两个选区中间选择时第一个标记的起始位置
            underlines.between(cursor.from, cursor.to, (from, to, value) => {
                /**
                 *     |text|
                 * |____________|
                 */
                if (cursor.from < from && cursor.to > to) {
                    effects.push(removeUnderline.of({ from, to }))
                    effects.push(addUnderline.of({ from: cursor.from, to: cursor.to }))
                }
                
                /**
                 * |    text    |
                 * |____________|
                 */
                else if (cursor.from >= from && cursor.to <= to) {
                    const [lsc, rsc] = getSpaceCountOfWord(cursor.from, cursor.to, view)
                    if (cursor.from > from && cursor.to < to) { // 选区在单词中间
                        effects.push(removeUnderline.of({ from, to }))
                        effects.push(addUnderline.of({ from, to: cursor.from - lsc }))
                        effects.push(addUnderline.of({ from: cursor.to + rsc, to }))
                    } else if (cursor.from === from && cursor.to === to) { // 选区在单词边缘
                        effects.push(removeUnderline.of({ from: cursor.from, to: cursor.to }))
                    } else if (cursor.from === from) {
                        effects.push(removeUnderline.of({ from, to }))
                        effects.push(addUnderline.of({ from: cursor.to + rsc, to }))
                    } else if (cursor.to === to) {
                        effects.push(removeUnderline.of({ from, to }))
                        effects.push(addUnderline.of({ from, to: cursor.from - lsc }))
                    }
                }
                
                /**
                 *   | text |
                 * |_____|
                 */
                else if ((cursor.from < from && cursor.to >= from) && cursor.to <= to) {
                    effects.push(removeUnderline.of({ from, to }))
                    
                    if (underlines.size === 1) {
                        effects.push(addUnderline.of({ from: cursor.from, to }))
                    } else {
                        effects.push(addUnderline.of({ from: start, to }))
                    }
                }
                
                /**
                 *   | text |
                 *      |_____|
                */
               else if ((cursor.from > from && cursor.from <= to) && cursor.to > to) {
                    effects.push(removeUnderline.of({ from, to }))

                    if (underlines.size === 1) {
                        effects.push(addUnderline.of({ from, to: cursor.to }))
                    } else {
                        start = from
                    }
                } else {
                    effects.push(removeUnderline.of({ from, to }))
                }
            })
        }
    } else { // 光标处于非标记处
        if (cursor.empty) {
            const head = cursor.head

            // 光标右侧有中文字符
            if (zhReg.test(textAtCursorRight)) {
                const { start, end } = getZhWordAtCursor(cursor, view)
                effects.push(addUnderline.of({ from: start, to: end }))
            } else {
                const { start, end } = getEnWordAtCursor(line.text, head, line.from)
                effects.push(addUnderline.of({ from: start, to: end }))
            }
        } else {
            effects = view.state.selection.ranges.map(({ from, to }) => addUnderline.of({ from, to }))
        }
    }

    if (!effects.length) {
        effects = view.state.selection.ranges
            .filter(r => !r.empty)
            .map(({ from, to }) => addUnderline.of({ from, to }))
    }

    if (!effects.length) return false

    if (!view.state.field(underlineField, false)) {
        effects.push(StateEffect.appendConfig.of([
            underlineField,
            underlineTheme
        ]))
    }

    view.dispatch({ effects })
    return true
}

export const underlineKeymap = keymap.of([{
    key: "Alt-a",
    preventDefault: true,
    run: underlineSelection
}])

/**
 * 获取光标位置所在的英文单词的起始和结束位置
 * @param text 光标所在行文本
 * @param pos 光标位置
 * @param base 行起始位置
 * @returns 光标位置所在的英文单词的起始和结束位置
 */
function getEnWordAtCursor(text: string, pos: number, base = 0): { start: number, end: number } {
    pos = pos - base
    const left = text.slice(0, pos).match(/(?<=\b)\w+$/)
    const right = text.slice(pos, text.length).match(/^\w+(?=\b)/)
    if (left && right) {
        const start = pos - left[0].length + base
        const end = pos + right[0].length + base
        return { start, end }
    } else if (!left && right) {
        return { start: pos + base, end: pos + right[0].length + base }
    } else if (left && !right) {
        return { start: pos - left[0].length + base, end: pos + base }
    } else {
        return { start: pos + base, end: pos + base }
    }
}

/**
 * 获取光标位置所在的中文词语的起始和结束位置
 * @param cursor 光标信息
 * @param view 编辑器视图
 * @returns 光标位置所在的中文词语的起始和结束位置
 */
function getZhWordAtCursor(cursor: SelectionRange, view: EditorView): { start: number, end: number } {
    const line = view.state.doc.lineAt(cursor.head)
    const textAtCursorRight = line.text.slice(cursor.head, cursor.head + 1)
    const reg = new RegExp(`\\p{sc=Han}*${textAtCursorRight}\\p{sc=Han}*`, "u")
    const match = line.text.match(reg)
    let start = cursor.head
    let end = cursor.head

    if (match && match.length > 0) {
        const matchText = match[0]
        const splitWords = cut(matchText)
        const targetWord = splitWords.find(w => w.includes(textAtCursorRight)) || ''
        const index = targetWord.indexOf(textAtCursorRight)
        if (index > -1) {
            if (index === 0) {
                start = line.from + cursor.head
                end = line.from + cursor.head + targetWord.length
            } else if (index === targetWord.length - 1) {
                start = line.from + cursor.head - index
                end = line.from + cursor.head + 1
            } else {
                start = line.from + cursor.head - index
                end = line.from + cursor.head + targetWord.length - index
            }
        }
    }

    return { start, end }
}

/**
 * 获取单词左右边界空格数
 * @param from 选区起始位置
 * @param to 选区结束位置
 * @param tr Transaction
 * @returns 单词左右边界空格数
 */
function getSpaceCountOfWord(from: number, to: number, view: EditorView): [number, number] {
    const line = view.state.doc.lineAt(from)
    const start = from - line.from
    const end = to - line.from
    let startSpaceCount = 0
    let endSpaceCount = 0

    // 计算左侧空格数
    for (let i = start - 1; i >= 0 && line.text[i] === ' '; i--) {
        startSpaceCount++
    }

    // 计算右侧空格数
    for (let i = end; i < line.text.length && line.text[i] === ' '; i++) {
        endSpaceCount++
    }

    return [startSpaceCount, endSpaceCount]
}
```

> 补充说明：`getEnWordAtCursor()` 函数可替换为 `view.state.wordAt(cursor.head)` 返回的 `SelectionRange` 中的 `from` 和 `to` 属性中得到单词的位置信息。

## 总结

看似很小的一个功能，如果将其放大考虑到各种情况（本文只是包含部分常见地）需要处理的逻辑一下子就增加了很多代码量，但是对我们实现的光标位于单词中这种操作其实没有必要（不然别的应用早就实现了），保持最小可操作性就是最好地体验。

其它未未考虑的情况：1. 多光标操作时如何处理；2. 内容出现换行的情况。这里就不再深入去探索了。

最后，动动你发财的小手，关注，点赞一键三连，你的鼓励是我坚持下去的动力。有任何问题欢迎加作者微信（`jenemy_xl`）沟通交流一起成长或者加入读者交流微信群一起探讨 Obsidian 的使用技巧和资源分享。

更多内容，请关注我的专栏：[Obsidian 达人成长之路 - 知乎 (zhihu.com)](https://www.zhihu.com/column/c_1776563728286670848)