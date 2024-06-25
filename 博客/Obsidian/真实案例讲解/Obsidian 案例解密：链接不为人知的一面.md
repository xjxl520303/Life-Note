---
created_at: 2024-06-25 11:40:39
---
具体实现：

````
<%*
const metaTagFile = "咨询二/标签元数据/标签"
const linkFolders = ["咨询二/重要事件"]

// 所有元数据标签
let metaTags;
// 所有使用链接的关键词
let linkKeys;

const fileCache = app.metadataCache.getFileCache(tp.file.find_tfile(metaTagFile))
metaTags = fileCache.tags.map(tag => tag.tag.replace(/#/, '')).sort((a, b) => b.length - a.length)

linkKeys = app.vault.getMarkdownFiles()
    .filter(file => file.path.startsWith(linkFolders))
    .map(file => file.basename)
    .sort((a, b) => b.length - a.length)

const tfile = tp.config.target_file
const linkReg = /\[([^\]]+)\]\(([^)]+)\)/g
const tagReg = /#([^\s]+)/g

const content = await app.vault.read(tfile)
const lines = content.split('\n')

const newLines =lines.map((line, index) => {
   if (!/#\s./.test(line) && line.trim() !== '') {
        return replaceTag(replaceLink(line))
   } else {
        return line
   }
})

await app.vault.modify(tfile, newLines.join('\n'))

function replaceLink(text) {
    const reg =new RegExp(`(?<!(?<=\\[\\[(?:.*?)).*(?=(?:.*?)\\]\\]))(${linkKeys.join('|')})(?!(?<=\\[\\[(?:.*?)).*(?=(?:.*?)\\]\\]))`, 'gm')
    return text.replace(reg, '[[$&]]')
}

function replaceTag(text) {
    const reg = new RegExp(`(?<!(?<=\\[\\[(?:.*?)).*(?=(?:.*?)\\]\\]))(${metaTags.join('|')})(?!(?<=\\[\\[(?:.*?)).*(?=(?:.*?)\\]\\]))`, 'gm')
    return text.replace(reg, ' #$& ')
}
_%>
````