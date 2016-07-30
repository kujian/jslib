/* author:758915145@qq.com
 * 最近修改: 2016/04/05
 * 更新内容:
 * 2016/03/02: 取消使用eval方法
 * 2016/04/03:
 * 修改 $.getEle为 $('.li')
 * 修改 $.getStyle为 $('.li').css
 * 其余的写法也均改为类似jquery的写法
 * 加入each方法
 * 支持连贯的写法: $('.li').nextAll().css()...
 * nextAll && prevAll 支持自定义个数如: nextAll(1)
 * 2016/04/04:
 * 使用each方法时可以传入参数: $('.li').each(function(variable){},variable)
 * css方法可以用来设置样式
 * 2016/04/05: 
 * 加入.and()方法
 * 优化animate的写法并加入默认400毫秒的动画时间
 * 修复IE6/IE7下不支持$('li')的bug
 */
isMobile = (a = navigator.userAgent.toLowerCase()) && (a.match(/ipad/i) == "ipad" || a.match(/iphone os/i) == "iphone os" || a.match(/midp/i) == "midp" || a.match(/rv:1.2.3.4/i) == "rv:1.2.3.4" || a.match(/ucweb/i) == "ucweb" || a.match(/android/i) == "android" || a.match(/windows ce/i) == "windows ce" || a.match(/windows mobile/i) == "windows mobile"), IE6 = !-[1, ] && !window.XMLHttpRequest, IE7 = navigator.userAgent.indexOf("MSIE 7.0") > 0;
~ function(window) {
	window.$ = function(selector, parent) {
		$.getEle = function(selector, parent) {
			if (!(IE6 || IE7)) {
				return parent ? parent.querySelectorAll(selector) : document.querySelectorAll(selector)
			} else {
				if (selector.indexOf("#") == 0) {
					return document.getElementById(selector.split("#")[1])
				} else if(selector.indexOf(".") == 0){
					objArr = parent ? parent.getElementsByTagName("*") : document.getElementsByTagName("*");
					var result = [], classArr = [];
					for (i = 0; i < objArr.length; i++) {
						classArr = objArr[i].className.split(" ");
						for (j = 0; j < classArr.length; j++) {
							if (classArr[j] == selector.split(".")[1]) {
								result.push(objArr[i])
							}
						}
					}
					return result
				}else{
					return document.getElementsByTagName(selector);
				}
			}
		};
		var elements = typeof selector == 'string' ? $.getEle(selector, parent) : selector;
		elements.css = function(styleName) {
			if(typeof styleName=='string'){
				var obj = elements[0] || elements;
				return obj.currentStyle ? obj.currentStyle[styleName] : obj.ownerDocument.defaultView.getComputedStyle(obj, null)[styleName]
			}else{
				elements.each(function(){
					for(var i in styleName){
						this.style[i]=styleName[i]
					}
				});
				return $(elements);
			}
		};
		elements.prevAll = function(num) {
			num = num || 0;
			var arr = [];
			var obj = elements[0] || elements;

			function prevAll(obj) {
				prev = obj.previousSibling;
				prev = prev != null && prev.nodeName == "#text" ? prev.previousSibling : prev;
				if (prev != null) {
					arr.push(prev);
					if (arr.length == num) return;
					prevAll(prev)
				}
			}
			prevAll(obj);
			return $(arr);
		};
		elements.nextAll = function(num) {
			num = num || 0;
			var arr = [];
			var obj = elements[0] || elements;

			function nextAll(obj) {
				next = obj.nextSibling;
				next = next != null && next.nodeName == "#text" ? next.nextSibling : next;
				if (next != null) {
					arr.push(next);
					if (arr.length == num) return;
					nextAll(next)
				}
			}
			nextAll(obj);
			return $(arr);
		};
		elements.each = function(fn,variable) {
			for (var i = 0; i < elements.length; i++) {
				~function(i) {
					fn.call(elements[i],variable);
				}(i);
			}
			return $(elements);
		};
		elements.animate = function(styleName, endValue, time, effect) {
			return elements.each(function() {
				var obj = this;
				effect=effect||"easeOutQuad";
				time=time||400;
				clearInterval(obj.setInterval);
				px = styleName == "opacity" ? "" : "px";
				obj.time = time, obj.styleValue = parseFloat($(obj).css(styleName)), obj.difference = endValue - obj.styleValue, obj.frequency = obj.time / 20, obj.setInterval = setInterval(function() {
					obj.frequency == 0 ?
						(obj.style[styleName] = endValue + px) && clearInterval(obj.setInterval) :
						obj.style[styleName] = easing[effect](0, obj.time - (obj.frequency-- * 20), obj.styleValue, obj.difference, obj.time) + px
				}, 20)
			});
		};
		elements.and=function(fn,variable){
			fn.call(elements,variable);
			return $(elements);
		};
		return elements;
	};
	window.$.ajax = function(obj) {
		function createXHR() {
			if (IE6) {
				version = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp", ];
				for (i = 0; i < version.length; i++) {
					try {
						return new ActiveXObject(version[i])
					} catch (e) {}
				}
			} else {
				return new XMLHttpRequest()
			}
		}

		function params(data) {
			c = [];
			for (i in data) {
				c.push(encodeURIComponent(i) + "=" + encodeURIComponent(data[i]))
			}
			return c.join("&")
		}
		var xhr = createXHR();
		obj.url = obj.url;
		obj.data = params(obj.data);
		if (obj.method === "get") {
			obj.url += obj.url.indexOf("?") == "-1" ? "?" + obj.data : "&" + obj.data
		}
		if (obj.async === true) {
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					callBack()
				}
			}
		}
		xhr.open(obj.method, obj.url, obj.async);
		if (obj.method === "post") {
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.send(obj.data)
		} else {
			xhr.send(null)
		}
		if (obj.async === false) {
			callBack()
		}

		function callBack() {
			if (xhr.status == 200) {
				obj.success(xhr.responseText)
			} else {
				obj.Error("获取数据失败，错误代号为：" + xhr.status + "错误信息为：" + xhr.statusText)
			}
		}
	}
	var easing = {
		easeOutQuad: function(x, t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b
		}
	};
}(window);
