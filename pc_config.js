// alert('w-inds');

pc.scrollFloat = function(b, c, d) {
	var e = this,
		obj = this.dom.id(b),
		objWH = {
			'w': this.css(obj, 'width').replace(/px/gi, ''),
			'h': this.css(obj, 'height').replace(/px/gi, '')
		},
		posXY = this.abs.point(this.dom.id(c)),
		tempObj = this.dom.id('config_nav_temp'),
		leftNavObj = this.dom.id('left_nav'),
		tempId = '_' + b,
		createFloat = function() {
			var a = e.dom.create('div');
			a.id = tempId;
			a.className = obj.className;
			a.style.cssText = obj.style.cssText;
			a.innerHTML = obj.innerHTML;
			e.css(a, {
				'top': '0px',
				'left': '0px',
				'display': 'none',
				'width': (pc.browsers.fireFox || pc.browsers.isIE || pc.browsers.opera ? '168px' : '168px'),
				'position': e.browsers.isIE6 ? 'absolute' : 'fixed'
			});
			if (d) e.css(a, d);
			document.body.appendChild(a)
		},
		setTop = function() {
			var a = e.abs.scroll();
			posXY = e.abs.point(e.dom.id(c));
			if (a.top - posXY.y > 0) {
				if (e.browsers.isIE6) {
					e.css(obj, {
						'position': 'absolute',
						'top': a.top + 'px',
						'left': posXY.x + 'px'
					});
				} else {
					e.css(obj, {
						'position': 'fixed',
						'left': (posXY.x - a.left) + 'px',
						'top': '0px'
					});
					e.css(tempObj, 'display', 'block')
				}
				setHideOwnerPrices('block');
				$('#config_nav').addClass('operation-hov');
			} else {
				e.css(obj, {
					'position': 'relative',
					'left': '0px',
					'top': '0px'
				});
				e.css(tempObj, 'display', 'none');
				setHideOwnerPrices('none');
				$('#config_nav').removeClass('operation-hov');
			}
			//滚动时定位左导航的高亮
			var h3 = e.dom.tag('h3', e.dom.id('config_data'));
			var l = h3.length / 2;
			var li = e.dom.tag('li', leftNavObj);
			for (var i = 0; i < l; i++) {
				if ((e.abs.point(h3[l + i]).y - 95) <= (a.top + li[i].offsetTop)) {
					for (var j = 0; j < l; j++) {
						li[j].className = ""
					}
					li[i].className = "cur"
				}
			}
			//页面滚动到表格时，左导航跟随，及滚到底部页，限制跟随。
			var LH = e.abs.point(leftNavObj),
				RT = e.abs.point(e.dom.id("tab_1")),
				RB = e.abs.point(e.dom.id("tr_2003")),
				LY = leftNavObj.offsetHeight;
			if (a.top - RT.y + 100 >= 0 && RB.y - a.top >= LY) {
				if (e.browsers.isIE6) {
					e.css(leftNavObj, {
						'position': 'absolute',
						'top': a.top - 450 + 'px'
					});
				} else {
					e.css(leftNavObj, {
						'position': 'fixed',
						'left': (posXY.x - a.left) - 105 + 'px',
						'top': '99px'
					});
				}
			} else if (RB.y - a.top < LY) {
				if (e.browsers.isIE6) {
					e.css(leftNavObj, {
						'position': 'absolute',
						'top': 'auto',
						'bottom': '100px'
					});
				} else {
					e.css(leftNavObj, {
						'position': 'fixed',
						'left': (posXY.x - a.left) - 105 + 'px',
						'top': 'auto',
						'bottom': '324px'
					});
				}
			} else {
				e.css(leftNavObj, {
					'position': 'absolute',
					'left': -105 + 'px',
					'top': '57px'
				});
			}
			// 页面可视宽度小于1024时，隐藏左导航
			if (document.body.clientWidth - 1024 < 0) {
				leftNavObj.style.display = "none";
			} else {
				leftNavObj.style.display = "block";
			}
		},
		//页面横向滚动时，显示左属性栏
		setLeft = function() {
			var a = e.abs.scroll();
			posXY = e.abs.point(e.dom.id(c));
			if (a.left > posXY.x) {
				if (e.browsers.isIE6) e.css(obj, {
					'position': 'absolute',
					'display': 'block',
					'top': '0px',
					'left': (a.left - posXY.x) + 'px'
				});
				else e.css(obj, {
					'position': 'fixed',
					'display': 'block',
					'left': '0px',
					'top': (posXY.y - a.top) + 'px'
				})
			} else e.css(obj, 'display', 'none')
		},
		setAbs = function() {
			var a = e.abs.scroll(),
				div = e.dom.id(tempId);
			posXY = e.abs.point(e.dom.id(c));
			if (a.left > posXY.x) {
				if (e.browsers.isIE6) e.css(div, {
					'display': 'block',
					'top': (a.top == 0 ? (a.top + posXY.y) : (a.top < posXY.y ? posXY.y : a.top)) + 'px',
					'left': a.left + 'px',
					'border': '1px solid #D9E5F3',
					'fontSize': '12px'
				});
				else e.css(div, {
					'display': 'block',
					'top': (a.top == 0 ? posXY.y : (a.top < posXY.y ? posXY.y - a.top : 0)) + 'px',
					'left': '0px',
					'border': '1px solid #D9E5F3',
					'fontSize': '12px'
				})
			} else e.css(div, 'display', 'none')
		};
	this.top = function(a) {
		if (a) {
			setTop()
		} else {
			e.handler.addEvent(window, 'scroll', setTop);
			e.handler.addEvent(window, 'resize', setTop);
			e.handler.addEvent(window, 'load', setTop)
		}
	};
	this.left = function() {
		e.handler.addEvent(window, 'scroll', setLeft);
		e.handler.addEvent(window, 'resize', setLeft);
		e.handler.addEvent(window, 'load', setLeft);
		setLeft()
	};
	this.absTop = function(a) {
		if (a) {
			if (pc.browsers.isIE6) {
				e.css(this.dom.id(tempId), {
					'top': '0'
				})
			}
			setAbs()
		} else {
			if (!this.dom.id(tempId)) createFloat();
			e.handler.addEvent(window, 'scroll', setAbs);
			e.handler.addEvent(window, 'resize', setAbs);
			e.handler.addEvent(window, 'load', setAbs)
		}
	};
	return this
};

