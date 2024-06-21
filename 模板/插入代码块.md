<%*
let content = tp.file.cursor()
if (tp.file.selection()) {
	content = tp.file.selection() + content
}
-%>
````
<% content %>
````
