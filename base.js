var V2EX = {
    HOME_PAGE: "http://www.v2ex.com/",
    NOTIFICATIONS: "http://www.v2ex.com/notifications",
    SIGN_IN: "http://www.v2ex.com/signin" 
}

var formatString = function(template, data) {
    var ret = template;
    for (var name in data) {
        ret = ret.replace("\{" + name + "\}", data[name]);
    }
    return ret;
}

var NOTIFICATION_TEMPLATE =
'<div class="notification">' +
    '<div class="image">{image}</div>' +
    '<div class="wrapper">' +
        '<span class="head">{head}</span>' +
        '<span class="time">{time}</span>' +
        '<span class="body">{body}</span>' +
    '</div>' +
'</div>';
var generateNotificationHtml = function(notification) {
    return formatString(NOTIFICATION_TEMPLATE, notification);
}

var parseNotificationFromHtml = function(html) {
    var notification = {};
    {
        var begin = html.indexOf('<a href=');
        var end = html.indexOf('</td>', begin);
        notification.image = html.substring(begin, end);
    }
    {
        var begin = html.indexOf('<span class="fade">');
        var end = html.indexOf('</span>', begin);
        notification.head = html.substring(begin, end);
    }
    {
        var begin = notification.head.indexOf('<a href="/t/') + 9;
        var end = notification.head.indexOf('">', begin);
        notification.url = notification.head.substring(begin, end);
    }
    {
        var begin = html.indexOf('<span class="snow">');
        var end = html.indexOf('</span>', begin) + 7;
        notification.time = html.substring(begin, end).replace(' ago', '');
    }
    {
        var begin = html.indexOf('<div class="payload">');
        var end = html.lastIndexOf('</td>');
        notification.body = html.substring(begin, end);
    }
    return notification;
}

var setBadgeText = function(text) {
    chrome.browserAction.setBadgeText({ text: text });
}

var setBadgeColor = function(color) {
    chrome.browserAction.setBadgeBackgroundColor({ color: color });
}
var COLOR = {
    RED: [0xDD, 0x4B, 0x39, 0xFF],
    GREEN: [0x3D, 0x94, 0x00, 0xFF],
    BLUE: [0x4D, 0x90, 0xFE, 0xFF]
}

var updateUnreadNumber = function(number) {
    if (number >= 100) {
        setBadgeText("99+");
        setBadgeColor(COLOR.BLUE);
    } else if (number == 0) {
        setBadgeText("");
    } else if (number < 0) {
        setBadgeText("!");
        setBadgeColor(COLOR.RED);
    } else {
        setBadgeText(number.toString());
        setBadgeColor(COLOR.GREEN);
    }
}
