var onBodyLoad = function() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://www.v2ex.com/notifications", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("message").style.display = 'none';

            var html = xhr.responseText;
            if (html.indexOf('<title>V2EX › 登入</title>') > 0) {
                window.open(V2EX.SIGN_IN);
            } else {
                var container = document.getElementById("notifications");
                container.innerHTML = '';
                document.getElementById("see_all").style.display = '';

                var begin = html.indexOf('<div id="Main">');
                begin = html.indexOf('<div class="box">', begin);
                for (begin = html.indexOf('<div class="cell">', begin);
                        begin >=0;
                        begin = html.indexOf('<div class="cell">', begin + 1)) {
                    var end = html.indexOf('\n', begin);
                    var notification = parseNotificationFromHtml(
                            html.substring(begin, end)); 
                    container.innerHTML +=
                            generateNotificationHtml(notification, 1);
                }
            }
        }
    }
    xhr.send();
}
