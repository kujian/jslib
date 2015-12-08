 /*** block/common.js start ***/
window.isIE6  = !!window.ActiveXObject && !window.XMLHttpRequest;

var commonJs = {
	/**
	 * setloginlink : 设置第三方登录链接
	 * 参数 : obj=父容器DOM元素
	 * 说明 : 登录链接类名为 login-QQ login-weibo login-taobao
	 */
	setloginlink : function(obj){
		var qqlink = pc.getElem(".login-QQ",obj);
		var weibolink = pc.getElem(".login-weibo",obj);
		var taobaolink = pc.getElem(".login-taobao",obj);
		if(qqlink) qqlink.href = "http://my.pconline.com.cn/passport/opens/authorize.jsp?type=qzone_online&return=" + location.href;
		if(weibolink) weibolink.href = "http://my.pconline.com.cn/passport/opens/authorize.jsp?type=sina_online&return=" + location.href;
		if(taobaolink) taobaolink.href = "http://my.pconline.com.cn/passport/opens/authorize.jsp?type=taobao_online&return=" + location.href;
	},
	/**
	 * isloginstate : 判断是否登录
	 * 返回 : 用户名或false
	 */
	isloginstate : function(){
		if(pc.getCookie(pageGlobal.sessionname)){
			if(pc.getCookie(pageGlobal.cmuname)){
				return pc.getCookie(pageGlobal.cmuname);
			}else{
				return "";
			}
		}else{
			return false;
		}
	},
	//跳转到登录页
	gotoLoginPage : function(){
		window.location.href = "http://my.pconline.com.cn/passport/login.jsp?return=" + window.location.href;
	},
	/**
	 * getfaceUrl : 获取用户头像
	 * 参数 : 用户id
	 */
	getfaceUrl : function(uid){
		if (typeof(uid) != "undefined") {
			if (typeof(uid) != "string") uid = uid.toString();
			var picPath = "http://i7.3conline.com/images/upload/upc/face/";
			for (var i = 0, s = uid.length; i < s; i++) {
				var k = (i + 2) <= s ? (i + 2) : (i + 1);
				picPath += uid.substring(i, k) + "/";
				i++;
			}
			return picPath + uid + "_100x100";
		}
	},
	/**
	 * getNickname : 获取用户昵称
	 * 参数 : 用户ID
	 */
	getNickname : function(uid){
		var rlt = "";
		pc.ajax({
			url: pageGlobal.root + commonVar.userjsonSrc + "?id=" + uid,
			type: "GET",
			async: false,
			dataType: "text",
			success:function(data){			
				var datajson = toolJs.evalJson(data);
				if(datajson.userId != 0){
					if(datajson.nickname){
						rlt = datajson.nickname;
					}else{
						rlt = datajson.name;
					}
				}
			}
		});
		return rlt;
	},
	/**
	 * hoverClass : 鼠标经过添加样式
	 * 参数 : ele=元素 cname=类名 istimeout=是否延迟（默认为true）
	 */
	hoverClass : function(ele,cname,istimeout){
		if(typeof istimeout == "undefined"){
			var istimeout = true
		}
		var ele = pc(ele);
		var timeobj = null;
		if(istimeout){
			ele.addEvent("mouseover",function(){
				clearTimeout(timeobj);
				timeobj = setTimeout(function(){
					ele.addClass(cname);
				}, 200)
			})
			ele.addEvent("mouseout",function(){
				clearTimeout(timeobj);
				timeobj = setTimeout(function(){
					ele.removeClass(cname);
				}, 200)
			})
		}else{
			ele.addEvent("mouseover",function(){
				ele.addClass(cname);
			})
			ele.addEvent("mouseout",function(){
				ele.removeClass(cname);
			})
		}
	},
	/**
	 * update:20150601 liulong 增加timeout时间选择
	 * triggleDisplay : 鼠标经过显示隐藏
	 * 参数 : fromele=触发元素 toele=显示元素
	 */
	triggleDisplay : function(fromele,toele,istimeout,time){
		if(istimeout){
			var timeobj = null;
			if(time===undefined){
				time=200;
			}
			pc.addEvent(fromele,"mouseover",function(){
				clearTimeout(timeobj);
				timeobj = setTimeout(function(){
					pc(toele).show();
				}, time);
			})
			pc.addEvent(fromele,"mouseout",function(){
				clearTimeout(timeobj);
				timeobj = setTimeout(function(){
					pc(toele).hide();
				}, time);
			})
		}else{
			pc.addEvent(fromele,"mouseover",function(){
				pc(toele).show();
			})
			pc.addEvent(fromele,"mouseout",function(){
				pc(toele).hide();
			})
		}
	},
	/**
	 * toggleClass : 切换样式名
	 * 参数 : ele=元素 cname=类名
	 */
	toggleClass : function(ele,cname){
		if(pc.hasClass(ele,cname)){
			pc.removeClass(ele,cname);
		}else{
			pc.addClass(ele,cname);
		}
	},
	/**
	 * getElemByData : 通过属性猎取元素
	 * 参数 : cname=元素类名 attr=属性名 value=属性值
	 * 返回 : dom or null
	 */
	getElemByData : function(cname,attr,value){
		var eles = pc.getElems("." + cname);
		var rlt = null;
		if(eles.length > 0){
			pc.each(eles,function(ele){
				if(ele.getAttribute(attr) && ele.getAttribute(attr) == value){
					rlt = ele;
					return false;
				}
			})
		}
		return rlt;
	},
	/**
	 * getElemsByData : 通过属性名获取元素集
	 * 参数 : cname=元素类名 attr=属性名
	 * 返回 : array
	 */
	getElemsByData : function(cname,attr,value){
		var eles = pc.getElems("." + cname);
		var rlt = [];
		if(eles.length > 0){
			pc.each(eles,function(ele){
				if(ele.getAttribute(attr)){
					if(value){
						if(ele.getAttribute(attr) == value){
							rlt.push(ele);
						}
					}else{
						rlt.push(ele);
					}
				}
			})
		}
		return rlt;
	},
	//页面重定向
	pageRedirect : function(url){
		window.location.href = pageGlobal.root + "redirect.do?url=" + encodeURI(url);
	},
	//弹窗提醒
	alertMessage : function(text,action,url){
		var popaction = action || 'popClose';
		new Popbox({
			el: function(){
				return '<div class="alertbox"><div class="pop-header" data-event="popDrag"><span class="pop-header-title">系统提示</span><a href="javascript:;" class="pop-header-close" data-event="'+popaction+'"></a></div><div class="pop-info"><div class="tips-info">'+text+'</div></div><div class="pop-footer"><a href="javascript:;" class="pop-submit" data-event="'+popaction+'">确定</a></div></div>';
			},
			style: {
				width: '350px'
			},
			events: {
				'click#popClose': function(e,el){
					this.remove();
				},
				'click#refresh': function(e,el){
					location.reload();
				},
				'click#redirect': function(e,el){
					location.href = url;
				}
			},
			dragable: true
		}).show();
	},
	confirmMessage : function(text,func){
		var confirmPop = new Popbox({
			el: function(){
				return '<div class="alertbox"><div class="pop-header" data-event="popDrag"><span class="pop-header-title">系统提示</span><a href="javascript:;" class="pop-header-close" data-event="popClose"></a></div><div class="pop-info"><div class="tips-info">'+text+'</div></div><div class="pop-footer"><a href="javascript:;" class="pop-submit" data-event="popClose,confirm">确定</a><a href="javascript:;" class="pop-cancel" data-event="popClose">取消</a></div></div>';
			},
			style: {
				width: '350px'
			},
			events: {
				'click#popClose': function(e,el){
					this.remove();
				},
				'click#confirm': func
			},
			dragable: true
		}).show();
	},
	tipMessage : function(text,isrefresh,url){
		var tippop = new Popbox({
			el: function(){
				return '<div class="alertbox"><div class="pop-info"><div class="tips-info">'+text+'</div></div></div>';
			},
			style: {
				width: '350px'
			},
			overlay : false
		}).show();
		setTimeout(function(){
			tippop.remove();
			if(isrefresh){
				if(url){
					location.href = url;
				}else{
					location.reload();
				}
			}
		}, 1000);
	}
};
var toolJs = {
	// 获取元素偏移量
	getOffset : function(elem){
		var elLayout = elem.getBoundingClientRect(),
			stop = document.documentElement.scrollTop + document.body.scrollTop,
			sleft = document.documentElement.scrollLeft + document.body.scrollLeft;
		return {
			top: elLayout.top + stop,
			left: elLayout.left + sleft
		};
	},
	// 获取表单元素集合（不包含select）
	inputSelector : function(elem){
		// var convertNodelist = function(arr) {
		// 	var ret = [];
		// 	try {
		// 		ret = [].slice.call(arr);
		// 	} catch (e) {
		// 		for (var i = 0, l = arr.length; i < l; i++) {
		// 			ret.push(arr[i]);
		// 		}
		// 	}
		// 	return ret;
		// };
		var allinput = toolJs.toArray(elem.getElementsByTagName("input"));
		var alltextarea = toolJs.toArray(elem.getElementsByTagName("textarea"));
		// var allselect = convertNodelist(elem.getElementsByTagName("select"));
		// return allinput.concat(alltextarea).concat(allselect);

		// add by liulong 
		// note:select获取后序列化比较麻烦 现有的活动帖option值还需要处理 故最终决定先不采用序列化select
		return allinput.concat(alltextarea);
	},
	// 获取表单select
	getFormSelect : function(elem) {
		return toolJs.toArray(elem.getElementsByTagName("select"));
	},
	getSelectedOption : function(elem) {
		return elem.options[elem.selectedIndex];
	},
	setSelectedOption : function(elem, value, text) {
		try {
			var _options = elem.options,
				len = _options.length,
				i;

			if (text===null && value!==null) {
				for (i=0; i<len; i++) {
					if (_options[i].value === value) {
						_options[i].selected = true;
						break;
					}
				}
			} else if (value===null && text!==null) {
				for (i=0; i<len; i++) {
					if (_options[i].text === text) {
						_options[i].selected = true;
						break;
					}
				}				
			} else {
				for (i=0; i<len; i++) {
					if (_options[i].value===value && _options[i].text===text) {
						_options[i].selected = true;
						break;
					}
				}
			}
			if(i <= len) {
				return _options[i];
			}

		} catch(e) {
			throw e;
		}
		
	},
	// 序列化表单数据
	serialize : function(elem){
		var formitem = toolJs.inputSelector(elem);
		var temarr = [];
		var temstr;
		if(formitem.length > 0){
			for (var i = 0; i < formitem.length; i++) {
				temstr = formitem[i].getAttribute("name") + "=" + encodeURIComponent(formitem[i].value);
				
				temarr.push(temstr);
			}
			return temarr.join("&");
		}
	},
	// 判断是否空对象
	isBlankObj : function(obj){
		for(var i in obj){
			if(obj.hasOwnProperty(i)){
				return false;
			}
		}
		return true;
	},
	toArray : function(arr){ // 转换类数组集合成数组
		var ret = [];
			try {
				ret = [].slice.call(arr);
			} catch (e) { // ie
				for (var i = 0, l = arr.length; i < l; i++) {
					ret.push(arr[i]);
				}
			}
		return ret;
	},
	// 是否在数组里
	inArray : function(value,arr){
		for(var i = 0; i < arr.length; i++){
			if(arr[i] === value){
				return true;
			}
		}
		return false;
	},
	// 判断是否是日期
	isDate : function(obj){
		return obj && (typeof obj == 'object') && (obj.constructor == Date);
	},
	// 获取textarea文本长度
	getTextLength : function(ele){
		if(ele){
			return ele.value.replace(/\r?\n/g, '_').length;
		}
	},
	// 中文字数统计
	getTextCount : function(str){
		var rlt = str.replace(/[^\x00-\xff]/gi, "xx");
		return Math.floor(rlt.length / 2);
	},
	// 转换json字符串
	evalJson : function(str){
		if (str && typeof str == "string") {
			str = str.replace(/\r?\n/g,'');
			// str = str .replace(/^\s*/,'');
			return new Function("return "+ str)();
		}	
	},
	// 合并对象
	merge : function(obj,target){
		for(var i in target){
			if(target.hasOwnProperty(i)){
				obj[i] = target[i];
			}
		}
		return obj;
	},
	// 扩展对象
	extend : function(target, source, override) {
		if (override === undefined) override = true;
		for (var item in source) {
			if (source.hasOwnProperty(item) && (override || !(target.hasOwnProperty(item)))) {
				target[item] = source[item];
			}
		}
	},
	// 数组过滤重复项
	uniquearray : function(arr) {
		if (!arr && typeof arr !== 'Array') return [];
		var newArray = [];
		var len = arr.length;
		var temp = {};
		for (var i = 0; i < len; i++) {
			var item = arr[i];
			if (!temp[item]) {
				newArray.push(item);
				temp[item] = true;
			}
		}
		return newArray;
	},
	/**
	 * urlGenerator : 接接url
	 * 参数 : url=链接 params=参数对象 flag=是否URI编码
	 */
	urlGenerator : function(url, params, flag){
		var urlParams = '';
		if(url && url.indexOf('?') == -1){
			urlParams += '?';
		}else{
			urlParams +='&';
		}
		if(params && typeof params == "object"){
			for (var key in params){ 
				urlParams += key + "=" + params[key] + '&';
			}
		}
		urlParams = urlParams.replace(/&$/,"");
		if (flag) {
			urlParams = encodeURIComponent(urlParams);
		}
		return url + urlParams;
	},
	//取消默认行为
	preventDefault : function(e) {
	    if (e && e.preventDefault){
	    	e.preventDefault();
	    }else{
	    	window.event.returnValue = false;
	    }
	},
	//动态生成dom元素
	domGenerator : function(domString){
		var el,ret;
		if(pc.isString(domString)){
			try{
				el = document.createElement('div');
				el.innerHTML = domString;
				ret = pc.childElems(el)[0];
				return ret;
			}finally{
				el = ret = null;
			}
		}
	},
	getData : function(el, property){
		return 'dataset' in el ? el.dataset[property] : el.getAttribute('data-' + property);
	},
	setData : function(el, property, value){
		return 'dataset' in el ? (el.dataset[property] = value) : (el.setAttribute('data-' + property,value));
	}
};

