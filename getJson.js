var topFn = {
    getId: function(id) {
        return document.getElementById(id);
    },
    getElem: function(selectors) {
        return document.querySelector(selectors);
    },
    show: function(obj) {
        obj.style.display = "block";
    },
    hide: function(obj) {
        obj.style.display = "none";
    },
    getJson: function(url, fn, callbackName) {
        if (url.indexOf("?") != -1) {
            var url = url + '&callback=' + callbackName;
        } else {
            var url = url + '?callback=' + callbackName;
        }
        window[callbackName] = fn;
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.src = url;
        script.onload = script.onreadystatechange = function() {
            var f = script.readyState;
            if (f && f != "loaded" && f != "complete") return;
            script.onload = script.onreadystatechange = null;
            head.removeChild(script);
            delete window[callbackName];
        };
        head.appendChild(script);
    }
}
