<%*
const config = {
    "新增": `{++${tp.file.selection()}${tp.file.cursor()}++}`,
    "删除": `{--${tp.file.selection()}${tp.file.cursor()}--}`,
    "改动": `{~~${tp.file.cursor(1)}~>${tp.file.cursor(2)}~~}`,
    "批注": `{>>${tp.file.selection()}${tp.file.cursor()}<<}`,
    "高亮": `{==${tp.file.selection()}${tp.file.cursor()}==}`,
}
const key = await tp.system.suggester(k => k, Object.keys(config)) || "新增"
_%>
<%- config[key] -%>