// add by liulong
// note:之前方法扩展都写在toolJs和commonJs中，以后要逐渐细拆分出来

var extendJs = {
	tools: {
		need: function(url, fn) {
			if(typeof window.getScriptCache === 'undefined') {
				window.getScriptCache = {};
			}
			if(window.getScriptCache[url] === undefined) {
				pc.getScript(url, fn);
				window.getScriptCache[url] = url;
			} else {
				fn();
			}
			
		},
		stopPropagation : function(e) {
			if (window.event) {
				window.event.cancelBubble = true;
			} else {
				e.stopPropagation(); 
			}
		}
	},
	selector : {
		getParent : function(ele, selector) {
		    var x = ele.parentNode;  
		    if( x === null) {
		        return null;  
		    }
		    if(!!selector) {
		    	while (x) {
		            if (x.nodeType===1) {
		              break;
		            } else {
		               x = x.parentNode;  
		            }
		            return x;  
		        }
		    }
			if (/\./.test(selector)) {
				var _class = selector.replace(/\./ig,'');
		        while (x) {
		            if (x.nodeType===1 && x.className.indexOf(_class)!==-1) {
		                 // break;
		                 return x;
		            } else {
		                x = x.parentNode; 
		            }    
		        }
		        return x;  
			} else {
		        while (x) {
		            if (x.nodeType===1 && x.nodeName.toLowerCase()===selector) {
		              // break;
		              return x;  
		            } else {
		               x = x.parentNode;  
		            }
		            return x;  
		        }
		        
			}
		},
		getSiblings : function(el, selector) {
			var all = pc.siblings(el),
				tmpArr = [],
				i,
				len;
			if (/\./.test(selector)) { // class
				var _class = selector.replace(/\./ig,'');
				for (i = 0, len = all.length; i < len; i++) {
					if (all[i].className.indexOf(_class)!==-1) {
						tmpArr.push(all[i]);
					}
				}
			} else {
				for (i = 0, len = all.length; i < len; i++) {
					if (all[i].tagName.toLowerCase()===selector) {
						tmpArr.push(all[i]);
					}
				}
			}
			return tmpArr;
		},
		getPrevioussibling : function(el, nodename) {
	        var x = el.previousSibling;  
	        if( x === null) {
	            return null;  
	        }
	        while (x) {
	            if (x.nodeType!==1 || x.nodeName.toLowerCase()!==nodeName) {
	              x = x.previousSibling;  
	            } else {
	                break;
	            }
	        }
	        return x;  
	    },
		not : function(elems, selector) {
			var tmpArr = [],
				all = elems,
				len,
				i;
			if(typeof elems === 'string') {
				all = pc.getElems(elems);
			} 
			if (/\./.test(selector)) {
				var _class = selector.replace(/\./ig,'');
				for (i = 0, len = all.length; i < len; i++) {
					if (all[i].className.indexOf(_class)===-1) {
						tmpArr.push(all[i]);
					}
				}
			} else {
				for (i = 0, len = all.length; i < len; i++) {
					if (all[i].tagName.toLowerCase()!==selector) {
						tmpArr.push(all[i]);
					}
				}
			}
			return tmpArr;
		}
	},
	events : {
		delegate : function(delegateEle, selector, type, fn) {
			if (/\./.test(selector)) { // class
				pc.addEvent(delegateEle, type, function(event) {
					var _class = selector.replace(/\./ig,'');
					if (event.target.className.indexOf(_class)!==-1) {
						// fn(event.target, )
						fn.call(event.target,event);
					}
				});
			} else { // tag
				pc.addEvent(delegateEle, type, function(event) {
					if (event.target.tagName.toLowerCase()===selector) {
						fn.call(event.target,event);
					}
				});
			}
		}
	}
};


