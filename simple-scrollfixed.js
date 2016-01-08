//固定在距离顶部110px
//停在底部的footer.rec类之前
//滚动到supportus id时开始浮动
$(window).load(function(){
if($("#supportus").length >0){
var objtop = $("#supportus").offset().top;
var endfix = parseInt($('.rec').offset().top - $('#supportus').outerHeight()) - 110;
$(window).on("scroll",function(){
var scrolltop = $(window).scrollTop();
if((scrolltop>parseInt(objtop) - 110) && (scrolltop< endfix)){
$("#supportus").addClass('fixedsidebar').css({
"position":"fixed",
"top":"110px",
"width":"328px"
});
}else if(scrolltop >= endfix){
$("#supportus").addClass('fixedsidebar').css({
"position":"absolute",
"top": parseInt($('.rec').offset().top - $('#supportus').outerHeight() - 32)+'px'
})
}else{
$('#supportus').removeClass('fixedsidebar').css({
"position":"","top":""});
}
});
}
});
