extract_notifications = function(html) {
    main = html.indexOf('<div id="Main">');
    begin = html.indexOf('<div class="box">', main);
    end = html.indexOf('<div class="c">', begin);
    return html.substring(begin, end);
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
