/**
 * 131227 create by shaofan
 *20140520 lijun
 */
var ua = navigator.userAgent.toLowerCase();
function detectWeixinApi() {
    if(ua.match(/MicroMessenger/i)!="micromessenger") {
        alert('请通过微信搜索"太平洋汽车网"并添加为好友，通过微信分享精彩内容。');
    } else {
        alert('请点击当前屏幕右上角按钮进行分享。');
    }
}

function shareTimeline(){
    var title = document.title;
    var url = location.href;
    if(/(iPad|iPhone|iPod)/i.test(ua)){
        ucbrowser.web_share(title, '', url, 'kWeixinFriend', '', '', '');
    }else{
        ucweb.startRequest("shell.page_share", [title, '', url, 'WechatTimeline', '', '', ''])
    };
}
 
(function(){
var bdshare_warp = document.getElementById('bdshare_warp');
if (!bdshare_warp) return;
var titleReg=/([^_]*)_?.*/;//匹配第一个空格前的字符
var shareTopic="#PCauto手机触屏版#";
var shareTitle=document.title.replace(titleReg,"$1");
var shareUrl=window.location.href;
//shareTitle=encodeURI(shareTitle);
window.bds_config = {
    'bdText' : shareTopic+shareTitle,
    'wbUid' : '2298836177',
    'snsKey' : {
        'tsina' : '3549659419'
    }
};

var openUrl='http://go.10086.cn/ishare.do?m=t&u='+shareUrl+'&t='+shareTitle+'&sid=090820323305',
        ifWeixin='', ifUC='', shareContent;

if(/MicroMessenger/i.test(ua)){
    ifWeixin = '<a class="weixin" onclick="detectWeixinApi();">微信</a>';
}
//只有UC浏览器支持调用分享到朋友圈
if(/UCBrowser/i.test(ua)){
    ifUC='<a class="timeline" onclick="shareTimeline();">朋友圈</a>'
}
shareContent =  '<div id="bdshare" class="bdshare_t bds_tools get-codes-bdshare">'+ifWeixin+ifUC+
                    '<a class="bds_tsina">新浪微博</a>'+
                    '<a class="bds_tqq">腾讯微博</a>'+
                    '<a class="bds_qzone">QQ空间</a>'+
                '</div>'+
                '<div class="shareAppDown" id="JshareAppDown">下载报价APP</div>';

bdshare_warp.innerHTML = shareContent;

var queue = [
{
config: {
id: 'bdshare_js',
data: 'type=tools&mini=1&uid=726255'
}
},
{
url: 'http://bdimg.share.baidu.com/static/js/shell_v2.js?t=' + new Date().getHours()
}
]
for(var i = 0,l = queue.length;i<l;i++){
var script = document.createElement('script');
if(queue[i].config){
var c = queue[i].config;
for(var j in c){
if(c.hasOwnProperty(j)){
script.setAttribute(j,c[j])
}
}
}
document.getElementsByTagName('head')[0].appendChild(script);
queue[i].url && (script.src = queue[i].url);
}
})();
/*点击分享右边按钮下载*/
if(topFn&&topFn.downAPPdom&&topFn.getId){
    topFn.downAPPdom(topFn.getId('JshareAppDown'),"CNT1218","CNT1198");
}
