var toastTimeout = null;
var isLoadingNotifications = false;

var onBodyLoad = function() {
    addGoogleAnalyticsScript();
    trackPageview();

    setupTabs();

    getNotifications();
    getTopics();
//    getHots();
    getRecents();
};

var TAB_NAMES = ['notification', 'topic', /*'hot',*/ 'recent'];
var setupTabs = function() {
    for (var i = 0; i < TAB_NAMES.length; ++i) {
        document.getElementById(TAB_NAMES[i] + '_tab').onclick = function() {
            var tabName = this.getAttribute('name');
            trackSimpleEvent('popup.html', tabName);

            for (var j = 0; j < TAB_NAMES.length; ++j) {
                var jname = TAB_NAMES[j];
                var tab = document.getElementById(jname + '_tab');
                var page = document.getElementById(jname + '_page');
                if (tabName == jname) {
                    tab.className = 'selected';
                    show(page);
                } else {
                    tab.className = '';
                    hide(page);
                }
            }
        }
        getElementByClass(document.getElementById(TAB_NAMES[i] + '_page'),
                         'container').innerHTML =
                localStorage[TAB_NAMES[i] + '_innerHTML'] || '';
    }
};

var getNotifications = function() {
    isLoadingNotifications = true;
    GET(V2EX.NOTIFICATIONS, function(xhr) {
        if (xhr.readyState == 4) {
            var page = document.getElementById('notification_page');
            hide(getElementByClass(page, 'message'));
            var DIV_CELL = '<div class="cell';
            if (xhr.status == 200) {
                var container = getElementByClass(page, 'container');

                var html = xhr.responseText;
                if (html.indexOf('<title>V2EX › 登入</title>') > 0) {
                    container.innerHTML = '';
                    show(getElementByClass(page, 'signin'));
                } else {
                    updateUnreadNumber(0);

                    container.innerHTML = '';
                    show(getElementByClass(page, 'see_all'));

                    var begin = html.indexOf('<div id="Main">');
                    begin = html.indexOf('<div class="box">', begin);
                    var last = html.indexOf('<div class="inner', begin);
                    for (begin = html.indexOf(DIV_CELL, begin);
                            begin >= 0 && begin < last;
                            begin = html.indexOf(DIV_CELL, begin + 1)) {
                        var end = html.indexOf('\n', begin);
                        var notification = parseNotificationFromHtml(
                                html.substring(begin, end));
                        container.innerHTML +=
                                generateNotificationHtml(notification);
                    }
                }
                localStorage['notification_innerHTML'] = container.innerHTML;
            }
            isLoadingNotifications = false;
        }
    });
};

var getTopics = function() {
    GET(V2EX.MY_TOPICS, function(xhr) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var page = document.getElementById('topic_page');
            hide(getElementByClass(page, 'message'));
            var container = getElementByClass(page, 'container');

            var html = xhr.responseText;
            if (html.indexOf('<title>V2EX › 登入</title>') > 0) {
                container.innerHTML = '';
                show(getElementByClass(page, 'signin'));
            } else {
                var begin = html.indexOf('<div id="Main">');
                var end = html.indexOf('<div class="c">', begin);
                container.innerHTML = html.substring(begin, end);
                show(getElementByClass(page, 'see_all'));
            }
            localStorage['topic_innerHTML'] = container.innerHTML;
        }
    });
};

var getHots = function() {
    GET(V2EX.HOME_PAGE, function(xhr) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var page = document.getElementById('hot_page');
            hide(getElementByClass(page, 'message'));

            var html = xhr.responseText;
            var begin = html.indexOf('<div class="box" id="TopicsHot">');
            var end = html.indexOf('<div class="sep20">', begin);
            var container = getElementByClass(page, 'container');
            container.innerHTML = html.substring(begin, end)
                    .replace('class="inner ', 'class="cell ')
                    .replace('class="cell"', 'class="header"');

            localStorage['hot_innerHTML'] = container.innerHTML;
        }
    });
};

