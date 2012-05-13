var extractUnreadNumberFromHtml = function(html) {
    var begin = html.indexOf("/notifications");
    if (begin >= 0) {
        begin = html.indexOf(">", begin) + 1;
        var end = html.indexOf(" ", begin);
        return parseInt(html.substring(begin, end));
    }
    return -1;
}

var showNotification = function(notification) {
    var nid = new Date().getTime() + "_" + Math.random();
    localStorage[nid] = JSON.stringify(notification);
    webkitNotifications
            .createHTMLNotification("notification.html?id=" + nid)
            .show();
}

var extractFirstNotification = function() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", V2EX.NOTIFICATIONS, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var html = xhr.responseText;
            var begin = html.indexOf('<div id="Main">');
            begin = html.indexOf('<div class="box">', begin);
            begin = html.indexOf('<div class="cell">', begin);
            var end = html.indexOf('\n', begin);
            var notification =
                    parseNotificationFromHtml(html.substring(begin, end));
            showNotification(notification);
        }
    }
    xhr.send();
}

var loop = function() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", V2EX.HOME_PAGE, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var n = extractUnreadNumberFromHtml(xhr.responseText);
            updateUnreadNumber(n);
            if (getShowNotification() && n != last && n > 0) {
                if (n > last) {
                    extractFirstNotification(n);
                }
                last = n;
            }
        }
    }
    xhr.send();
    updateLoop();
}

var updateLoop = function() {
    window.setTimeout(loop, getUpdateFrequency());
}

var last = 0;
loop();
