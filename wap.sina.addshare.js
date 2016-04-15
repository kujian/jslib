var qApiSrc = {
        lower: 'http://3gimg.qq.com/html5/js/qb.js',
        higher: 'http://jsapi.qq.com/get?api=app.share'
    },
    bLevel = {
        qq: {
            forbid: 0,
            lower: 1,
            higher: 2
        },
        uc: {
            forbid: 0,
            allow: 1
        }
    },
    UA = navigator.appVersion,
    isqqBrowser = (UA.split('MQQBrowser/').length > 1) ? bLevel.qq.higher : bLevel.qq.forbid, //2表示高版本，1表示低版本，0表示不支持
    isucBrowser = (UA.split('UCBrowser/').length > 1) ? bLevel.uc.allow : bLevel.uc.forbid,
    version = {
        uc: '',
        qq: ''
    },
    platform_os,
    //userConfig 		= { uId:'',userface:'',usernick:'',isLogin:false},
    shareBasePath = 'http://mjs.sinaimg.cn/wap/module/share/201504071745/',
    localhref = window.location.href,
    cur_domain = localhref.split('//')[1].split('/')[0].split('.')[0],
    isWeixin = false;

window.ishare = true;
//alert("fidder2222!");

if (typeof(__docConfig) == 'undefined' || !window.__docConfig) {
    window.__docConfig = {
        __domain: cur_domain, //文档所在域名
        __docId: '', //文档ID
        __docUrl: localhref.split('?')[0], //当前页面URL
        __cmntId: '', //评论ID
        __cmntTotal: 0, //评论数
        __isGetUserInfo: '', //是否需要用户信息
        __surveyId: '', //投票调查ID
        __flvId: '', //视频ID
        __mainPic: '', //图片地址
        __cmntListUrl: '',
        __gspsId: '', //微博分享用ID
        __tj_ch: 'news',
    }
}

if (typeof(__userConfig__) == 'undefined' || !window.__userConfig__) {
    window.__userConfig__ = {
        __uid: '',
        __unick: '',
        __uface: '',
        __isLogin: false
    };
}

if (typeof(readConfig) == 'undefined' || !window.readConfig) {
    window.readConfig = {
        isArt: true, //是否为正文分享区域，1表示是，0表示为图片分享区域				
        share: {
            sharenum: 0, //分享数，不可为空
            hotnum: 10000, //热度标准值，不可为空
            //imgsrc : '',	//分享的图片链接
            imgid: 'j_ishare_pic', //分享的图片id，该值不变，缺省使用默认
            shorttitle: '', //分享的标题.,title
            content: '', //分享的内容摘要
            targeturl: 'http://o.share.sina.cn/ajshare?vt=4', //目标分享链接
            shareurl: localhref,
            isdoc: 0
        },
        /*comment : {
					num : 0,										//评论数，不可为空
					golinks : '', //为空时，页面不跳转
				},		*/
        originpic: '', //原图链接地址
    };
}

cur_domain = __docConfig.__domain || cur_domain;
/**
 ***
 *** 此方法只提供两个接口，init-初始化和login-登录（提供回调函数参数）
 ***
 */