//placeholder
// var Placeholder = function(){
// 	var defClass = "placehold";
// 	function init(ele,def){
// 		var defValue = def || getDefault(ele) || "";
// 		ele.setAttribute("data-placeholder", defValue);
// 		bind(ele);
// 	}
// 	function bind(ele){
// 		if(ele.value == ""){
// 			setDefault(ele);
// 		}
// 		addEvent(ele,"focus",function(){
// 			if(ele.holder){
// 				ele.value = "";
// 				ele.className = ele.className.replace(defClass,"");
// 			}
// 		});
// 		addEvent(ele,"blur",function(){
// 			if (ele.value != ""){
// 				ele.holder = false;
// 			} else{
// 				setDefault(ele);
// 			}
// 		});
// 	}
// 	function addEvent(target, type, handler) {
// 		if (target.addEventListener)
// 			target.addEventListener(type, handler, false);
// 		else if (target.attachEvent)
// 			target.attachEvent('on' + type, handler);
// 	}
// 	function getDefault(ele){
// 		return ele.getAttribute("data-placeholder");
// 	}
// 	function setDefault(ele){
// 		ele.holder = true;
// 		ele.className += " " + defClass;
// 		ele.value = getDefault(ele);
// 	}
// 	return {
// 		run : init
// 	};
// }();


