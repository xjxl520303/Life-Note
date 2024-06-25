---
created_at: 2024-06-24 16:55:34
---
## 使用核心搜索插件查找内容

```
<%*
const query = '刘少奇'

// Perform the search
app.internalPlugins.plugins['global-search'].instance.openGlobalSearch(query)
const searchLeaf = app.workspace.getLeavesOfType('search')[0]
const search = await searchLeaf.open(searchLeaf.view)
const rawSearchResult = await new Promise(resolve => setTimeout(() => {
    resolve(search.dom.resultDomLookup)
}, 300)) // the delay here was specified in 'obsidian-text-expand' plugin; I assume they had a reason
const files = Array.from(rawSearchResult.keys())

console.log(files.map(x => x.path))
_%>
```