var getRecents = function() {
    GET(V2EX.HOME_PAGE, function(xhr) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var page = document.getElementById('recent_page');
            hide(getElementByClass(page, 'message'));

            var html = xhr.responseText;
            var begin = html.indexOf('<div class="cell item"');
            var end = html.indexOf('<div class="inner">', begin);
            var container = getElementByClass(page, 'container');
            container.innerHTML = html.substring(begin, end);

            localStorage['recent_innerHTML'] = container.innerHTML;
        }
    });
};

var formatString = function(template, data) {
    var ret = template;
    for (var name in data) {
        ret = ret.replace('\{' + name + '\}', data[name]);
    }
    return ret;
};

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
                '<a class="reply_button" ' +
                    'onclick="javascript: clickReply(this);">回复</a>' +
                '<a class="cancel_button" ' +
                    'onclick="javascript: clickCancel(this);">取消</a>' +
            '</div>' +
        '</div>' +
    '</div>' +
    '<div class="url" style="display: none">{url}</div>' +
'</div>';
var generateNotificationHtml = function(notification) {
    return formatString(NOTIFICATION_TEMPLATE, notification);
};

var parseNotificationFromHtml = function(html) {
    var notification = {};
    var begin, end;

    begin = html.indexOf('<a href=');
    end = html.indexOf('</td>', begin);
    notification.image = html.substring(begin, end);

    begin = notification.image.indexOf('"/member/') + 9;
    end = notification.image.indexOf('">', begin);
    notification.username = notification.image.substring(begin, end);

    begin = html.indexOf('<span class="fade">');
    end = html.indexOf('</span>', begin);
    notification.head = html.substring(begin, end) + '</span>';

    begin = notification.head.indexOf('<a href="/t/') + 9;
    end = notification.head.indexOf('">', begin);
    notification.url = notification.head.substring(begin, end);

    begin = html.indexOf('<span class="snow">');
    end = html.indexOf('</span>', begin) + 7;
    notification.time = html.substring(begin, end).replace(' ago', '');

    begin = html.indexOf('<div class="payload">');
    end = html.lastIndexOf('</td>');
    notification.body = html.substring(begin, end);

    return notification;
};

var moveCursorToEnd = function(textarea) {
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
};

var showReplyArea = function(element) {
    if (isLoadingNotifications) {
        return;
    }
    var notification = element.parentElement.parentElement;
    show(getElementByClass(notification, 'reply_area'));
    hide(getElementByClass(notification, 'reply_icon'));
    moveCursorToEnd(getElementByClass(notification, 'reply_text'));
};

var clickReply = function(element) {
    var notification =
            element.parentElement.parentElement.parentElement.parentElement;
    hide(getElementByClass(notification, 'reply_area'));
    show(getElementByClass(notification, 'reply_icon'));
    var url = getElementByClass(notification, 'url').innerHTML;
    var content = getElementByClass(notification, 'reply_text').value;
    var response = sendReply(url, content);

    var toast = getElementByClass(
            document.getElementById('notification_page'), 'toast');
    var success = getElementByClass(toast, 'success');
    var failed = getElementByClass(toast, 'failed');
    if (toastTimeout != null) {
        window.clearTimeout(toatTimeout);
    }
    if (response) {
        show(success);
        hide(failed);
    } else {
        hide(success);
        show(failed);
    }
    toastTimeout = window.setTimeout(hideToast, 3000);
};

var hideToast = function() {
    var toast = getElementByClass(
            document.getElementById('notification_page'), 'toast');
    hide(getElementByClass(toast, 'success'));
    hide(getElementByClass(toast, 'failed'));
};

var clickCancel = function(element) {
    var notification =
            element.parentElement.parentElement.parentElement.parentElement;
    hide(getElementByClass(notification, 'reply_area'));
    show(getElementByClass(notification, 'reply_icon'));
};

var sendReply = function(postUrl, replyText) {
    return POST(postUrl, 'content=' + encodeURIComponent(replyText), null);
};