function MyShareClass() {
    var _floatstatus = {
            login: 0,
            platlist: 1,
            share: 2,
            fade: 3
        },
        _platforms = {
            sweibo: ['SinaWeibo', '新浪微博'],
            friend: ['WechatFriends', '微信好友'],
            fsircle: ['WechatTimeline', '微信朋友圈']
        },
        _opConfig = {
            voteNum: 0,
            voteStatus: false,
            favorStatus: false
        },
        _favorConfig = {
            isInit: false,
            isAdd: true
        },
        _contentConfig = {
            contentRows: [4, 6],
            contentMax: 88,
            basePath: shareBasePath,
            cssPath: shareBasePath + 'css/addShare.min.css',
            //basePath : '../',
            //cssPath : 'css/addShare.css',
            userInfoUrl: 'http://interface.sina.cn/wap_api/wap_get_user_info.d.api?jsoncallback=',
            animate: ['platformShow', 'sinaShow'],
            headimgsrc: 'images/headimg.png',
            shareimgsrc: 'http://u1.sinaimg.cn/upload/2014/12/08/101778.png'
        },
        _shareContent = {
            iTitle: '',
            iContent: '',
            iImgsrc: '',
            iUrl: '',
            iBackurl: '',
            isdoc: 0
        },
        _platBox = {
            findClass: {
                shareIcon: 'j_splat_ico',
                shareContentZone: 'j_icontent',
                shareBtn: 'j_shareBtn',
                platforms_big: 'j_platforms_big',
                sinaShareContent: 'j_sinaShareContent',
                praiseBtn: 'j_vote_btn',
                submitBtn: 'j_isunbmit',
                addFavor: 'j_iadd_btn',
                sinaInfo: 'sinaInfo',
                forbid: 'forbid',
                opPraise: 'op_praise '
            },
            findId: {
                sharefloat: 'j_sharebox',
                floatCross: 'j_sharecross',
                shareContentid: 'j_ishare_content',
                sharetitle: 'j_shareTitle',
                sharecnum: 'j_ishare_num',
                spicid: 'j_ishare_pic',
                userInfo: 'j_sinaInfo',
                userName: 'j_user_name',
                userImg: 'j_user_img',
                shareImg: 'j_ishare_img',
                insertDom: ['j_com_pics_op', 'j_com_art_op', ]
            }
        },
        _ucPlatName = {
            iweibo: 'kSinaWeibo',
            ifriend: 'kWeixin',
            ifcircle: 'kWeixinFriend',
            asweibo: 'SinaWeibo',
            afriend: 'WechatFriends',
            afcircle: 'WechatTimeline'
        },
        _loginLayer,
        self = this,
        waplogin = (typeof(WapLogin) == 'function') ? (new WapLogin()) : this;
    personal_url = 'http://my.sina.cn/?vt=4',
        _fromPlat = {
            qqfriend: "qqfriend",
            qqweichat: "qqweichat",
            ucfriend: "ucfriend",
            ucweichat: "ucweichat"
        },
        _frompre = readConfig.share.shareurl.indexOf('?') >= 0 ? '&' : '?',
        _shareDocUrl = __docConfig.__gspsId ? "http://doc.sina.cn/?id=" + __docConfig.__gspsId : __docConfig.__docUrl;

    /**
     * 调用QQ/UC浏览器浏览器
     */
    function myfunction(obj, title, content, url, platform) {

        if (isucBrowser) {
            /**
             * 使用 getPos.getNodeInfoById("IdName")方法，返回一个数组对象，依次为【X轴,Y轴,宽度,高度】,如果ID不存在，则返回FALSE
             */
            var getPos = {
                getTop: function(e) {
                    var offset = e.offsetTop;
                    if (e.offsetParent != null) offset += getPos.getTop(e.offsetParent);
                    return offset;
                },
                getLeft: function(e) {
                    var offset = e.offsetLeft;
                    if (e.offsetParent != null) offset += getPos.getLeft(e.offsetParent);
                    return offset;
                },
                getCss3offsetTop: function(e) {
                    var css3offset = getComputedStyle(e, null).webkitTransform;
                    if (css3offset == "none") {
                        var css3offsetTop = 0;
                    } else { //存在CSS3属性
                        var css3offsetTop = parseInt(css3offset.split(",")[5].replace(")", ""))
                    }
                    if (e.parentNode.tagName != "BODY") css3offsetTop += getPos.getCss3offsetTop(e.parentNode);
                    return css3offsetTop;
                },
                getCss3offsetLeft: function(e) {
                    var css3offset = getComputedStyle(e, null).webkitTransform;
                    if (css3offset == "none") {
                        var css3offsetLeft = 0;
                    } else { //存在CSS3属性
                        var css3offsetLeft = parseInt(css3offset.split(",")[4])
                    }
                    if (e.parentNode.tagName != "BODY") css3offsetLeft += getPos.getCss3offsetLeft(e.parentNode);
                    return css3offsetLeft;
                },
                getNodeInfoById: function(e) {
                    var myNode = document.getElementById(e);
                    if (myNode) {
                        var pos = [getPos.getLeft(myNode) + getPos.getCss3offsetLeft(myNode), getPos.getTop(myNode) + getPos.getCss3offsetTop(myNode), myNode.offsetWidth, myNode.offsetHeight]
                        return (pos)
                    } else {
                        return ""
                    }
                }
            }

            if (typeof(ucweb) != "undefined") {
                var UCBrowserText = ucweb.startRequest("shell.page_share", [title, content, url, platform, '', '我们正在看【' + title + '】，一起来看吧', getPos.getNodeInfoById(obj)]);
                //var UCBrowserText = ucweb.startRequest("shell.page_share", ['', '使用UC浏览器分享js API', 'http://wap.uc.cn', '', 'invisible:QQ,Qzone', 'UC浏览器','']);
            } else if (typeof(ucbrowser) != "undefined") {

                if (platform == _platforms.sweibo[0]) {
                    platform = _ucPlatName.iweibo;
                } else if (platform == _platforms.friend[0]) {
                    platform = _ucPlatName.ifriend;
                    url += _frompre + "from=" + _fromPlat.ucfriend;
                } else if (platform == _platforms.fsircle[0]) {
                    platform = _ucPlatName.ifcircle;
                    url += _frompre + "from=" + _fromPlat.ucweichat;
                }


                ucbrowser.web_share(title, content, url, platform, '', '@手机新浪网', obj); //title 指html的title
                //ucbrowser.web_share('title', 'content', 'url', 'platform', 'disablePlatform', 'source', 'htmlID');
            } else {
                //alert("sorry,your browser version not support!");
            }

        } else if (isqqBrowser && !isWeixin) {
            if (platform == _platforms.friend[0]) {
                platform = 1;
                url += _frompre + "from=" + _fromPlat.qqfriend;
            } else if (platform == _platforms.fsircle[0]) {
                platform = 8;
                url += _frompre + "from=" + _fromPlat.qqweichat;
            } else {
                platform = "";
            }

            var shareObj = {
                    "url": url,
                    "title": title,
                    "description": content, //android、IOS文字描述，若无，则显示的为“我在看【XXX】，分享给你，快来看！”
                    "img_url": _shareContent.iImgsrc,
                    "img_title": title, //没有显示
                    "to_app": platform,
                    "cus_txt": "请输入此时此刻想要分享的内容" //ios文字描述，若无，则显示的为“我在看【XXX】，分享给你，快来看！”
                },
                success = -1;

            if (typeof(browser) != "undefined") {
                //if(typeof(browser.app) != "undefined" && version.qq >= 5.4 )
                if (typeof(browser.app) != "undefined" && isqqBrowser == bLevel.qq.higher)
                    success = browser.app.share(shareObj);
            }
            //else if(typeof(window.qb) != "undefined" && version.qq < 5.4 && platform_os == 'Android')
            else if (typeof(window.qb) != "undefined" && isqqBrowser == bLevel.qq.lower) {
                window.qb.share(shareObj);
            } else {
                //alert("sorry,your browser version not support!");
            }

            /*if( success < 0)
			alert("QQ browser share fail !!!");	    	
			*/
        } else {
            //alert("This is not uc or qq browser and you can not share content");
        }

        //调出浮层后，不管结果如何，都需要将浮层隐藏
        _shareLayerStatus(_floatstatus.fade);
        return;
    }


    this.login = function(login, callback, cbparam, cbparam1) //登录状态、回调函数、回调参数1、回调参数2
        {

            var argsnum = arguments.length;

            //在window中判断有没有SINA_OUTLOGIN_LAYER来确定有没有浮层对象及是否登录
            if (window["SINA_OUTLOGIN_LAYER"] && !login) {
                //获取登录对象
                _loginLayer = window["SINA_OUTLOGIN_LAYER"];
                //初始化浮层
                _loginLayer.set('sso', {
                    entry: 'wapsso'
                }).init();
                //将呼出浮层绑定到相应的目标元素上

                _loginLayer.show();

                //登陆成功后的回调事件注册多个login_success事件来对应不同按钮的登陆行为		
                _loginLayer.register("login_success", function(re) {

                    //表示登陆成功
                    self.updateUserInfo(re);

                    switch (argsnum) {
                        case 2:
                            callback();
                            break;
                        case 3:
                            callback(cbparam);
                            break;
                        case 4:
                            callback(cbparam, cbparam1);
                            break;
                        default:
                            window.location.href = window.location.href;
                            break;
                    }
                });

                //关闭浮层触发的事件
                _loginLayer.register("layer_hide", function() {
                    if (typeof(callback) != 'undefined') {
                        callback = null;
                    }
                });
            }

            return;
        }


    this.updateUserInfo = function(re) {
        if (typeof(re) != 'undefined' && typeof(re.nick) != 'undefined') {
            //cms config
            if (typeof(__userConfig__) == 'undefined' || !window.__userConfig__) {
                window.__userConfig__ = {};
            }
            __userConfig__.__isLogin = true;
            __userConfig__.__unick = re.nick;
            __userConfig__.__uface = re.portrait;
            __userConfig__.__uid = re.uid;

            //global config
            if (!window.globalConfig || typeof(globalConfig) != 'undefined') {
                globalConfig = {};
            }
            globalConfig.isLogin = true;

            //update userface
            if ($('#loginImg').find('img').length > 0) {
                $('#loginImg').find('img').attr('src', portrait);
            }

            return;
        }
    }

    /**
		@describe   : 分享、点赞、收藏请求处理事件
		@param
	**/
    //分享请求
    function _sinaShare() {

        var url = readConfig.share.targeturl,
            oPost_url = '',
            tj_ch = __docConfig.__tj_ch ? __docConfig.__tj_ch : 'news';

        if (!!url == false) {
            return false;
        }

        //兼容URL
        if (url.indexOf('?') == -1) {
            url = url + '?';
        }

        var csrftime = parseInt(new Date().getTime() / 1000),
            codeStr = csrftime + "85e47ac07ac9d6416" + __userConfig__.__uid, //"2143409933";
            csrfcode = hex_md5(codeStr),
            ititle = encodeURIComponent(_shareContent.iTitle),
            icontent = encodeURIComponent(_shareContent.iContent),
            iimage = encodeURIComponent(_shareContent.iImgsrc),
            iurl = encodeURIComponent(_shareContent.iUrl);

        oPost_url = url + "&csrftime=" + csrftime + "&csrfcode=" + csrfcode + "&title=" + ititle + "&content=" + icontent + "&pic=" + iimage + "&url=" + iurl + "&isdoc=" + _shareContent.isdoc + "&jsoncallback=shareCallback&tj_ch=" + tj_ch;

        _jsonp(oPost_url);

        _shareLayerStatus(_floatstatus.fade);

        return;
    }

    window.shareCallback = function(data) {
        var remindTxt = '';
        switch (data.code) {
            case -3:
                remindTxt = '分享失败!';
                break;
            case -2:
                remindTxt = '未登录!';
                break;
            case -1:
                remindTxt = '请求非法！';
                break;
            case 1:
                remindTxt = '分享成功！';
                break;
            default:
                remindTxt = '未知状态码 ' + data.code;
                break;
        }
        _showRemind(remindTxt, true);
        _sudaLog('public_sinashare_success');
    }


    /*再此插入提示浮层、监听事件、修改浮层状态*/
    var _aTimer = null;

    /*插入提示浮层*/
    function _creatRemind() {

        var arr = [];
        if ($('.re_box').length < 1) {
            //插入提示浮层
            arr.push('<section>');
            arr.push('<div class="re_box">');
            arr.push('<div class="resault_f re_simple">收藏失败!</div>');
            arr.push('<div class="resault_f re_notice">');
            arr.push('<div>');
            arr.push('<p>您已收藏，请到个人中心查看</p>');
            arr.push('</div>');
            arr.push('<span class="re_cancel">知道了</span>');
            arr.push('<span class="re_ok" data-url="' + personal_url + '">去看看</span>');
            arr.push('</div>');
            arr.push('</div>');
            arr.push('</section>');

            $('body').append(arr.join(''));
            _remindListner();
        }
        return;
    }

    function _showRemind(txt, isTrue) {
        if ($('.re_box').length <= 0) {
            _creatRemind();
        }

        if (_aTimer)
            clearTimeout(_aTimer);

        if ($('.resault_f').eq(0).hasClass('showFadeAnimate')) {
            $('.resault_f').eq(0).html('').hide().removeClass('showFadeAnimate');
        }

        if ($('.resault_f').eq(1).hasClass('showAnimate')) {
            $('.resault_f').eq(1).find('p').html('');
            $('.resault_f').eq(1).hide().removeClass('showAnimate');
        }

        if (typeof(isTrue) == 'undefined') {
            return;
        } else if (isTrue) {
            $('.resault_f').eq(0).show().html(txt).addClass('showFadeAnimate');
            _aTimer = setTimeout(function() {
                $('.resault_f').eq(0).html('').hide().removeClass('showFadeAnimate');
            }, 5000);
        } else if (!isTrue) {
            $('.resault_f').eq(1).show().addClass('showAnimate').find('p').html(txt);
        }
    }

    function _remindListner() {
        $('.re_cancel').each(function() {
            $(this).on('click', function() {
                _showRemind();
            });
        });

        $('.re_ok').each(function() {
            $(this).on('click', function() {
                _showRemind();
                window.location.href = $(this).data('url');
            });
        });
    }

    /*插入正文操作区节点*/
    function _creatOperate() {
        var arr = [],
            isArt = 1,
            comment = [],
            originpic = [];

        var commentnum = __docConfig.__cmntTotal || 0;
        comment.push(__docConfig.__cmntListUrl ? __docConfig.__cmntListUrl : 'javascript:void(0)');
        comment.push(commentnum > 10000 ? (parseInt(commentnum / 10000) + '万') : commentnum);
        originpic.push(readConfig.originpic ? readConfig.originpic : 'javascript:void(0)');

        if (readConfig.isArt) {
            isArt = 1;
            if (isqqBrowser || isucBrowser) {
                arr.push('<div class="platforms_small">');
                arr.push('<ul>');
                arr.push('<li class="shareText"> 分享</li>');
                arr.push('<li>');
                arr.push('<ul>');
                arr.push('<li></li>');
                arr.push('<li><span class="' + _platBox.findClass.shareIcon + ' splat_ico sina_samll" data-platform="' + _platforms.sweibo[0] + '"  data-sudaclick="public_sinaweibo"></span></li>');
                arr.push('<li><span class="' + _platBox.findClass.shareIcon + ' splat_ico friend_small" data-platform="' + _platforms.friend[0] + '"  data-sudaclick="public_wechatfriends"></span></li>');
                arr.push('<li><span class="' + _platBox.findClass.shareIcon + ' splat_ico fcircle_small" data-platform="' + _platforms.fsircle[0] + '" data-sudaclick="public_wechattimeline"></span></li>');
                arr.push('<li></li>');
                arr.push('</ul>');
                arr.push('</li>');
                arr.push('</ul>');
                arr.push('</div>');
                arr.push('<div class="share_op">');
                arr.push('<ul>');
            } else {
                arr.push('<div class="share_op">');
                arr.push('<ul>');

                arr.push('<li><span class="share_ico art_share ' + _platBox.findClass.shareBtn + '" data-sudaclick="public_new_share">分享</span></li>');
            }

            arr.push('<li><a href="' + comment[0] + '" class="share_ico art_comment" data-sudaclick="public_comment">' + comment[1] + '</a></li>');
            arr.push('<li><a class="share_ico op_praise art_praise" data-sudaclick="public_praise">赞</a></li>');
            arr.push('<li class="favor"><a class="share_ico art_collect ' + _platBox.findClass.addFavor + '" href="javascript:void(0);"  data-sudaclick="public_favor">收藏</a></li>');
            arr.push('</ul>');
            arr.push('</div>');

        } else {
            isArt = 0;

            arr.push('<ul >');
            arr.push('<li><a id="weibo_share" href="javascript:void(0);" class="share_ico pic_share ' + _platBox.findClass.shareBtn + '" data-sudaclick="picShare">分享</a></li>');
            arr.push('<li><a id="comment" href="' + comment[0] + '" class="share_ico pic_comment " data-sudaclick="public_comment">' + comment[1] + '</a></li>');
            arr.push('<li><a id="updown" href="javascript:void(0);" class="share_ico op_praise pic_praise" data-sudaclick="public_praise">赞</a></li>');
            arr.push('<li><a id="down" href="' + originpic[0] + '" class="share_ico pic_original" target="_blank" data-sudaclick="public_origin">原图</a></li>');
            arr.push('</ul>');
        }

        setTimeout(function() {
            $('#' + _platBox.findId.insertDom[isArt]).append(arr.join(''));
        }, 2000);

        return;
    }


    //jsonp模板函数
    function _jsonp(url) {
        //使用$.ajax发起jsonp请求，会在url请求的时候自动添加callback=json1的字符串导致报错，换成普通插入DOM节点的形式可以避免此种情况
        var head = document.getElementsByTagName('head')[0],
            script = document.createElement('script');

        script.src = url;
        script.charset = 'utf-8';
        head.appendChild(script);

        /*$.ajax({
                  url : url,
                  async : false,
                  type : 'GET',
                  dataType : 'jsonp',
                  success : function(data){
                  },
                  error : function(xhr, type){
                  }
              });*/
    }

    /*点赞初始化*/
    function _addVoteInit() {
        if (typeof __pkeys != 'undefined' && typeof __pValue != 'undefined') {
            var sUrl_init = 'http://data.api.sina.cn/api/count/count.php?act=',
                backurl = __docConfig.__docUrl || localhref.split('?')[0] || '',
                params = '&backurl=' + backurl + '&tj_ch=' + cur_domain + '&ch=&type=1&pkey=' + __pkeys + '&p=' + __pValue + '&channel=' + cur_domain + '&jsonpcallback=',
                sUrl1 = sUrl_init + 'show' + params + 'getPraise',
                sUrl3 = sUrl_init + 'add' + '&tj_type=praise' + params + 'addPraise',
                $oPraiseBtns = $('.' + _platBox.findClass.opPraise);

            if ($oPraiseBtns.length > 0) {
                $oPraiseBtns.data('url', sUrl1).data('status', 0);
                _jsonp(sUrl1);
            }

            $oPraiseBtns.each(function() {
                $(this).on('click tap', function() {
                    _showRemind();

                    //已点过，则退出
                    var clickObj = $(this);
                    if (clickObj.hasClass('on') || clickObj.data('loading') == 'yes') {
                        return;
                    } else {
                        $(this).data('url', sUrl3).data('status', 1);
                        _jsonp(sUrl3);
                    }
                });
            });
        }
    }

    window.getPraise = function(data) {
        var count = data.count > 0 ? (data.count > 10000 ? (parseInt(data.count / 10000) + '万') : data.count) : '赞';
        $('.' + _platBox.findClass.opPraise).html(count).data('loading', 'no');
        _opConfig.voteNum = data.count;
    };
    window.addPraise = function(data) {
        if (data.status == 0) {
            $('.' + _platBox.findClass.opPraise).each(function() {
                if ($('.' + _platBox.findClass.opPraise).data('loading') == 'no') {
                    var count = data.count > 0 ? (data.count > 10000 ? (parseInt(data.count / 10000) + '万') : data.count) : '赞';
                    $('.' + _platBox.findClass.opPraise).text(count).addClass('on');
                    _opConfig.voteNum = data.count;
                }
            });
        } else {
            //alert('点赞失败！');
        }
    };

    //收藏监听事件
    function _addFavorInit() {
            $('.' + _platBox.findClass.addFavor).each(function() {
                favorEvent($(this), _favorConfig.isInit);
                $(this).on('click tap', function() {
                    _showRemind();
                    favorEvent($(this), _favorConfig.isAdd);
                });
            });
        }
        //收藏请求
    function favorEvent(obj, isTrue) {
        if (typeof __colleid != 'undefined' && typeof __collekey != 'undefined') {
            var uid = sudaMapConfig.uid || '',
                docid = __docConfig.__gspsId || '',
                backurl = __docConfig.__docUrl || localhref.split('?')[0] || '',
                jsoncallback = '',
                isTrue = (typeof(isTrue) != 'undefined') ? (isTrue ? _favorConfig.isAdd : _favorConfig.isInit) : _favorConfig.isAdd;

            if (__userConfig__.__isLogin) {

                if (obj.hasClass('on')) {
                    if (isTrue && _favorConfig.isAdd) {
                        var remindTxt = '您已收藏，请到个人中心查看';
                        _showRemind(remindTxt, false);
                    }
                    return;
                }

                if (!isTrue && !_favorConfig.isInit) {
                    jsoncallback = '&op=isFav&jsoncallback=initFavorCallback';
                } else {
                    jsoncallback = '&tj_type=favor&jsoncallback=addFavorCallback';
                }

                //收藏操作 
                var url = 'http://o.my.sina.cn/favorite?uid=' + uid + '&docid=' + docid + '&backurl=' + backurl + '&tj_ch=' + cur_domain + '&ch=&csrftime=' + __colleid + '&csrfcode=' + __collekey + '&channel=' + cur_domain + jsoncallback;
                _jsonp(url);

            } else if (isTrue && _favorConfig.isAdd) {
                _shareLayerStatus(_floatstatus.login, favorEvent, obj, true);
            }

            //return;
        }
    }

    //收藏回调函数
    window.addFavorCallback = function(data) {
        //请求发送成功，根据获取结果显示不同提示内容
        var add = $('.' + _platBox.findClass.addFavor).eq(0);
        add.data('loading', 'no');
        if (data && data.code == 1) {
            add.addClass('on');
            add.addClass('on').html('已收藏');

            var remindTxt = '您已收藏，请到个人中心查看';
            _showRemind(remindTxt, false);
        } else if (data && data.code == 2) {
            document.location.href = data.data;
        } else {
            var remindTxt = '收藏失败!';
            _showRemind(remindTxt, true);
        }

    };

    window.initFavorCallback = function(data) {
        //请求发送成功，根据获取结果显示不同提示内容
        var add = $('.' + _platBox.findClass.addFavor).eq(0);
        if (data && data.code == 1 && data.data.id) {
            add.addClass('on').html('已收藏');
        }
    };


    /**
		@describe   : 分享组件，包含监听事件、UI更新、数据刷新
		@param
	**/

    //插入分享浮层
    function _creatShareFloat() {

        var arr = [],
            userInfo = [],
            contentNum = [];

        contentNum.push((_contentConfig.contentMax - readConfig.share.content.length < 0) ? 'notice' : '');
        contentNum.push(_contentConfig.contentMax - readConfig.share.content.length);


        //初始化值
        if (typeof(__userConfig__) != 'undefined') {
            if (typeof(__userConfig__.__uface) != 'undefined' && typeof(__userConfig__.__unick) != 'undefined') {
                userInfo.push(__userConfig__.__uface ? __userConfig__.__uface : _contentConfig.basePath + _contentConfig.headimgsrc);
                userInfo.push(__userConfig__.__unick ? __userConfig__.__unick : '新浪用户');
            } else {
                userInfo.push(_contentConfig.basePath + _contentConfig.headimgsrc);
                userInfo.push('新浪用户');
            }
        } else {
            userInfo.push(_contentConfig.basePath + _contentConfig.headimgsrc);
            userInfo.push('新浪用户');
        }

        //插入浮层节点
        arr.push('<section>');
        arr.push('<div class="shareBg" id="' + _platBox.findId.sharefloat + '">');
        arr.push('<div class="sharebox">');
        arr.push('<div class="float_cross fTitle" id="' + _platBox.findId.floatCross + '" data-sudaclick="public_share_close"></div>');
        arr.push('<div class="shareTitle fTitle" id="' + _platBox.findId.sharetitle + '">分享至微博</div>');
        arr.push('<div class="shareZone">');
        arr.push('<div class="platforms_big ' + _platBox.findClass.platforms_big + '">');
        arr.push('<ul>');
        arr.push('<li>');
        arr.push('<span class="' + _platBox.findClass.shareIcon + ' splat_ico sina_big" data-platform="' + _platforms.sweibo[0] + '" data-sudaclick="public_sinaweibo"></span>');
        arr.push('<p>' + _platforms.sweibo[1] + '</p>');
        arr.push('</li>');
        arr.push('<li>');
        arr.push('<span class="' + _platBox.findClass.shareIcon + ' splat_ico friend_big" data-platform="' + _platforms.friend[0] + '" data-sudaclick="public_wechatfriends"></span>');
        arr.push('<p>' + _platforms.friend[1] + '</p>');
        arr.push('</li>');
        arr.push('<li>');
        arr.push('<span class="' + _platBox.findClass.shareIcon + ' splat_ico fcircle_big" data-platform="' + _platforms.fsircle[0] + '" data-sudaclick="public_wechattimeline"></span>');
        arr.push('<p>' + _platforms.fsircle[1] + '</p>');
        arr.push('</li>');
        arr.push('</ul>');
        arr.push('</div>');
        arr.push('<div class="sinaShareContent ' + _platBox.findClass.sinaShareContent + '">');
        arr.push('<div class="sinaInfo" id="' + _platBox.findId.userInfo + '">');
        arr.push('<span class="user_img" id="' + _platBox.findId.userImg + '">');
        arr.push('<img src="' + userInfo[0] + '"  style="width:100%;height:100%;"\/>‘');
        arr.push('</span>');
        arr.push('<span class="user_name" id="' + _platBox.findId.userName + '">' + userInfo[1] + '</span>');
        arr.push('</div>');
        arr.push('<div class="icontent ' + _platBox.findClass.shareContentZone + '">');
        arr.push('<textarea class="ishare_content" id="' + _platBox.findId.shareContentid + '">' + (readConfig.share.content ? readConfig.share.content : readConfig.share.shorttitle) + '</textarea>');
        arr.push('<span class="ishare_img">');
        arr.push('<img class="shareimg_style" src="' + (__docConfig.__mainPic ? __docConfig.__mainPic : _contentConfig.shareimgsrc) + '" id="' + _platBox.findId.shareImg + '" style="width:32px;height:32px"/>');
        arr.push('</span>');
        arr.push('<span class="ishare_num"><span class="  ' + contentNum[0] + '" id="' + _platBox.findId.sharecnum + '">' + contentNum[1] + '</span>字</span>');
        arr.push('</div>');
        arr.push('<button class="isubmit ' + _platBox.findClass.submitBtn + '" data-sudaclick="public_sinashare_submit">立即分享</button>');
        arr.push('</div>');
        arr.push('</div>');
        arr.push('</div>');
        arr.push('</div>');
        arr.push('</section>');

        $('body').append(arr.join(''));

        //分享组件初始化各监听事件
        _initFloatListner();

        return;
    }

    //分享组件初始化各监听事件
    function _initFloatListner() {
        _addFloatShareListner();
        _addCloseListner(); //监听关闭浮层事件		
        _addContentListner(true); //监听微博分享内容事件
        _addSubmitListner(); //提交微博分享监听事件

        $('.shareBg').css("height", (bodyHeight + 50) + "px");
    }

    function getEvent() //同时兼容ie和ff的写法
        {
            if (document.all) return window.event;
            func = getEvent.caller;
            while (func != null) {
                var arg0 = func.arguments[0];
                if (arg0) {
                    if ((arg0.constructor == Event || arg0.constructor == MouseEvent) ||
                        (typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
                        return arg0;
                    }
                }
                func = func.caller;
            }
            return null;
        }

    this.wantShare = function(isTrue) {
        if (isTrue) {
            _updata();
        }
        if ($('.shareBg').length <= 0) {
            _creatShareFloat(); //插入分享浮层
        }
        _showRemind();

        //判断是否为qq&uc，否则弹出微博页面
        if ((isqqBrowser > bLevel.qq.lower || isucBrowser) && !isWeixin) {
            _shareLayerStatus(_floatstatus.platlist);
        } else {
            _goSinaShare();
        }
    }

    function _addFloatShareListner() {
        $('.' + _platBox.findClass.shareIcon).on('click', function() {});
    }

    function _addShareListner() {

        window.addEventListener('click', function(ev) {
            var tarObj = ev.target || getEvent().target,
                obj = _updata($(tarObj));

            if (($(tarObj).hasClass(_platBox.findClass.shareBtn) ||
                    $(tarObj).parents('.j_share_btn').length > 0 ||
                    $(tarObj).parents('.' + _platBox.findClass.shareBtn).length > 0) && window.ishare) {
                _preventEvent(ev);
                self.wantShare();
            } else if ($(tarObj).hasClass(_platBox.findClass.shareIcon)) {
                if ($('.shareBg').length <= 0) {
                    _creatShareFloat(); //插入分享浮层					
                }
                _showRemind();
                if (obj._platform == _platforms.sweibo[0]) {
                    _goSinaShare();
                } else if (isucBrowser) {
                    $('#j_comment_nav').hide();
                    setTimeout(function() {
                        myfunction(obj._obj, obj._title, obj._content, localhref, obj._platform);
                    }, 300);

                    setTimeout(function() {
                        $('#j_comment_nav').show();
                    }, 600);
                } else {
                    myfunction(obj._obj, obj._title, obj._content, localhref, obj._platform);
                }

            }

            var loginMask = $('#ST_outLogin_mask'),
                shareFloat = $('#j_sharebox');

            if (loginMask.length > 0 && shareFloat.length > 0 && shareFloat.css('display') != 'none') {
                if (loginMask.css('display') != 'none') {
                    _hideFloatCross(true);
                } else if (loginMask.css('display') == 'none') {
                    _hideFloatCross(false);
                }
            }

        });
    }

    //当分享平台浮层弹出时，需要更新关闭浮层的状态
    function _hideFloatCross(isTrue) {
        if (isTrue) {
            $('#j_sharecross').hide();
        } else {
            $('#j_sharecross').show();
        }
    }

    //更新分享数据
    function _updata(pobj) {
        var objr = {
            _obj: _platBox.findId.spicid,
            _title: readConfig.share.shorttitle ? readConfig.share.shorttitle : $('title').html(),
            //_content : readConfig.share.content?readConfig.share.content:$("meta[name='description']").attr('content'),
            _content: readConfig.share.content ? readConfig.share.content : $("title").html(),
            //_url : readConfig.share.shareurl,
            _url: _shareDocUrl ? _shareDocUrl : __docConfig.__docUrl,
            _platform: pobj ? pobj.data('platform') : ''
        };

        _shareContent.iTitle = objr._title;
        _shareContent.iContent = objr._content;
        _shareContent.iImgsrc = __docConfig.__mainPic ? __docConfig.__mainPic : ($('#' + objr._obj).attr('src') ? $('#' + objr._obj).attr('src') : _contentConfig.shareimgsrc);
        _shareContent.iUrl = objr._url;
        _shareContent.iBackurl = objr._url;
        _shareContent.isdoc = readConfig.share.isdoc ? readConfig.share.isdoc : 0;

        return objr;
    }

    //更新新浪微博分享内容并show
    function _goSinaShare() {
        var leavenum = _contentConfig.contentMax - _shareContent.iContent.length;
        //更新微博分享的内容、剩余字数、图片
        $("#" + _platBox.findId.shareContentid).text(_shareContent.iContent);
        $('#' + _platBox.findId.sharecnum).html(leavenum);
        if (leavenum < 0) {
            $('#' + _platBox.findId.sharecnum).addClass('notice');
            $('.' + _platBox.findClass.submitBtn).addClass(_platBox.findClass.forbid);
        } else {
            $('#' + _platBox.findId.sharecnum).removeClass('notice');
            $('.' + _platBox.findClass.submitBtn).removeClass(_platBox.findClass.forbid);
        }
        $('#' + _platBox.findId.shareImg).attr('src', _shareContent.iImgsrc);

        //显示分享浮层
        _shareLayerStatus(_floatstatus.share);
    }


    function _addCloseListner() {
        $('#' + _platBox.findId.floatCross).on('click ', function() {
            //_showRemind();
            //setTimeout(function(){_shareLayerStatus( _floatstatus.fade )},50);	//给浏览器隐藏键盘反应事件，否则会出现部分半覆盖的情况
            _shareLayerStatus(_floatstatus.fade);
        });
        return;
    }

    var inputTop = '',
        bodyHeight = document.documentElement.clientHeight;
    //输入框监听事件/恢复	
    function _addContentListner(flag) {
        var $sinaShare = $('.' + _platBox.findClass.sinaShareContent),
            $contentzone = $('.' + _platBox.findClass.shareContentZone),
            $contentedit = $('#' + _platBox.findId.shareContentid),
            $userInfo = $('.' + _platBox.findClass.sinaInfo),
            $sharefloat = $('#' + _platBox.findId.sharefloat),
            $leavenum = $('#' + _platBox.findId.sharecnum),
            $submitbtn = $('.' + _platBox.findClass.submitBtn);


        var touchEvent = function() {
            if ($sinaShare.css('display') == 'block') {
                var $contentVal = document.getElementById(_platBox.findId.shareContentid).value,
                    $leaveval = _contentConfig.contentMax - $contentVal.length;
                $leavenum.html($leaveval);
                if ($leaveval < 0 || $leaveval == _contentConfig.contentMax) {
                    $leavenum.addClass('notice');
                    $submitbtn.addClass(_platBox.findClass.forbid);
                } else {
                    $leavenum.removeClass('notice');
                    $submitbtn.removeClass(_platBox.findClass.forbid);
                }
                _shareContent.iContent = $contentVal;
            }
        };

        if (!flag) {
            $contentzone.css({
                height: '140px'
            });
            $contentedit.attr('rows', _contentConfig.contentRows[1]);
        } else {

            $('#' + _platBox.findId.shareContentid)
                .on('click tap', function() {
                    var txt = $contentedit.html();

                    _showRemind();
                    $contentedit.focus();
                })
                .on('keyup', touchEvent)
                .focus(function() {
                    $contentzone.css({
                        height: '85px'
                    });
                    $(this).attr('rows', _contentConfig.contentRows[0]);
                    /*$('.j_sinaShareContent').css({
					'top':'65%'
				});		*/
                    $('.sharebox').css({
                        'margin-top': '40px'
                    });
                    $('.shareBg').css("height", (bodyHeight + 50) + "px");
                })
                .blur(function() {
                    $(this).attr('rows', _contentConfig.contentRows[1]);
                    //$sinaShare.css('bottom',inputTop);
                    /*$('.j_sinaShareContent').css({
					'top':'50%'
				});*/
                    $('.sharebox').css({
                        'margin-top': '10px'
                    });
                    $('.shareBg').css("height", (bodyHeight + 10) + "px");
                });

            document.addEventListener('touchend', touchEvent, false);

        }
        return;
    }

    //微博分享提交监听事件
    function _addSubmitListner() {
        $('.' + _platBox.findClass.submitBtn).each(function() {
            $(this).on('click', function() {
                _showRemind();

                if (!$(this).hasClass(_platBox.findClass.forbid))
                    _sinaShare();
            })
        });
        return;
    }

    /**
    		禁止正文滚动控制
		添加触摸移动监听事件
	**/

    var handler = function(event) {
        event.preventDefault();
    };

    function _wrapScrollListner(cStatus) {
        var bodyListener = document.body;

        if (cStatus) {
            //bodyListener.addEventListener('touchmove', handler, false);
            $(document.body).css({
                "overflow": "hidden",
                "position": "absolute",
                "top": "0px"
            });
        } else {
            //bodyListener.removeEventListener('touchmove', handler, false);
            $(document.body).css({
                "overflow": "auto",
                "position": "relative"
            });
        }
        return;
    }
    var curTop = document.body.scrollTop,
        oMeta = document.getElementsByName('viewport')[0],
        mateContent = {
            hide: "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui",
            show: "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
        },
        isScrollTop = false;


    /**
		修改浮层显示状态
		添加动画效果
	**/
    function _shareLayerStatus(sStatus, callback, arg1) {
        sStatus = sStatus ? sStatus : _floatstatus.login;
        switch (sStatus) {
            case _floatstatus.login:
                loginStatus(callback, arg1);
                break;
            case _floatstatus.platlist:
                if (!isScrollTop) {
                    curTop = document.body.scrollTop;
                }
                oMeta.content = mateContent.hide;
                setTimeout(function() {
                    window.scrollTo(0, 1);
                }, 200);
                isScrollTop = true;

                _hideBody(true);
                //背景出现
                _showBg(_platBox.findId.sharefloat, true);
                _showEle(_platBox.findId.floatCross, true);
                _showEle(_platBox.findId.sharetitle, false);

                //禁止正文滚动
                //_wrapScrollListner( true );
                floatZoneStatus('.' + _platBox.findClass.platforms_big, true, _floatstatus.platlist);
                floatZoneStatus('.' + _platBox.findClass.sinaShareContent, false, _floatstatus.share);
                break;
            case _floatstatus.share:
                if (__userConfig__.__isLogin) {
                    if (!isScrollTop) {
                        curTop = document.body.scrollTop;
                    }
                    oMeta.content = mateContent.hide;
                    setTimeout(function() {
                        window.scrollTo(0, 1);
                    }, 200);
                    isScrollTop = true;

                    _hideBody(true);
                    //背景出现
                    _showBg(_platBox.findId.sharefloat, true);
                    _showEle(_platBox.findId.floatCross, true);
                    _showEle(_platBox.findId.sharetitle, true);

                    //禁止正文滚动
                    //_wrapScrollListner( true );
                    updateUserInfo();

                    //用户头像为空时，通过异步获取用户头像
                    if ($('#j_user_img').find('img').attr('src') == window.location.href || $('#j_user_img').find('img').attr('src') == "") {
                        _getUserInfo();
                    }

                    floatZoneStatus('.' + _platBox.findClass.platforms_big, false, _floatstatus.platlist);
                    floatZoneStatus('.' + _platBox.findClass.sinaShareContent, true, _floatstatus.share);
                    //_sudaLog( 'public_sinaweibo' );
                } else {
                    //waplogin.login (__userConfig__.__isLogin, _shareLayerStatus,_floatstatus.share);
                    myLogin(__userConfig__.__isLogin, _shareLayerStatus, _floatstatus.share);
                }
                break;
            case _floatstatus.fade:
                oMeta.content = mateContent.show;
                _hideBody(false);

                //隐藏背景+清除平台出现的动画
                _showBg(_platBox.findId.sharefloat, false);
                _showEle(_platBox.findId.floatCross, true);

                floatZoneStatus('.' + _platBox.findClass.platforms_big, false, _floatstatus.platlist);
                floatZoneStatus('.' + _platBox.findClass.sinaShareContent, false, _floatstatus.share);

                //还原正文滚动
                //_wrapScrollListner( false );

                //分享输入框恢复原高度
                _addContentListner(false);
                favorEvent($('.' + _platBox.findClass.addFavor), false);
                if (isScrollTop) {
                    document.body.scrollTop = curTop;
                }
                isScrollTop = false;
                break;
            default:
                break;
        }
        return;
    }

    function myLogin(login, callback, cbparam, cbparam1) {
        if (!__userConfig__.__isLogin) {
            waplogin.login(login, callback, cbparam, cbparam1);
        }
    }

    function _preventEvent(e) {
        //如果提供了事件对象，则这是一个非IE浏览器 
        if (e && e.preventDefault) {
            //阻止默认浏览器动作(W3C) 
            e.preventDefault();
        } else {
            //IE中阻止函数器默认动作的方式 
            window.event.returnValue = false;
        }
        return false;
    }

    function _hideBody(isTrue) {
        var bodyObj = $(document.body),
            body = bodyObj.children();

        for (var o = 0; o < body.length; o++) {
            if (body[o].tagName != 'SCRIPT' && body[o].tagName != 'NOSCRIPT' && $(body[o]).find('.shareBg').length <= 0) {

                if (isTrue && $(body[o]).css('display') != 'none') {
                    $(body[o]).data('show', 'show');
                    $(body[o]).hide();
                } else if (!isTrue) {
                    if ($(body[o]).data('show') == 'show' && $(body[o]).css('display') == 'none') {
                        $(body[o]).show();
                    } else {
                        $(body[o]).data('show', '');
                    }
                }
            }
        }

    }

    function updateUserInfo() {
        $('#' + _platBox.findId.userImg).find('img').attr('src', __userConfig__.__uface);
        $('#' + _platBox.findId.userName).html(__userConfig__.__unick);
    }

    //修改浮层样式，并添加动画
    function floatZoneStatus(obj, pStatus, isZoneFlag) {
        var oBox = $(obj),
            tBox = (isZoneFlag == _floatstatus.platlist) ? oBox.find('li') : oBox,
            flag = pStatus ? 1 : 0,
            animation = pStatus ? _contentConfig.animate[0] : '',
            pDisplay = pStatus ? 'block' : 'none';

        //修改平台列表的透明度		
        if (pStatus) {
            //先将平台的透明度设置为0，否则会出现闪的情况
            oBox.css({
                'opacity': 0
            });
            setTimeout(function() {
                oBox.css({
                    'opacity': flag
                });
            }, 250);
            tBox.css({
                '-webkit-animation-name': animation,
                'opacity': flag,
                'display': pDisplay
            });
            if (tBox != oBox) {
                oBox.css({
                    'display': pDisplay
                });
            }
        } else {
            tBox.css({
                '-webkit-animation-name': animation,
                'opacity': flag,
                'display': pDisplay
            });

            oBox.css({
                'opacity': flag,
                'display': pDisplay
            });
        }

        return;
    }

    //背景设置
    function _showBg(obj, flag) {
        var $sBox = $('#' + obj),
            $sBoxDisplay = $sBox.css('display');

        if ($sBoxDisplay == 'none' && flag)
            $sBox.show(3000);
        else if ($sBoxDisplay != 'none' && !flag)
            $sBox.hide('fast');

        return;
    }

    //修改元素显示/隐藏状态
    function _showEle(obj, flag) {
        if (!flag)
            $('#' + obj).hide();
        else {
            $('#' + obj).show();
        }

        return;
    }


    /**
     * 登陆界面浮层
     * @method  
     * @param：login-登录状态，callback-回调函数，cbparam-回调参数
     * @return
     */

    function loginStatus(callback, arg1) {
        //背景出现
        _showBg(_platBox.findId.sharefloat, false);

        //呼出登录浮层
        if (typeof(callback) != 'undefined' && typeof(arg1) != 'undefined') {
            myLogin(__userConfig__.__isLogin, callback, arg1);
        } else if (typeof(callback) != 'undefined') {
            myLogin(__userConfig__.__isLogin, callback);
        } else {
            myLogin(__userConfig__.__isLogin);
        }
    }

    //在登录后通过异步获取用户信息，此接口为过渡接口，现在更新用户信息，使用登录组件返回值提供的数据
    function _getUserInfo() {
        var url = _contentConfig.userInfoUrl + 'userCallback';
        _jsonp(url);

        return;
    }

    window.userCallback = function(re) {
        __userConfig__.__uface = re.result.data.userface;
        __userConfig__.__unick = re.result.data.uname;

        $('#' + _platBox.findId.userImg).find('img').attr('src', __userConfig__.__uface);
        $('#' + _platBox.findId.userName).html(__userConfig__.__unick);

        return;
    }

    function _sudaLog(sudaName) {
        var obj = {
            'name': sudaName,
            'type': '',
            'title': '',
            'index': '',
            'href': ''
        };
        if (typeof(window.suds_count) == 'function' || window.suds_count) {
            window.suds_count && window.suds_count(obj);
        }
    }

    /**
		@describe   : 添加分享组件DOM节点，再此控制需要插入的内容
		@param
	**/
    function _creatDOM() {
        $('head').append('<link rel="stylesheet" type="text/css" href="' + _contentConfig.cssPath + '"></link>');

        _creatOperate(); //插入操作区
        //_creatShareFloat();		//插入分享浮层
        //_creatRemind();			//插入提示浮层

        return;
    }

    this.init = function() {
        //生成节点，并绑定事件			
        _creatDOM();

        setTimeout(function() {
            _addFloatShareListner();
            _addShareListner(); //通过冒泡法监听点击事件
            _addVoteInit(); //初始化点赞
            _addFavorInit(); //初始化收藏
        }, 2200);

        return;
    }

    return;
}

function isloadqqApi() {
    var share = new MyShareClass();
    if (isqqBrowser) {
        var qjsrc = (version.qq < 5.4) ? qApiSrc.lower : qApiSrc.higher,
            qj = document.createElement('script'),
            body = document.getElementsByTagName('body')[0];

        //需要等加载过qq的接口文档之后，再去初始化分享组件
        qj.onload = function() {
            share.init();
        };
        qj.setAttribute('src', qjsrc);
        body.appendChild(qj);
    } else {
        share.init();
    }

    return;
}

function getPlantform() {
    ua = navigator.userAgent;
    //if((ua.indexOf("iPhone") > -1 || ua.indexOf("iPod") > -1) && !window.ucweb){     
    if ((ua.indexOf("iPhone") > -1 || ua.indexOf("iPod") > -1)) {
        //用户在使用IPHONE和IPOD平台的时候，且不存在UC 安卓特有的对象，这样才能被认定为使用IOS设备
        return 'iPhone';
    }

    return 'Android';
}

function is_weixin() {
    var ua = UA.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

function getVersion(str) {
    var arr = str.split('.'),
        version = parseFloat(arr[0] + '.' + arr[1]);

    return version;
}

function init() {
    platform_os = getPlantform();
    version.qq = isqqBrowser ? getVersion(UA.split('MQQBrowser/')[1]) : 0;
    version.uc = isucBrowser ? getVersion(UA.split('UCBrowser/')[1]) : 0;

    isWeixin = is_weixin();

    if ((isqqBrowser && version.qq < 5.4 && platform_os == 'iPhone') || (isqqBrowser && version.qq < 5.3 && platform_os == 'Android')) {
        isqqBrowser = bLevel.qq.forbid;
    } else if (isqqBrowser && version.qq < 5.4 && platform_os == 'Android') {
        isqqBrowser = bLevel.qq.lower;
    } else if (isucBrowser && ((version.uc < 10.2 && platform_os == 'iPhone') || (version.uc < 9.7 && platform_os == 'Android')))
    //uc，ios版低于10.2有问题，将其屏蔽
    {
        isucBrowser = bLevel.uc.forbid;
    }
    isloadqqApi();
    return;
}
setTimeout(function() {
    init();
}, 300);



// 加密
(function() {
    /*
     * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
     * Digest Algorithm, as defined in RFC 1321.
     * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
     * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
     * Distributed under the BSD License
     * See http://pajhome.org.uk/crypt/md5 for more info.
     */

    /*
     * Configurable variables. You may need to tweak these to be compatible with
     * the server-side, but the defaults work in most cases.
     */
    var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase        */
    var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance   */
    var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode      */

    /*
     * These are the functions you'll usually want to call
     * They take string arguments and return either hex or base-64 encoded strings
     */
    window.hex_md5 = function(s) {
        return binl2hex(core_md5(str2binl(s), s.length * chrsz));
    }

    function b64_md5(s) {
        return binl2b64(core_md5(str2binl(s), s.length * chrsz));
    }

    function str_md5(s) {
        return binl2str(core_md5(str2binl(s), s.length * chrsz));
    }

    function hex_hmac_md5(key, data) {
        return binl2hex(core_hmac_md5(key, data));
    }

    function b64_hmac_md5(key, data) {
        return binl2b64(core_hmac_md5(key, data));
    }

    function str_hmac_md5(key, data) {
        return binl2str(core_hmac_md5(key, data));
    }

    /*
     * Perform a simple self-test to see if the VM is working
     */
    function md5_vm_test() {
        return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
    }

    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length
     */
    function core_md5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;

            a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

            a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return Array(a, b, c, d);

    }

    /*
     * These functions implement the four basic operations the algorithm uses.
     */
    function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    }

    function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    /*
     * Calculate the HMAC-MD5, of a key and some data
     */
    function core_hmac_md5(key, data) {
        var bkey = str2binl(key);
        if (bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

        var ipad = Array(16),
            opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
        return core_md5(opad.concat(hash), 512 + 128);
    }

    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    function bit_rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    /*
     * Convert a string to an array of little-endian words
     * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
     */
    function str2binl(str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz)
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
        return bin;
    }

    /*
     * Convert an array of little-endian words to a string
     */
    function binl2str(bin) {
        var str = "";
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < bin.length * 32; i += chrsz)
            str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask);
        return str;
    }

    /*
     * Convert an array of little-endian words to a hex string.
     */
    function binl2hex(binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
                hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
        }
        return str;
    }

    /*
     * Convert an array of little-endian words to a base-64 string
     */
    function binl2b64(binarray) {
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i += 3) {
            var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
                else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
            }
        }
        return str;
    }

})()
