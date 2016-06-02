/**
 * 滚动、回滚和停止几秒的操作代码
 * @return {[type]} [description]
 */
function fixBtn(){
	/*先隐藏回顶部，根据回滚显示*/
	$('#backTop').hide();
	$('.topic-btn').show();
	var div = document.createElement('div'),
		timer = null;
	$(window).scroll(function(){
		clearInterval(timer);
		var sct = $(window).scrollTop();
		var sct2 = div.getAttribute('tmpTop') ? div.getAttribute('tmpTop') : 0;
		if(sct!=0){
			if(sct>sct2){
				//在向下滚动
				$('#backTop').hide();
				$('.topic-btn').show();
			}else{
				//在向上滚动(回滚)
				$('.topic-btn').hide();
				$('#backTop').show();
			}
		}
		div.setAttribute('tmpTop', sct);
		timer = setInterval(function(){
			//停止滚动
			if($(window).scrollTop() == sct){
				clearInterval(timer);
				$('#backTop').hide();
				$('.topic-btn').show();
				timer=null;
			}
		},3000);
	})
}
fixBtn();
