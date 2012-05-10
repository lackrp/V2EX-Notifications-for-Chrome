extract_notifications = function(html) {
    if (html.indexOf('<title>V2EX › 登入</title>') > 0) {
        return '<div class="message"><a href="http://www.v2ex.com/signin">请点此登录</a></div>';
    } else {
        main = html.indexOf('<div id="Main">');
        begin = html.indexOf('<div class="box">', main);
        end = html.indexOf('<div class="c">', begin);
        return html.substring(begin, end);
    }
}

var xhr = new XMLHttpRequest();
xhr.open("GET", "http://www.v2ex.com/notifications", true);
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        document.getElementById("notifications").innerHTML =
                extract_notifications(xhr.responseText);
    }
}
xhr.send();