/*placeholder实现*/

function MakePlaceholder(defClass) {
    this.defClass = defClass ? defClass : 'placehold';

	this.run = function(ele, def){
	    var defValue = def || this.getDefault(ele) || "";
	    ele.setAttribute("data-placeholder", defValue);
	    this.bind(ele);
	};

	this.bind = function(ele) {
		var _self = this;
	    if(ele.value === ""){
	        _self.setDefault(ele);
	    }
	    _self.addEvent(ele,"focus",function(){
	        if(_self.curIsHolder(ele)){
	            ele.value = "";
	            ele.className = ele.className.replace(_self.defClass,"");
	        }
	    });
	    _self.addEvent(ele,"blur",function(){
	        if (ele.value !== ""){
	            // ele.holder = false;
	        } else {
	            _self.setDefault(ele);
	        }
	    });
	};

	this.addEvent = function(target, type, handler) {
	    if (target.addEventListener)
	        target.addEventListener(type, handler, false);
	    else if (target.attachEvent)
	        target.attachEvent('on' + type, handler);
	};

	this.getDefault = function(ele) {
	    return ele.getAttribute("data-placeholder");
	};

	this.setDefault = function(ele) {
		var _className = ele.className;
		ele.className = _className.indexOf(this.defClass)===-1 ? _className+" "+this.defClass : _className;
	    // ele.className += " " + this.defClass;
	    ele.value = this.getDefault(ele);
	};

	this.curIsHolder = function(ele) {
	    if (ele.value === this.getDefault(ele)) {
	        return true;
	    } else {
	        return false;
	    }
	};

	this.trim = function(str) {
		return str.replace(/(^\s*)|(\s*$)/g, "");
	};

	this.getPrevioussibling = function(n,nodeName) {
        var x = n.previousSibling;  
        if( x === null) {
            return null;  
        }
        while (x) {
            if (x.nodeType!==1 || x.nodeName.toLowerCase()!==nodeName) {
              x = x.previousSibling;  
            } else {
                break;
            }
        }
        return x;  
    };

}
var Placeholder = new MakePlaceholder();


/*** block/common.js end ***/
