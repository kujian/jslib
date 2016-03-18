Query中有addClass,removeClass,toggleClass
addClass(class)：为每个匹配的元素添加指定的类名
removeClass(class)：从所有匹配的元素中删除全部或者指定的类
toggleClass(class)：如果存在（不存在）就删除（添加）一个类
---------------------------------------------------------------------------------------
        function hasClass(obj, cls) {
            return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        }

        function addClass(obj, cls) {
            if (!this.hasClass(obj, cls)) obj.className += " " + cls;
        }

        function removeClass(obj, cls) {
            if (hasClass(obj, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                obj.className = obj.className.replace(reg, ' ');
            }
        }
        function toggleClass(obj,cls){
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.indexOf(cls) > -1 ? obj.className.replace(reg,'') : obj.className + ' '+cls;
    }
