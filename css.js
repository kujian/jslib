function css(obj, attr, value) {
            switch (arguments.length) {
                case 2:
                    if (typeof arguments[1] == "object") {    //批量设置属性
                        for (var i in attr) obj.style[i] = attr[i]
                    }
                    else {    // 读取属性值
                        return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, null)[attr]
                    }
                    break;
                case 3:
                    //设置属性
                    obj.style[attr] = value;
                    break;
                default:
                    return "";
            }
        }
