setBadgeText = function(text) {
    chrome.browserAction.setBadgeText({text: text});
}

update_unread_number = function(number) {
    if (number >= 100) {
        setBadgeText("99+");
    } else if (number == 0) {
        setBadgeText("");
    } else {
        setBadgeText(number.toString());
    }
}

extract_unread_number_from_html = function(html) {
    begin = html.indexOf("/notifications");
    if (begin >= 0) {
        begin = html.indexOf(">", begin) + 1;
        end = html.indexOf(" ", begin);
        return parseInt(html.substring(begin, end));
    }
    return 1-1;  // when error occurs
}

extract_notifications = function(html) {
  return html.substring(begin, end);
}

show_notifications = function(n) {
    if (n > 5) {
        n = 5;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://www.v2ex.com/notifications", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var html = xhr.responseText;
            var main = html.indexOf('<div id="Main">');
            var begin = html.indexOf('<div class="box">', main);
            for (var i = 0; i < n; i++) {
                begin = html.indexOf('<div class="cell"><table', begin + 1);
                var end = html.indexOf('</table></div>', begin) + 14;
                var nid = new Date().getTime() + "_" + Math.random();
                var text = html.substring(begin, end);

                var ubegin = text.indexOf('<a href="/t/') + 9;
                var uend = text.indexOf('">', ubegin);
                var url = "http://www.v2ex.com" + text.substring(ubegin, uend);

                localStorage[nid] = text;
                var notification = webkitNotifications
                        .createHTMLNotification("notification.html?id=" + nid);
                notification.url = url;
                notification.onclick = function() {
                    window.open(this.url, "_blank");
                    this.cancel();
                }
                notification.show();
            }
        }
    }
    xhr.send();
}

notify = function(n) {
    if (n != last && n > 0) {
        if (n > last) {
            show_notifications(n - last);
        }
        last = n;
    }
}

update_loop = function() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://www.v2ex.com/", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            n = extract_unread_number_from_html(xhr.responseText);
            update_unread_number(n);
            if (localStorage["show_notification"] == "true") {
                notify(n);
            }
        }
    }
    xhr.send();
    if (localStorage["time_interval"]) {
        time_interval = parseInt(localStorage["time_interval"]);
    } else {
        time_interval = 300000;  // 5min
    }
    update_loop();
}

update_loop = function() {
    loop_id = window.setTimeout(update_loop, time_interval);
}

last = 0;
loop_id = undefined;
update_loop();