function setHideOwnerPrices(css) {
	var parent = pc.dom.id('config_nav'),
		elems = pc.dom.byClass('sys_ow', parent, 'span'),
		len = elems.length,
		i = 0;
	for (; i < len; i++) elems[i].style.display = css
};
var paramConfig = function(p, q) {
	var r = this,
		template = {
			nav: function() {
				return '<table cellspacing="0" cellpadding="0" class="tbset">' + ' <tbody>' + ' <tr>' + ' <th>' + ' <div id="config_setbox" class="setbox">' + ' <label><input type="checkbox" value="high" ' + (r.Data.high ? 'checked="checked"' : '') + ' name="radioShow">高亮显示差异参数</label>' + ' <label><input type="checkbox" value="hide" ' + (r.Data.hide ? 'checked="checked"' : '') + ' name="radioShow">隐藏相同参数</label>' + ' <label><input type="checkbox" value="noCon" ' + (r.Data.noCon ? 'checked="checked"' : '') + ' name="radioShow">隐藏暂无内容参数</label>' + ' <p>注：●标配 ○选配 -无</p>' + ' </div>' + ' </th>' + ' #LIST#' + ' </tr>' + ' </tbody>' + '</table>'
			}
		},
		curId = config.curId,
		configNav = pc.dom.id('config_nav'),
		configData = pc.dom.id('config_data'),
		configSide = pc.dom.id('config_side');
	this.Data = {
		carList: [],
		allList: [],
		allListname: [],
		engine: [],
		transmission: [],
		carStruct: [],
		qudong: [],
		ranliao: [],
		carNum: 0,
		hide: false,
		noCon: false,
		high: false,
		isPust: true,
		dealerPrice: {},
		colorList: {},
		innerColorList:{},
		userClickTR: [],
		isCheckBox: false,
		curSpecCss: '#FFF7DD',
		twolCell: {
			'发动机特有技术': 0,
			'前悬挂类型': 0,
			'后悬挂类型': 0
		},
		headTr: {
			'参配看图': 0
		},
		selectCom:[]

	};
	this.init = function() {
		if (!config || !option || !color || config.success != 1 || option.success != 1 || color.success != 1) return;
		this.isTop();
		this.dealerPrice();
		this.responseNav();
		this.setColor();
		this.responseContent();
		this.scrollFloat();
		this.selectEvent();
		this.MoveOrDel();
		this.checkboxInit();
		this.leftNav();
		this.tdHover();
		this.setDataSelectCom();
		this.contrastEvent();
		this.deleDataSelectCom();
	};
	this.setDataSelectCom = function(){
		var _that = this;
		setTimeout(function(){
			$('#config_nav').find('.carbox input').each(function(n){
				if($(this).hasClass('sContrasted')){
					_that.Data.selectCom.push(1);
				}else{
					_that.Data.selectCom.push(0);
				}
			});
			// console.log('初次化',_that.Data.selectCom);
		},0);
				
	};
	this.contrastEvent = function(){
		var _that = this;
		$('#config_nav .carbox-v2 input').live('click',function(){
			var index = Number($(this).attr('data-index'));
			if($(this).hasClass('sContrast')){
				_that.Data.selectCom[index] = 0;
			}else{
				_that.Data.selectCom[index] = 1;
			}
			// console.log('点击对比按钮',_that.Data.selectCom);
		});
	};
	this.deleDataSelectCom = function(){
		var _that = this;
		$('#JepCompare').live('click',function(){
			if(_that.Data.selectCom.length==0) return;
			for(var n=0,len = _that.Data.selectCom.length;n<len;n++){
				_that.Data.selectCom[n] = 0;
			}
			// console.log('删除对比数据',_that.Data.selectCom);
		});
	};
	this.setColor = function() {
		var a = color.body.items,
			len = a.length;
		for (var i = 0; i < len; i++) {
			this.Data.colorList[a[i].SpecId] = a[i]
		}
	};
	//增加内饰颜色变量
	this.setInnerColor=function(){
		var a = innerColor.body.items,
			len = a.length;
		for (var i = 0; i < len; i++){
			this.Data.innerColorList[a[i].SpecId] == a[i]
		}
	}
	this.dealerPrice = function() {
		if (!dealerPrices || dealerPrices.success != 1) return;
		var a = dealerPrices.body.item;
		if (a == null) return;
		for (var i = 0,
				len = a.length; i < len; i++) {
			var dealerMinPrice = a[i].MinPrice + '万';
			if (dealerMinPrice == '万') {
				dealerMinPrice = '暂无报价';
			}
			this.Data.dealerPrice[a[i].SpecId] = dealerMinPrice;
		}
	};
	this.scrollFloat = function(l) {
		if (l) {
			if (pc.browsers.isIE6) {
				var l = document["documentElement"].scrollLeft + document["body"].scrollLeft,
					t = document.body.scrollHeight,
					w = document["documentElement"].scrollTop + document["body"].scrollTop;
				if (t < w) {
					setTimeout(function() {
							var a = pc.abs.scroll();
							posXY = pc.abs.point(pc.dom.id('content'));
							pc.css(pc.dom.id('config_nav'), {
								'position': 'absolute',
								'top': a.top + 'px',
								'left': posXY.x + 'px'
							})
						},
						100);
					window.scrollTo(l, t)
				}
			}
			pc.scrollFloat('config_side', 'config_data').left();
			pc.scrollFloat('config_nav', 'content').top(true);
			pc.scrollFloat('config_setbox', 'content').absTop(true)
		} else {
			pc.scrollFloat('config_nav', 'content').top();
			pc.scrollFloat('config_side', 'config_data').left();
			pc.scrollFloat('config_setbox', 'content').absTop()
		}
	};
	this.responseNav = function(a) {
		var b = arguments.length,
			spaceColNum = 0,
			html = [],
			items = config.body.items[0].ModelExcessIds,
			ownerPrices = config.body.items[1].ModelExcessIds,
			len = items.length,
			_that = this,
			i = 0;
		this.Data.carList = [];
		this.Data.allList = [];
		this.Data.allListname = [];
		for (; i < len; i++) {
			this.Data.allList.push(items[i].Id);
			this.Data.allListname.push(items[i].Value);
			if (this.Data.isCheckBox && a.indexOf('-' + i + '-') == -1) continue;
			html.push('<td>');
			html.push('<div class="carbox carbox-v2">');
			// html.push('<a target="_self" rel="' + items[i].Id + '" class="del" href="javascript:void(0);">x</a>');
			if (items[i].jss == 1) {
				html.push('<span class="jss">将上市</span>');
			}
			html.push('<div><a href="http://price.pcauto.com.cn/m' + items[i].Id + '/" target="_blank">' + items[i].Value + '</a></div>');
			//如果车型的官方价分停售和即将上市两种情况显示
			if (chkDealerPrice([], ownerPrices[i].Id)) {
				html.push('<span class="sys_ow" style="display:none;">' + (ownerPrices[i].Value == '0.0万' || ownerPrices[i].Value == '-' || ownerPrices[i].Value == '万' ? '暂无报价' : "官方价：" + ownerPrices[i].Value + "(停售)") + '</span>');
			} else if (ownerPrices[i].jss == 1) {
				html.push('<span class="sys_ow" style="display:none;">' + (ownerPrices[i].Value == '0.0万' || ownerPrices[i].Value == '-' || ownerPrices[i].Value == '万' ? '暂无报价' : "预售价：" + ownerPrices[i].Value) + '</span>');
			} else {
				html.push('<span class="sys_ow" style="display:none;">' + (ownerPrices[i].Value == '0.0万' || ownerPrices[i].Value == '-' || ownerPrices[i].Value == '万' ? '暂无报价' : "官方价：" + ownerPrices[i].Value) + '</span>');
			}
			html.push('<p>');
			var pubUrl = "http://price.pcauto.com.cn/m"+items[i].Id+"/", 
				shorName = items[i].Value,
				picUrl = ownerPrices[i].photo, 
				price = ownerPrices[i].Value,
				smallTypeId = 10, 
				id = items[i].Id;

			html.push('<a target="_self" data-index="'+i+'" rel="' + items[i].Id + '" class="del" href="javascript:void(0);"></a>');

			// html.push('<a target="_self" rel="' + items[i].Id + '" onclick="javascript:compareBar.comparePro(this,\'http://price.pcauto.com.cn/m17779/\',\'2010款 1.0L 新版实用型短车身\',\'http://img.pconline.com.cn/images/upload/upc/tx/auto5/1201/19/c12/10240499_10240499_1326953516796_120x90.jpg\',\'2.98万\',10,17779)" name="compare_17779" class="sContrast"></a>');
			var compareBtnClassName = "sContrast";
			if(_that.Data.selectCom.length>0){
				compareBtnClassName = _that.Data.selectCom[i]==1?"sContrasted":"sContrast";
			}

			html.push('<input data-index="'+i+'" type="button" onclick="javascript:compareBar.comparePro(this,\''+pubUrl+'\',\''+shorName+'\',\''+picUrl+'\',\''+price+'\',\''+smallTypeId+'\',\''+id+'\')" name="compare_'+items[i].Id+'" class="'+compareBtnClassName+'">');

			html.push('<a rel="' + items[i].Id + '" class="switch_left" href="javascript:void(0);" title="左移"></a>');
			html.push('<a rel="' + items[i].Id + '" class="switch_right" href="javascript:void(0);" title="右移"></a>');
			html.push('</p>');
			html.push('</div>');
			html.push('</td>');
			this.Data.carList.push(items[i].Id)
		}
		spaceColNum = 0;
		for (var j = 0; j < spaceColNum; j++) {
			html.push('<td><div class="carbox"></div></td>')
		}
		this.Data.carNum = len;
		configNav.innerHTML = template.nav().replace('#LIST#', html.join(''));
		this.isShowMove()
	};
	this.isShowMove = function() {
		var a = pc.dom.tag('td', configNav),
			len = a.length,
			i = 0,
			endNum = 0;
		for (; i < len; i++) {
			if (pc.dom.byClass('del', a[i]).length > 0) {
				pc.css(pc.dom.byClass('switch_left', a[i], 'a')[0], 'display', '');
				pc.css(pc.dom.byClass('switch_right', a[i], 'a')[0], 'display', '');
				if (i == 0) pc.css(pc.dom.byClass('switch_left', a[i], 'a')[0], 'display', 'none');
				endNum = i
			}
		}
		if (pc.dom.byClass('switch_right', a[endNum], 'a').length > 0) pc.css(pc.dom.byClass('switch_right', a[endNum], 'a')[0], 'display', 'none')
	};
	this.getCharactersLen = function(a) {
		var b = 0,
			i = 0,
			len;
		len = a.length;
		for (; i < len; i++) {
			var c = a.charCodeAt(i);
			if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
				b++
			} else {
				b += 2
			}
		}
		return b
	};
	this.getCharacters = {
		len: function(a) {
			var n = 0,
				i = 0,
				l;
			l = a.length;
			for (; i < l; i++) {
				var c = a.charCodeAt(i);
				if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
					n++
				} else {
					n += 2
				}
			}
			return n
		},
		sub: function(a, b) {
			return a.replace(/([\u0391-\uffe5])/ig, '$1a').substring(0, b).replace(/([\u0391-\uffe5])a/ig, '$1')
		}
	};
	this.mainshow = function(a) {
		var c = pc.dom.id("content");
		var t = pc.dom.id("ctip");
		if (a == 0) {
			c.style.display = "block";
			t.style.display = "none";
		} else {
			t.style.display = "block";
			c.style.display = "none";
		}
	}
	this.responseContent = function(l) {
		if (r.Data.carNum == 0) {
			r.mainshow(1);
			return
		}
		var n = [],
			conHtml = [],
			paramesLen = arguments.length,
			spaceColNum = 0,
			clickTR = this.Data.userClickTR.join(','),
			twolCell = this.Data.twolCell;
		headTr = this.Data.headTr;
		n.push('<div style="display: none;" class="fdbox" id="config_side">');
		n.push('<table id="tab_side" cellspacing="0" cellpadding="0" class="tbcs">');
		n.push('<tbody>');
		var o = function(a) {
				var b = a,
					firstId = config.body.items[0].ModelExcessIds[0].Id;
				switch (a) {
					case '0':
						b = '-';
						break;
					case '1':
						b = '●';
						break;
					case '2':
						b = '○';
						break;
				}
				return b
			},
			getTrHtml = function(w, a, b, c, d, e) {
				if (a.Name == '排量(L)') return;
				var f = twolCell[a.Name] == 0 ? true : false;
				var hc = headTr[a.Name] == 0 ? true : false;
				if (c) d = 500 + d;
				var trClass = hc ? 'headTr ' : '';
				var g = 'javascript:void(0);';
				/* if (a.Name.indexOf("最小离地间隙") != -1){
				trClass = trClass+'fix-middle ';
				};
				if (a.Name.indexOf("接近角") != -1){
				trClass = trClass+'fix-middle ';
				};
				if (a.Name.indexOf("离去角") != -1){
				trClass = trClass+'fix-middle ';
				};
				if (a.Name.indexOf("纵向通过角") != -1){
				trClass = trClass+'fix-middle ';
				};
				if (a.Name.indexOf("最大爬坡度") != -1){
				trClass = trClass+'fix-middle ';
				};
				if (a.Name.indexOf("最小转弯半径") != -1){
				trClass = trClass+'fix-middle ';
				};
				if (a.Name.indexOf("最大涉水深度") != -1){
				trClass = trClass+'fix-middle ';
				}; */
				if (r.Data.high && e == 0) {
					trClass = trClass + 'highlight ';
				};
				if (r.Data.hide && (e == 1 || e == 2)) {
					return false;
				}
				if (r.Data.noCon && e == 2) {
					return false;
				}
				trClass = 'class="' + trClass + '"';
				if (keyLink[a.Name]) g = keyLink[a.Name];
				n.push('<tr ' + trClass + ' id="trs_' + d + '">');
				n.push('<th ' + (f ? 'class="twol"' : '') + '>');
				n.push('<div><a href="' + g + '" target="_blank">' + a.Name + '</a></div>');
				n.push('</th>');
				n.push('</tr>');
				conHtml.push('<tr ' + trClass + ' id="tr_' + d + '">')
				conHtml.push('<th ' + (f ? 'class="twol"' : '') + '>');
				conHtml.push('<div><a href="' + g + '" target="_blank">' + a.Name + '</a></div>');
				conHtml.push('</th>');
				var h = a.ModelExcessIds,
					strLen = 0;
				if (c) {
					for (var k = 0, llen = h.length; k < llen; k++) {
						if (paramesLen == 1 && this.Data.isCheckBox && l.indexOf('-' + k + '-') == -1) {
							continue;
						}
						// 2014-6-04
						var valTxt = '',
							sideV = '',//外部配置的侧滑门
							priceTxt = '';
						if (h[k].Price != "-") {
							priceTxt = '<a class="configPrice" href="javascript:;" title="选装配置官方价">(' + h[k].Price + '元)</a>';
						}
						if (a.Name == '扬声器数量') {
							valTxt = h[k].Value == '-' ? h[k].Value : h[k].Value + priceTxt;
						}else {
							o(h[k].Value) == '-' ? valTxt = o(h[k].Value) : valTxt = o(h[k].Value) + priceTxt;
						}
						if(a.Name == '侧滑门'&&valTxt!='-'){
							sideV = h[k].bvalueAddition;
						}
						// 配置输出的
						conHtml.push('<td type=' + w + ' rel="' + h[k].Id + '"' + (h[k].Id == curId ? 'style="background:' + r.Data.curSpecCss + ';"' : '') + '><div class="fontf">' + sideV + valTxt + '</div></td>');
					}
				} else {
					for (var k = 0,
							llen = h.length; k < llen; k++) {
						if (paramesLen == 1 && this.Data.isCheckBox && l.indexOf('-' + k + '-') == -1) continue;
						if (r.Data.isPust) {
							switch (a.Name) {
								case '发动机':
									r.Data.engine.push(h[k].Value);
									break;
								case '变速箱':
									r.Data.transmission.push(h[k].Value);
									break;
								case '车身结构':
									if (a.ItemType != '1') r.Data.carStruct.push(h[k].Value);
									break;
								case '驱动方式':
									r.Data.qudong.push(h[k].Value);
									break;
								case '燃料形式':
									r.Data.ranliao.push(h[k].Value);
									break;
							}
						}
						if (a.Name == '整车质保') {
							conHtml.push('<td type=' + w + ' rel="' + h[k].Id + '"' + (h[k].Id == curId ? 'style="background:' + r.Data.curSpecCss + ';"' : '') + '><div>' + (h[k].Value == '0' ? '-' : h[k].Value) + '</div></td>')
						} else {
							if (f) {
								conHtml.push('<td type=' + w + ' rel="' + h[k].Id + '"' + (h[k].Id == curId ? 'style="background:' + r.Data.curSpecCss + ';"' : '') + '>');
								if (h[k].Value == '0') {
									conHtml.push('<div>-</div>')
								} else {
									strLen = r.getCharacters.len(h[k].Value);
									if (strLen > 44) {
										conHtml.push('<div title="' + h[k].Value + '">' + r.getCharacters.sub(h[k].Value, 44) + '</div>')
									} else {
										conHtml.push('<div>' + h[k].Value + '</div>')
									}
								}
								conHtml.push('</td>')
							} else {
								conHtml.push('<td type=' + w + ' rel="' + h[k].Id + '"' + (h[k].Id == curId ? 'style="background:' + r.Data.curSpecCss + ';"' : '') + '><div>' + (h[k].Value == '0' ? '-' : h[k].Value) + '</div></td>')
							}
						}
					}
				}
				for (var i = 0; i < spaceColNum; i++) {
					conHtml.push('<td><div></div></td>')
				}
				conHtml.push('</tr>')
			},
			mager = function(a, b, c, d) {
				var e = b,
					len = e.length,
					titleClass = '';
				for (var i = a; i < len; i++) {
					var f = parseInt(e[i].ItemType) + d;
					if (titleClass == '' || titleClass != e[i].Item) {
						conHtml.push('<table id="tab_' + f + '" cellspacing="0" cellpadding="0" class="tbcs">');
						conHtml.push('<tbody>');
						n.push('<tr>');
						n.push('<th show="1" id="sth_' + f + '" class="cstitle" >');
						n.push('<h3><span>' + e[i].Item + '</span></h3>');
						n.push('</th>');
						n.push('</tr>');
						conHtml.push('<tr>');
						conHtml.push('<th show="1" id="dth_' + f + '" class="cstitle" colspan="' + (this.Data.carList.length + 1) + '">');
						conHtml.push('<h3><span>' + e[i].Item + '</span></h3>');
						conHtml.push('</th>');
						conHtml.push('</tr>');
						titleClass = e[i].Item
					}
					getTrHtml(a, e[i], f, c, i, r.compare(e[i].ModelExcessIds, l))
					if (titleClass != '' && (i == len - 1 || titleClass != e[i + 1].Item)) {
						if (c && i == len - 1) {
							if (clickTR.indexOf('-2003-') == -1) {
								n.push('<tr rel="' + f + '" id="trs_2003">')
							} else {
								n.push('<tr rel="' + f + '" id="trs_2003" class="trColor">')
							}
							n.push('<th>');
							n.push('<div class="carcolor"><a>车身颜色<a></div>');
							n.push('</th>');
							n.push('</tr>');
							//增加内饰颜色
							n.push('<tr id="trs_2004"><th>');
							n.push('<div class="carinnercolor"><a>内饰颜色<a></div>');
							n.push('</th></tr>');
							//最后的备注栏
							n.push('<tr id="trs_2004"><th>');
							n.push('<div class="carnote">备注</div>');
							n.push('</th>');
							n.push('</tr>');
							//最后的备注栏end
							if (clickTR.indexOf('-2003-') == -1) {
								conHtml.push('<tr rel="' + f + '" id="tr_2003" class="trColor">')
							} else {
								conHtml.push('<tr rel="' + f + '" id="tr_2003">')
							}
							conHtml.push('<th>');
							conHtml.push('<div class="carcolor"><a>车身颜色</a></div>');
							conHtml.push('</th>');
							for (var j = 0,
									cLen = this.Data.carList.length; j < cLen; j++) {
								var g = this.Data.carList[j] == curId ? 'style="background:' + r.Data.curSpecCss + ';"' : '';
								if (this.Data.colorList[this.Data.carList[j]]) {
									var h = this.Data.colorList[this.Data.carList[j]].ColorList,
										cdLen = h.length > 16 ? 16 : h.length;
									conHtml.push('<td rel="' + this.Data.carList[j] + '"' + g + '>');
									conHtml.push('<div><ul class="colorul">');
									for (var m = 0; m < cdLen; m++) {
										if (h[m].PicLink != '') {
											conHtml.push('<li><a title="' + h[m].Name + '" href="' + h[m].PicLink + '" style="background:' + h[m].Value + '" target="_blank"><img src="http://www1.pcauto.com.cn/2012/price/images/config/c.png"/></a></li>')
										} else {
											conHtml.push('<li><span title="' + h[m].Name + '" style="background:' + h[m].Value + '"><img src="http://www1.pcauto.com.cn/2012/price/images/config/c.png"/></span></li>')
										}
									}
									conHtml.push('</ul></div>');
									conHtml.push('</td>')
								} else {
									conHtml.push('<td ' + g + '><div></div></td>')
								}
							}
							for (var k = 0; k < spaceColNum; k++) {
								conHtml.push('<td><div></div></td>')
							}
							conHtml.push('</tr>');
							//内饰颜色
							conHtml.push('<tr id="tr_2004" class="trInnerColor"><th><div class="carInnerColor"><a>内饰颜色</a></div></th>');
							for (var j = 0,
									cLen = this.Data.carList.length; j < cLen; j++) {
								var g = this.Data.carList[j] == curId ? 'style="background:' + r.Data.curSpecCss + ';"' : '';
								if (this.Data.innerColorList[this.Data.carList[j]]) {
									var h = this.Data.innerColorList[this.Data.carList[j]].innerColorList,
										cdLen = h.length > 16 ? 16 : h.length;
									conHtml.push('<td rel="' + this.Data.carList[j] + '"' + g + '>');
									conHtml.push('<div><ul class="colorul">');
									for (var m = 0; m < cdLen; m++) {
										if (h[m].PicLink != '') {
											conHtml.push('<li><a title="' + h[m].Name + '" href="' + h[m].PicLink + '" style="background:' + h[m].Value + '" target="_blank"></a></li>')
										} else {
											conHtml.push('<li><span title="' + h[m].Name + '" style="background:' + h[m].Value + '"></span></li>')
										}
									}
									conHtml.push('</ul></div>');
									conHtml.push('</td>')
								} else {
									conHtml.push('<td ' + g + '><div></div></td>')
								}
							}
							for (var k = 0; k < spaceColNum; k++) {
								conHtml.push('<td><div></div></td>')
							}
							conHtml.push('</tr>');
								// 最后的备注栏
							conHtml.push('<tr id="tr_2004" class="trNote"><th><div>备注</div></th>');
							var noteArray = note.body.item,
								noteEmptyNum = 0,
								noteIsEmptyClass = '';
							window.noteIsEmpty = false;
							for (k = 0; k < Data.carList.length; k++) {
								for (j = 0; j < noteArray.length; j++) {
									if (noteArray[j].SpecId == Data.carList[k]) {
										noteIsEmptyClass = '';
										if (noteArray[j].note === '-') {
											noteEmptyNum++;
											noteIsEmptyClass = 'empty'
										};
										conHtml.push('<td type="0" rel="' + noteArray[j].SpecId + '" class="' + noteIsEmptyClass + '"><div class="carnote">' + noteArray[j].note + '</div></td>');
									};
								};
							};
							if (noteEmptyNum === Data.carList.length) {
								noteIsEmpty = true;
							};
							conHtml.push('</tr>');
							//备注栏end
						}
						conHtml.push('</tbody>');
						conHtml.push('</table>')
					}
				}
			},
			getDealerPrice = function() {
				var a = config.body.items[1].ModelExcessIds,
					len = a.length,
					i = 0,
					temp = [];
				if (clickTR.indexOf('-2000-') == -1) {
					n.push('<tr id="trs_2000">')
				} else {
					n.push('<tr id="trs_2000">')
				}
				n.push('<th><div>官方价</div></th>');
				n.push('</tr>');
				if (clickTR.indexOf('-2001-') == -1) {
					n.push('<tr id="trs_2001">')
				} else {
					n.push('<tr id="trs_2001">')
				}
				n.push('<th><div>经销商报价</div></th>');
				n.push('</tr>');
				conHtml.push('<table cellspacing="0" cellpadding="0" class="tbcs">');
				conHtml.push('<tbody>');
				if (clickTR.indexOf('-2000-') == -1) {
					conHtml.push('<tr id="tr_2000">')
				} else {
					conHtml.push('<trid="tr_2000">')
				}
				conHtml.push('<th><div>官方价</div></th>');
				for (; i < len; i++) {
					if (paramesLen == 1 && this.Data.isCheckBox && l.indexOf('-' + i + '-') == -1) continue;
					//如果车型的官方价分停售和即将上市两种情况显示
					if (chkDealerPrice([], a[i].Id)) {
						conHtml.push('<td type=2 rel="' + a[i].Id + '"' + (a[i].Id == curId ? 'style="background:' + r.Data.curSpecCss + ';"' : '') + '><div><span id="gfPrice_'+ a[i].Id  + '">' + (a[i].Value == '0.0万' || a[i].Value == '-' || a[i].Value == 'null' || a[i].Value == '万' ? '暂无报价' : a[i].Value + "(停售)" + (a[i].Id > 1000000 ? '' : '</span><a target="_blank" class="buycarico" href="http://price.pcauto.com.cn/vbuycar.jsp?mid=' + a[i].Id + '" target="_blank"></a>')) + '</div></td>');
					} else if (a[i].jss == 1) {
						conHtml.push('<td type=2 rel="' + a[i].Id + '"' + (a[i].Id == curId ? 'style="background:' + r.Data.curSpecCss + ';"' : '') + '><div><span id="gfPrice_'+ a[i].Id  + '">' + (a[i].Value == '0.0万' || a[i].Value == '-' || a[i].Value == 'null' || a[i].Value == '万' ? '暂无报价' : a[i].Value + "（预售价）" + (a[i].Id > 1000000 ? '' : '</span><a target="_blank" class="buycarico" href="http://price.pcauto.com.cn/vbuycar.jsp?mid=' + a[i].Id + '" target="_blank"></a>')) + '</div></td>');
					} else {
						conHtml.push('<td type=2 rel="' + a[i].Id + '"' + (a[i].Id == curId ? 'style="background:' + r.Data.curSpecCss + ';"' : '') + '><div><span id="gfPrice_'+ a[i].Id  + '">' + (a[i].Value == '0.0万' || a[i].Value == '-' || a[i].Value == 'null' || a[i].Value == '万' ? '暂无报价' : a[i].Value + (a[i].Id > 1000000 ? '' : '</span><a target="_blank" id="'+a[i].Id+'" class="buycarico" href="http://price.pcauto.com.cn/vbuycar.jsp?mid=' + a[i].Id + '" target="_blank"></a>')) + '</div></td>');
					}
					if (this.Data.dealerPrice[a[i].Id]) {
						if (this.Data.dealerPrice[a[i].Id] == "-万") {
							temp.push('<td type=2 rel="' + a[i].Id + '"' + (a[i].Id == curId ? 'style="background:' + r.Data.curSpecCss + ';"' : '') + '><div><a target="_blank" id="lowestPrice_'+ a[i].Id +'" class="redab" href="http://price.pcauto.com.cn/m'+a[i].Id+'/price.html">暂无报价</a></div></td>')
						} else {
							//经销商报价这里，如果是停售车型应显示"暂无报价"
							if (chkDealerPrice([], a[i].Id)) {
								temp.push('<td type=2 rel="' + a[i].Id + '"' + (a[i].Id == curId ? 'style="background:' + r.Data.curSpecCss + ';"' : '') + '><div><a target="_blank" id="lowestPrice_'+ a[i].Id +'" class="redab" href="http://price.pcauto.com.cn/m' + a[i].Id + '/price.html">暂无报价</a></div></td>')
							} else {
								var td =  '<td type=2 rel="' + a[i].Id + '"' + (a[i].Id == curId ? 'style="background:' + r.Data.curSpecCss + ';"' : '') + '><div><a target="_blank" id="lowestPrice_'+ a[i].Id +'" class="redab" href="http://price.pcauto.com.cn/m' + a[i].Id + '/price.html">' + (a[i].Id > 1000000 ? '详见车型报价' : this.Data.dealerPrice[a[i].Id]) + '</a></div></td>';
								if (this.Data.dealerPrice[a[i].Id] == "暂无报价") {
									td = '<td type=2 rel="' + a[i].Id + '"' + (a[i].Id == curId ? 'style="background:' + r.Data.curSpecCss + ';"' : '') + '><div><div><a target="_blank" id="lowestPrice_'+ a[i].Id +'" class="redab" href="http://price.pcauto.com.cn/m' + a[i].Id + '/price.html">暂无报价</a></div></td>';
								}
								temp.push(td);
							}
						}
					} else {
						temp.push('<td type=2 rel="' + a[i].Id + '"' + (a[i].Id == curId ? 'style="background:' + r.Data.curSpecCss + ';"' : '') + '><div><div><a target="_blank" id="lowestPrice_'+ a[i].Id +'" class="redab" href="http://price.pcauto.com.cn/m' + a[i].Id + '/price.html">暂无报价</a></div></td>')
					}
				}
				for (var k = 0; k < spaceColNum; k++) {
					conHtml.push('<td><div></div></td>');
					temp.push('<td><div></div></td>')
				}
				conHtml.push('</tr>');
				if (clickTR.indexOf('-2001-') == -1) {
					conHtml.push('<tr id="tr_2001">')
				} else {
					conHtml.push('<trid="tr_2001">')
				}
				conHtml.push('<th><div>本地最低报价</div></th>');
				conHtml.push(temp.join(''));
				conHtml.push('</tr>');
				conHtml.push('</tbody>');
				conHtml.push('</table>')
			};
		getDealerPrice();
		mager(2, config.body.items, false, 0);
		mager(0, option.body.items, true, 100);
		n.push('</tbody>');
		n.push('</table>');
		n.push('</div>');
		r.Data.isPust = false;
		configData.innerHTML = n.join('') + conHtml.join('');
		//页面DOM生成，接下来赋予左侧的备注栏高度
		if (noteIsEmpty && Data.noCon) {
			$('#trs_2004').hide();
			$('#tr_2004').hide();
		} else {
			$('#trs_2004').height($('#tr_2004').height());
		};
		r.titleEvent();
		r.mouseChangeCss()
	};
	this.compare = function(a, b) {
		/*返回差异性 0=有差异，1=相同，2=相同但没内容*/
		var c = 1,
			len = a.length,
			i = 0,
			t, isSet = true;
		if (len == 0) return c;
		for (; i < len; i++) {
			if (b != undefined && this.Data.isCheckBox && b.indexOf('-' + i + '-') == -1) continue;
			if (isSet) {
				t = a[i].Value;
				isSet = false;
				continue
			}
			if (a[i].Value != t) {
				c = 0;
				break
			}
		}
		if (c == 1 && t == '-') {
			c = 2;
		}
		return c
	};
	this.titleEvent = function() {
		var d = pc.dom.byClass('cstitle', configData, 'th'),
			tab = pc.dom.byClass('tbcs', configData, 'table'),
			len = d.length,
			i = 0,
			r = this,
			conWidth = (parseInt(pc.css(pc.dom.tag('table', configNav)[0], 'width').replace(/px/gi, '')) + 1) + 'px';
		for (var j = 1,
				tlen = tab.length; j < tlen; j++) {
			pc.css(tab[j], {
				'width': conWidth
			})
		}
		return;
		for (; i < len; i++) {
			d[i].onclick = function() {
				var a = this.getAttribute('show'),
					index = this.id.replace('sth_', '').replace('dth_', ''),
					sObj = pc.dom.id('sth_' + index),
					dObj = pc.dom.id('dth_' + index),
					bcss = '',
					show = 0;
				if (a == '1') {
					bcss = 'setcon';
					hideShow(index, 'none')
				} else {
					hideShow(index, '');
					show = 1
				}
				pc.css(pc.dom.id('tab_' + index), {
					'borderBottom': 'none'
				});
				pc.css(pc.dom.id('config_side'), {
					'borderBottom': 'none'
				});
				sObj.setAttribute('show', show);
				dObj.setAttribute('show', show);
				pc.dom.tag('b', sObj)[0].className = bcss;
				pc.dom.tag('b', dObj)[0].className = bcss
			}
		}

		function hideShow(n, a) {
			var b = pc.dom.tag('tr', pc.dom.id('tab_' + n)),
				sideTr = pc.dom.tag('tr', pc.dom.id('tab_side')),
				conLen = b.length,
				sideLen = sideTr.length,
				j = 1,
				k = 0;
			for (; j < conLen; j++) pc.css(b[j], 'display', a);
			for (; k < sideLen; k++) {
				var c = sideTr[k];
				if (c.getAttribute('rel') == n) pc.css(c, 'display', a)
			}
		}
	};
	this.mouseChangeCss = function() {
		var b = pc.dom.tag('tr', configData),
			len = b.length,
			i = 0;
		for (; i < len; i++) {
			pc.handler.addEvent(b[i], 'mouseenter',
				function(e) {
					e = e || window.event;
					var a = e.currentTarget || e.srcElement,
						ids = a.id.replace('trs_', '').replace('tr_', '');
					pc.addCSS(a, "hover");
				});
			pc.handler.addEvent(b[i], 'mouseleave',
				function(e) {
					e = e || window.event;
					var a = e.currentTarget || e.srcElement,
						ids = a.id.replace('trs_', '').replace('tr_', '');
					pc.removeCSS(a, "hover");
				});
			b[i].onclick = function() {
				var a = this.id.replace('trs_', '').replace('tr_', ''),
					currCSS = this.className;
				if (currCSS.indexOf('ck') > -1) {
					if (pc.dom.id('trs_' + a)) {
						pc.removeCSS(this, "ck");
						r.Data.userClickTR[a] = ''
					}
				} else {
					if (pc.dom.id('trs_' + a)) {
						r.Data.userClickTR[a] = '-' + a + '-';
						pc.addCSS(this, "ck");
					}
				}
			}
		}
	};
	this.checkboxInit = function() {
		var a = pc.dom.tag('input'),
			len = a.length,
			i = 0;
		for (; i < len; i++) {
			if (a[i].type == 'checkbox') {
				a[i].checked = false;
			}
		}
	};
	this.selectEvent = function() {
		var b = pc.dom.tag('input'),
			len = b.length,
			i = 0;
		for (; i < len; i++) {
			if (b[i].type == 'checkbox') {
				b[i].onclick = function() {
					if (r.Data.carNum == 0) {
						window.location = window.location;
					}
					var a = r.selectCar().join(',');

					switch (this.name) {
						case 'radioShow':
							aysnBox(this.name, this.checked, this.value);
							/*关联两个相同的复选框*/
							if ((r.Data.allList.length == 0 || r.Data.carList.length < 2) && this.checked) return;
							if (this.value == 'hide') {
								r.Data.hide = this.checked
							} else if (this.value == 'high') {
								r.Data.high = this.checked;
							} else if (this.value == 'noCon') {
								r.Data.noCon = this.checked;
							}
							break;
						case 'engine':
							r.responseNav(a);
							if (a == "" && this.checked) {
								r.mainshow(1);
							} else {
								r.mainshow(0);
							}
							break;
						case 'transmission':
							r.responseNav(a);
							if (a == "" && this.checked) {
								r.mainshow(1);
							} else {
								r.mainshow(0);
							}
							break;
						case 'carStruct':
							r.responseNav(a);
							if (a == "" && this.checked) {
								r.mainshow(1);
							} else {
								r.mainshow(0);
							}
							break;
						case 'qudong':
							r.responseNav(a);
							if (a == "" && this.checked) {
								r.mainshow(1);
							} else {
								r.mainshow(0);
							}
							break;
						case 'ranliao':
							r.responseNav(a);
							if (a == "" && this.checked) {
								r.mainshow(1);
							} else {
								r.mainshow(0);
							}
							break;
					};
					r.responseContent(a);
					r.scrollFloat(true);
					r.selectEvent();
					r.tdHover();
				}
			}
		}
		refreshLowestPrice();

		function aysnBox(n, c, v) {
			for (var j = 0; j < len; j++) {
				if (b[j].type == 'checkbox' && b[j].name == n && b[j].value == v) b[j].checked = c
			}
		}
	};
	this.selectCar = function() {
		var e = pc.dom.tag('input'),
			len = e.length,
			ids = '',
			selectIndex = [],
			engine = [],
			transmission = [],
			carStruct = [],
			qudong = [],
			ranliao = [],
			checknum = 0,
			typenum = 0;
		for (var j = 0; j < len; j++) {
			if (e[j].type == 'checkbox' && e[j].checked) {
				switch (e[j].name) {
					case 'engine':
						engine.push(e[j].value);
						checknum++;
						break;
					case 'transmission':
						transmission.push(e[j].value);
						checknum++;
						break;
					case 'carStruct':
						carStruct.push(e[j].value);
						checknum++;
						break;
					case 'qudong':
						qudong.push(e[j].value);
						checknum++;
						break;
					case 'ranliao':
						ranliao.push(e[j].value);
						checknum++;
						break
				}
			}
		}
		if (checknum > 0) this.Data.isCheckBox = true;
		else this.Data.isCheckBox = false;
		if (engine.length > 0) {
			engine = findkey('engine', engine, r.Data.engine);
			typenum++
		}
		if (transmission.length > 0) {
			transmission = findkey('transmission', transmission, r.Data.transmission);
			typenum++
		}
		if (carStruct.length > 0) {
			carStruct = findkey('carStruct', carStruct, r.Data.carStruct);
			typenum++
		}
		if (qudong.length > 0) {
			qudong = findkey('qudong', qudong, r.Data.qudong);
			typenum++
		}
		if (ranliao.length > 0) {
			ranliao = findkey('ranliao', ranliao, r.Data.ranliao);
			typenum++
		}

		function findkey(a, b, c) {
			var d = [],
				cmparrLen = c.length;
			for (var j = 0,
					arrLen = b.length; j < arrLen; j++) {
				for (var k = 0; k < cmparrLen; k++) {
					if (c[k].indexOf(b[j]) > -1) {
						d.push(k)
					}
				}
			}
			return d
		};

		function getArray(a) {
			var b = [];
			if (a != null) {
				a = a.split(",");
				for (var i in a) b.push(a[i])
			}
			return b
		}

		function getIntersect(a, b) {
			var c = [],
				alen = a.length,
				blen = b.length;
			c = (a.join(",") + "|" + b.join(",")).match(/(\b[^,]+\b)(?!.*\b\1\b.*\|)(?=.*\|.*\b\1\b)/g);
			return c == null ? [] : c
		};
		var f = engine.length,
			tlen = transmission.length,
			clen = carStruct.length,
			qlen = qudong.length,
			rlen = ranliao.length;
		if (typenum > 1) {
			if (f > 0 && tlen > 0 && clen > 0 && qlen > 0 && rlen > 0) { //全部条件,共31种，求优化。
				selectIndex = getIntersect(ranliao, getIntersect(qudong, getIntersect(engine, getIntersect(transmission, carStruct))));
			} else if (f > 0 && tlen > 0 && qlen > 0 && rlen > 0) {
				selectIndex = getIntersect(ranliao, getIntersect(qudong, getIntersect(engine, transmission)));
			} else if (f > 0 && clen > 0 && qlen > 0 && rlen > 0) {
				selectIndex = getIntersect(ranliao, getIntersect(qudong, getIntersect(engine, carStruct)));
			} else if (tlen > 0 && clen > 0 && qlen > 0 && rlen > 0) {
				selectIndex = getIntersect(ranliao, getIntersect(qudong, getIntersect(transmission, carStruct)))
			} else if (tlen > 0 && clen > 0 && qlen > 0 && f > 0) {
				selectIndex = getIntersect(engine, getIntersect(qudong, getIntersect(transmission, carStruct)))
			} else if (tlen > 0 && clen > 0 && f > 0 && rlen > 0) {
				selectIndex = getIntersect(engine, getIntersect(ranliao, getIntersect(transmission, carStruct)))
			} else if (tlen > 0 && clen > 0 && f > 0) {
				selectIndex = getIntersect(engine, getIntersect(transmission, carStruct))
			} else if (tlen > 0 && clen > 0 && rlen > 0) {
				selectIndex = getIntersect(ranliao, getIntersect(transmission, carStruct))
			} else if (tlen > 0 && clen > 0 && qlen > 0) {
				selectIndex = getIntersect(qudong, getIntersect(transmission, carStruct))
			} else if (tlen > 0 && f > 0 && rlen > 0) {
				selectIndex = getIntersect(ranliao, getIntersect(transmission, engine))
			} else if (tlen > 0 && f > 0 && qlen > 0) {
				selectIndex = getIntersect(qudong, getIntersect(transmission, engine))
			} else if (f > 0 && clen > 0 && qlen > 0) {
				selectIndex = getIntersect(qudong, getIntersect(carStruct, engine))
			} else if (f > 0 && clen > 0 && rlen > 0) {
				selectIndex = getIntersect(ranliao, getIntersect(carStruct, engine))
			} else if (f > 0 && qlen > 0 && rlen > 0) {
				selectIndex = getIntersect(ranliao, getIntersect(qudong, engine))
			} else if (tlen > 0 && qlen > 0 && rlen > 0) {
				selectIndex = getIntersect(ranliao, getIntersect(qudong, transmission))
			} else if (clen > 0 && qlen > 0 && rlen > 0) {
				selectIndex = getIntersect(ranliao, getIntersect(qudong, carStruct))
			} else if (f > 0 && tlen > 0) {
				selectIndex = getIntersect(transmission, engine)
			} else if (f > 0 && clen > 0) {
				selectIndex = getIntersect(carStruct, engine)
			} else if (f > 0 && rlen > 0) {
				selectIndex = getIntersect(ranliao, engine)
			} else if (f > 0 && qlen > 0) {
				selectIndex = getIntersect(qudong, engine)
			} else if (tlen > 0 && clen > 0) {
				selectIndex = getIntersect(transmission, carStruct)
			} else if (tlen > 0 && qlen > 0) {
				selectIndex = getIntersect(qudong, transmission)
			} else if (tlen > 0 && rlen > 0) {
				selectIndex = getIntersect(ranliao, transmission)
			} else if (clen > 0 && qlen > 0) {
				selectIndex = getIntersect(qudong, carStruct)
			} else if (clen > 0 && rlen > 0) {
				selectIndex = getIntersect(ranliao, carStruct)
			} else if (qlen > 0 && rlen > 0) {
				selectIndex = getIntersect(ranliao, qudong)
			}
		} else {
			if (f > 0) selectIndex = engine;
			else if (tlen > 0) selectIndex = transmission;
			else if (clen > 0) selectIndex = carStruct;
			else if (qlen > 0) selectIndex = qudong;
			else selectIndex = ranliao
		}
		for (var i = 0,
				silen = selectIndex.length; i < silen; i++) {
			selectIndex[i] = '-' + selectIndex[i] + '-'
		}
		return selectIndex
	};
	this.MoveOrDel = function() {
		var k = function(b) {
				if (b == -1) return;
				var c = config.body.items,
					optionitems = option.body.items,
					clearData = function(a, n) {
						for (var i = 0,
								len = a.length; i < len; i++) a[i].ModelExcessIds.splice(n, 1)
					};
				clearData(c, b);
				clearData(optionitems, b);
				color.body.items.splice(b, 1);
				r.Data.engine.splice(b, 1);
				r.Data.transmission.splice(b, 1);
				r.Data.carStruct.splice(b, 1);
				r.Data.qudong.splice(b, 1);
				r.Data.ranliao.splice(b, 1);
				r.Data.carNum--
			},
			getIndex = function(a) {
				var b = r.Data.allList,
					len = b.length,
					s = -1;
				for (var i = 0; i < len; i++) {
					if (b[i] == a) {
						s = i;
						break
					}
				}
				return s
			},
			exchange = function(b, n, c) {
				var d = pc.dom.tag('td', configNav),
					changeId = 0;
				switch (c) {
					case 'l':
						changeId = pc.dom.byClass('del', d[n - 2], 'a')[0].getAttribute('rel');
						break;
					case 'r':
						changeId = pc.dom.byClass('del', d[n], 'a')[0].getAttribute('rel');
						break
				}
				var e = getIndex(b),
					changeIndex = getIndex(changeId);
				var f = null,
					configitems = config.body.items,
					optionitems = option.body.items,
					arrChangeData = function(a) {
						f = a[e];
						a[e] = a[changeIndex];
						a[changeIndex] = f
					};
				r.changeData(configitems, e, changeIndex);
				r.changeData(optionitems, e, changeIndex);
				arrChangeData(color.body.items);
				arrChangeData(r.Data.engine);
				arrChangeData(r.Data.transmission);
				arrChangeData(r.Data.carStruct);
				arrChangeData(r.Data.qudong);
				arrChangeData(r.Data.ranliao);
			},
			delAnimate = function(n, b) {
				var d = pc.dom.tag('table', configNav)[0],
					dataTab = pc.dom.tag('table', configData),
					tempId = 0,
					runNum = 0,
					conWidth = (parseInt(pc.css(pc.dom.tag('table', configNav)[0], 'width').replace(/px/gi, '')) + 1) + 'px',
					isHideDel = function(c) {
						if (c) d.rows[0].cells[n].innerHTML = '<div id="temp_' + (tempId++) + '" style="padding:0;width:160px;" class="carbox"></div>';
						else d.rows[0].deleteCell(n);
						for (var i = 0,
								len = dataTab.length; i < len; i++) {
							var a = pc.dom.tag('tr', dataTab[i]),
								trLen = a.length,
								flag = true;
							for (var j = 0; j < trLen; j++) {
								if (a[j].cells.length > 1) {
									if (c) {
										if (flag) {
											a[j].cells[n].innerHTML = '<div id="temp_' + (tempId++) + '"></div>';
											flag = false
										} else a[j].cells[n].innerHTML = ''
									} else a[j].deleteCell(n)
								}
							}
							pc.css(dataTab[i], {
								'width': 'auto'
							})
						}
					},
					runed = function() {
						runNum++;
						if (runNum == tempId) {
							b()
						}
					};
				isHideDel(true);
				for (var i = 0; i < tempId; i++) {
					$('#temp_' + i).parent('td').animate({
						width: '0px'
					}, 250, runed);
				}
			},
			moveAnimate = function(b, n, c, d,arry) {
				var e = pc.dom.tag('table', configNav)[0],
					dataTab = pc.dom.tag('table', configData),
					td = e.rows[0].cells[n],
					w = pc.css(td, 'width'),
					div = pc.dom.create('div'),
					scrollXY = pc.abs.scroll(td),
					posXY = pc.abs.point(td),
					conXY = pc.abs.point(pc.dom.id('content')),
					go,
					textCss = 'background:#f5f5f5;',
					navposition = pc.css(configNav, 'position');
				pc.css(div, {
					'opacity': '0.5',
					'position': 'absolute',
					'zIndex': '1300',
					'top': conXY.y + 'px',
					'left': (navposition == 'relative' ? posXY.x : (scrollXY.left + posXY.x)) + 'px',
					'width': w,
					'background': '#f5f5f5',
					'overflow': 'hidden'
				});
				var f = '<div class="operation">' + ' <table cellspacing="0" cellpadding="0" class="tbset">' + ' <tbody>' + ' <tr style="#COLOR#">' + ' <td>#TOP#</td>' + ' </tr>' + ' </tbody>' + ' </table> ' + '</div> ',
					conHtml = '<table cellspacing="0" cellpadding="0" class="tbcs" style="width:160px;">' + ' <tbody>' + ' <tr style="#COLOR#height:28px;">' + ' <td ' + (b == curId ? 'style="background:' + r.Data.curSpecCss + ';"' : '') + '>#CON#</td>' + ' </tr>' + ' </tbody>' + '</table>',
					colorHtml = '<table cellspacing="0" cellpadding="0" class="tbcs" style="width:160px;">' + ' <tbody>' + ' <tr style="#COLOR#height:87px;">' + ' <td ' + (b == curId ? 'style="background:' + r.Data.curSpecCss + ';"' : '') + '>#CON#</td>' + ' </tr>' + ' </tbody>' + '</table>',
					titHtml = '<table cellspacing="0" cellpadding="0" class="tbcs" style="width:160px;">' + ' <tbody>' + ' <tr>' + ' <th class="cstitle"><h3></h3></th>' + ' </tr>' + ' </tbody>' + '</table>',
					html = [];
				html.push('<div class="pzbox" ' + (pc.css(configNav, 'position') == 'relative' ? '' : 'style="position:relative;top:' + (scrollXY.top - conXY.y) + 'px"') + '>');
				html.push(f.replace('#TOP#', td.innerHTML));
				html.push('</div>');
				html.push('<div class="pzbox">');
				html.push('<div class="conbox">');
				for (var i = 1,
						len = dataTab.length; i < len; i++) {
					var g = pc.dom.tag('tr', dataTab[i]),
						trLen = g.length;
					if (i != 1) html.push(titHtml);
					for (var j = 0; j < trLen; j++) {
						if (g[j].style.display == 'none') break;
						if (g[j].cells.length > 1) {
							var h = g[j].style.backgroundColor;
							if (i == len - 1 && j == trLen - 1) {
								html.push(colorHtml.replace('#CON#', g[j].cells[n].innerHTML).replace('#COLOR#', ''))
							} else {
								html.push(conHtml.replace('#CON#', g[j].cells[n].innerHTML).replace('#COLOR#', ''))
							}
						}
					}
				}
				html.push('</div>');
				html.push('</div>');
				div.innerHTML = html.join('');
				document.body.appendChild(div);
				switch (c) {
					case 'l':
						go = ((navposition == 'relative' ? posXY.x : scrollXY.left + posXY.x) - parseInt(w.replace(/px/gi, ''))) + 'px';
						break;
					case 'r':
						go = ((navposition == 'relative' ? posXY.x : scrollXY.left + posXY.x) + parseInt(w.replace(/px/gi, ''))) + 'px'
				}
				$(div).animate({
					'left': go
				}, function() {
					document.body.removeChild(div);
					setTimeout(function() {
							d();
							var a = r.selectCar().join(',');
							r.responseNav(a,arry);
							r.responseContent(a);
							r.scrollFloat(true);
							r.selectEvent();
							r.tdHover();
						},
						10)
				});
				/*
				pc.animate(div).start({
				'left': go
				},
				350,
				function() {
				document.body.removeChild(div);
				setTimeout(function() {
				d();
				var a = r.selectCar().join(',');
				r.responseNav(a);
				r.responseContent(a);
				r.scrollFloat(true);
				r.selectEvent();
				r.tdHover();
				},
				10)
				})
				*/
			};
		var _that = this;
		configNav.onclick = function(e) {
			var $this = $(this);
			e = e || window.event;
			var b = e.target || e.srcElement,
				current = b,
				n;
			if (!b.className && (b.className != 'del' || b.className != 'switch_left' || b.className != 'switch_right')) return;
			while (current && current.tagName != "TD") {
				current = current.parentNode
			}
			current && (n = current.cellIndex);
			function selectArray(index,method){
				var arry = _that.Data.selectCom,
					a = 0,
					b = 0,
					last = 0;
				if(method=="right"||method=="left"){
					if(method=="right"){
			    		last = index + 1
			    	}else{
			    		last = index -1;
			    	}
			    	a = arry[index];
			    	b = arry[last];

			    	arry[index] = b;
			    	arry[last] = a;

				}else if(method=="del"){
					arry.splice(index,1);
				}
		    	// console.log(arry);
			}
			switch (b.className) {
				case 'del':
					var d = b.getAttribute('rel');
					selectArray(Number($(b).parent().find('input').attr('data-index')),'del');
					isDelAnimate(function() {
						k(getIndex(d))
					});
					break;
				case 'switch_left':
					var d = b.getAttribute('rel');
					selectArray(Number($(b).parent().find('input').attr('data-index')),'left');
					if (pc.browsers.isIE) {
						ieMove(function() {
							exchange(d, n, 'l')
						});
					} else {
						moveAnimate(d, n, 'l',
							function() {
								exchange(d, n, 'l')
							});
					}
					break;
				case 'switch_right':
					var d = b.getAttribute('rel');
					selectArray(Number($(b).parent().find('input').attr('data-index')),'right');
					if (pc.browsers.isIE) {
						ieMove(function() {
							exchange(d, n, 'r')
						})
					} else {
						moveAnimate(d, n, 'r',
							function() {
								exchange(d, n, 'r')
							})
					}
					break
			}

			function isDelAnimate(b) {
				if (pc.browsers.isIE) {
					b();
					var c = r.selectCar().join(',');
					r.responseNav(c);
					r.responseContent(c);
					r.scrollFloat(true);
					r.selectEvent();
					r.tdHover()
				} else {
					delAnimate(n,
						function() {
							b();
							var a = r.selectCar().join(',');
							r.responseNav(a);
							r.responseContent(a);
							r.scrollFloat(true);
							r.selectEvent();
							r.tdHover();
						})
				}
			};
			// isSelect
			function ieMove(a) {
				a();
				var b = r.selectCar().join(',');
				r.responseNav(b);
				r.responseContent(b);
				r.scrollFloat(true);
				r.selectEvent();
				r.tdHover()
			}
		}
	};
	this.changeData = function(a, b, c) {
		var d = null;
		for (var i = 0,
				len = a.length; i < len; i++) {
			d = a[i].ModelExcessIds[b];
			a[i].ModelExcessIds[b] = a[i].ModelExcessIds[c];
			a[i].ModelExcessIds[c] = d
		}
	};
	this.isTop = function() {
		if (!q || q == '' || q == '0') return;
		var a = config.body.items,
			optionitems = option.body.items,
			items = a[0].ModelExcessIds,
			len = items.length,
			curIndex = 0,
			changeIndex = 0,
			i = 0;
		for (; i < len; i++) {
			if (items[i].Id == q) {
				changeIndex = i;
				break
			}
		}
		if (curIndex != changeIndex) {
			this.changeData(a, curIndex, changeIndex);
			this.changeData(optionitems, curIndex, changeIndex)
		}
	};
	this.leftNav = function() {
		/*左侧导航*/
		var left_nav = document.getElementById("left_nav");
		var h3 = document.getElementById("config_data").getElementsByTagName("h3");
		var h3l = h3.length / 2;
		var ul = "<ul>";
		for (var i = 0; i < h3l; i++) {
			ul += "<li>" + h3[i].innerHTML + "</li>"
		}
		ul += "</ul>";
		left_nav.innerHTML = ul;
		var li = left_nav.getElementsByTagName("li");
		var l = li.length;
		left_nav.style.height = l * 28 + "px";
		li[0].className = "cur";
		for (var i = 0; i < l; i++) {
			li[i].style.top = i * 28 + "px";
			(function(i) {
				li[i].onclick = function() {
					for (var j = 0; j < l; j++) {
						li[j].className = "";
					}
					li[i].className = "cur";
					if (pc.browsers.isIE6 && i == 0) {
						window.scrollTo(0, 550);
					} else {
						window.scrollTo(0, pc.abs.point(h3[l + i]).y - li[i].offsetTop - 95)
					}
				}
			})(i)
		}
	}
	this.tdHover = function() {
		var d = pc.dom.id('config_data');
		var td = $('tr:not(.headTr) td', d);
		var l = td.length;
		var popdiv = pc.dom.id("pop");
		var tip = pc.dom.id("tips");
		var a = pc.dom.id("pop_stit");
		var b = pc.dom.id("pop_value");
		var e = pc.dom.id("modelId");
		var f = pc.dom.id("tdType");
		var t;
		d.onmouseout = function() {
			t = setTimeout(function() {
					pc.css(tip, {
						"display": "none"
					})
				},
				10000)
		}

		function getCarName(id) {
			var len = r.Data.allList.length;
			if (len < 1) {
				return "";
			} else {
				for (var i = 0; i < len; i++) {
					if (id == r.Data.allList[i]) {
						return r.Data.allListname[i];
					}
				}
			}
		}
		for (var i = 0; i < l; i++) {
			(function(i) {
				td[i].onmouseover = function() {
					if (popdiv.style.display == "none") {
						var e = pc.abs.point(td[i]);
						window.clearTimeout(t);
						pc.css(tip, {
							"display": "block",
							"top": e.y + 8 + "px",
							"left": (e.x + 146) + "px"
						});
						var th = pc.dom.tag('th', td[i].parentNode);
						var txta = pc.dom.tag('div', th[0]);
						a.innerHTML = txta[0].innerHTML;
						var txtb = pc.dom.tag('div', td[i]);
						b.innerHTML = txtb[0].innerHTML;
						//获取modelId
						var modelId = $(txtb[0]).parent().attr("rel");
						$("#modelId").val(modelId);
						var carName = getCarName(modelId);
						pc.dom.id("pop_tit").innerHTML = carName;
						//获取修改配置类型
						$("#tdType").val($(txtb[0]).parent().attr("type"));
					}
				}
			})(i)
		}
	}
	this.init()
};
