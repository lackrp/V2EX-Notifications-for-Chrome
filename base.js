var V2EX = {
    HOME_PAGE: 'http://www.v2ex.com/',
    NOTIFICATIONS: 'http://www.v2ex.com/notifications',
    MY_TOPICS: 'http://www.v2ex.com/my/topics',
    SIGN_IN: 'http://www.v2ex.com/signin' 
}

var formatString = function(template, data) {
    var ret = template;
    for (var name in data) {
        ret = ret.replace('\{' + name + '\}', data[name]);
    }
    return ret;
}

var NOTIFICATION_TEMPLATE =
'<div class="notification">' +
    '<div class="image">{image}</div>' +
    '<div class="wrapper">' +
        '<div class="reply" onclick="javascript: showReplyArea(this);">' +
                '<img class="reply_icon" src="static/img/reply.png" alt="" />' +
        '</div>' +
        '<span class="head">{head}</span>' +
        '<span class="time">{time}</span>' +
        '<span class="body">{body}</span>' +
        '<div class="reply_area" style="display: none">' +
            '<textarea class="reply_text">@{username} </textarea>' +
            '<div class="buttons">' +
                '<span class="sent_success" style="display: none">发送成功</span>' +
                '<span class="sent_failed" style="display: none">发送失败</span>' +
                '<a class="reply_button" onclick="javascript: clickReply(this);">回复</a>' +
                '<a class="cancel_button" onclick="javascript: clickCancel(this);">取消</a>' +
            '</div>' +
        '</div>' +
    '</div>' +
    '<div class="url" style="display: none">{url}</div>' +
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
        var begin = notification.image.indexOf('"/member/') + 9;
        var end = notification.image.indexOf('">', begin);
        notification.username = notification.image.substring(begin, end);
    }
    {
        var begin = html.indexOf('<span class="fade">');
        var end = html.indexOf('</span>', begin);
        notification.head = html.substring(begin, end) + '</span>';
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
    if (number >= 10) {
        setBadgeColor(COLOR.BLUE);
        setBadgeText('9+');
    } else if (number == 0) {
        setBadgeText('');
    } else if (number < 0) {
        setBadgeColor(COLOR.RED);
        setBadgeText('!');
    } else {
        setBadgeColor(COLOR.GREEN);
        setBadgeText(number.toString());
    }
}

var moveCursorToEnd = function(textarea) {    
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
}

var showReplyArea = function(element) {
    var notification = element.parentElement.parentElement;
    notification.getElementsByClassName('reply_icon')[0].style.display = 'none';
    notification.getElementsByClassName('reply_area')[0].style.display = '';
    moveCursorToEnd(notification.getElementsByClassName('reply_text')[0]);
}

var clickReply = function(element) {
    var notification = element.parentElement.parentElement.parentElement.parentElement;
    var url = notification.getElementsByClassName('url')[0].innerHTML;
    var content = notification.getElementsByClassName('reply_text')[0].value;
    if (reply(url, content)) {
        notification.getElementsByClassName('sent_success')[0].style.display = '';
        notification.getElementsByClassName('sent_failed')[0].style.display = 'none';
    } else {
        notification.getElementsByClassName('sent_success')[0].style.display = 'none';
        notification.getElementsByClassName('sent_failed')[0].style.display = '';
    }
}

var clickCancel = function(element) {
    var notification = element.parentElement.parentElement.parentElement.parentElement;
    notification.getElementsByClassName('reply_area')[0].style.display = 'none';
    notification.getElementsByClassName('reply_icon')[0].style.display = '';
    notification.getElementsByClassName('sent_success')[0].style.display = 'none';
    notification.getElementsByClassName('sent_failed')[0].style.display = 'none';
}

var reply = function(postUrl, replyText) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl, false);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  
    xhr.send('content=' + encodeURIComponent(replyText));
    return (xhr.status == 200);
};
