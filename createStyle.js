/**
 * 创建一个兼容IE和W3c的内嵌样式
 * @param  {string} rootStyle 添加你想要显示的样式表如 var style="body{font-size:14px;}";
 * @return {[type]}           
 */
function createStyle(rootStyle){
	var rootItem = document.createElement('style'),
	head = document.head || document.getElementsByTagName('head')[0];
	rootItem.type="text/css";
	if(rootItem.styleSheet){
	rootItem.styleSheet.disabled||(rootItem.styleSheet.cssText=rootStyle)
	}else{
	try{rootItem.innerHTML=rootStyle}catch(f){rootItem.innerText=rootStyle}
	}
	head.appendChild(rootItem);
}
