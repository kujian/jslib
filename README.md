##JavaScript兼容性代码汇总


**以前新建的文件等待整理添加使用说明和详解，后面如果有新增文件将会更新这个文件，保持清晰的记录，1.说明描述，2，代码使用，3，结果**


## 创建内嵌样式表 createStyle.js （2016.6.2）

### 使用例子
```
var style = "body{font-size:14px; color:#333;}";
createStyle(style);
```
创建后的代码将在文档的head中添加内嵌的样式表
