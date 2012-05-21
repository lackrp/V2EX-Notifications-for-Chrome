var extractUnreadNumberFromHtml = function(html) {
    var begin = html.indexOf('/notifications');
    if (begin >= 0) {
        begin = html.indexOf('>', begin) + 1;
        var end = html.indexOf(' ', begin);
        return parseInt(html.substring(begin, end));
    }
    return -1;
};

var loop = function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', V2EX.HOME_PAGE, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var n = extractUnreadNumberFromHtml(xhr.responseText);
            updateUnreadNumber(n);
        }
    }
    xhr.send();
    updateLoop();
};

var updateLoop = function() {
    window.setTimeout(loop, getUpdateFrequency());
};

loop();
