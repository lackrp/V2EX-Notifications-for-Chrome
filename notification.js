var autoClose = function() {
    timeoutId = window.setTimeout(window.close, 7000);
}

var onBodyLoad = function() {
    var nid = window.location.search.substring(4);
    if (localStorage[nid]) {
        var item = JSON.parse(localStorage[nid]);
        var main = document.getElementById("main");
        main.innerHTML = generateNotificationHtml(item);
        main.onclick = function() {
            window.open(item.url);
            window.close();
        }
        localStorage.removeItem(nid);
    } else {
        window.close();
    }

    document.body.onmouseout = autoClose;
    document.body.onmouseover = function() {
        if (timeoutId != null) {
            window.clearTimeout(timeoutId);
        }
    }

    autoClose();
}

var timeoutId = null;
