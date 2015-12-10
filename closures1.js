window.onload= function(){
    var tits = $('#tabTit1 li');
    var cons = $('#tabCon1 .con');
    var len = cons.length;
    var liChange = function(){
        for(var n=0;n<len;n++){
        	tits[n].className = tits[n].className.replace(/\s*cur/g,'');
            cons[n].className = cons[n].className.replace(/\s*cur/g,'');
        }
    }
    for(var i = 0; i<tits.length; i++){
    	tits[i].i = i;
    	tits[i].onmouseover = function(){
    		liChange();
    		cons[this.i].addClass('cur');
    		tits[this.i].addClass('cur');
    	}
    }
};
