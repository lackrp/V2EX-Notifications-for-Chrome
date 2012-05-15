var onBodyLoad = function() {
    setupTabs();
    getNotifications();
    getTopics();
    getHots();
};

var TAB_NAMES = [ 'notification', 'topic', 'hot' ];
var setupTabs = function() {
    for (var i = 0; i < TAB_NAMES.length; ++i) {
        document.getElementById(TAB_NAMES[i] + '_tab').onclick = function() {
            var tabName = this.getAttribute('name');
            for (var j = 0; j < TAB_NAMES.length; ++j) {
                var jname = TAB_NAMES[j]; 
                var tab = document.getElementById(jname + '_tab');
                var page = document.getElementById(jname + '_page');
                if (tabName == jname) {
                    tab.className = 'selected';
                    page.style.display = '';
                } else {
                    tab.className = '';
                    page.style.display = 'none';
                }
            }
        }
    }
};

var getNotifications = function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', V2EX.NOTIFICATIONS, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById('notification_message').style.display = 'none';

            var html = xhr.responseText;
            if (html.indexOf('<title>V2EX › 登入</title>') > 0) {
                document.getElementById('notification_signin').style.display = '';
            } else {
                updateUnreadNumber(0);

                var container = document.getElementById('notifications');
                container.innerHTML = '';
                document.getElementById('notification_see_all').style.display = '';

                var begin = html.indexOf('<div id="Main">');
                begin = html.indexOf('<div class="box">', begin);
                for (begin = html.indexOf('<div class="cell', begin);
                        begin >=0;
                        begin = html.indexOf('<div class="cell', begin + 1)) {
                    var end = html.indexOf('\n', begin);
                    var notification = parseNotificationFromHtml(
                            html.substring(begin, end)); 
                    container.innerHTML +=
                            generateNotificationHtml(notification);
                }
            }
        }
    };
    xhr.send();
};

var getTopics = function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', V2EX.MY_TOPICS, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById('topic_message').style.display = 'none';

            var html = xhr.responseText;
            if (html.indexOf('<title>V2EX › 登入</title>') > 0) {
                document.getElementById('topic_signin').style.display = '';
            } else {
                var begin = html.indexOf('<div id="Main">');
                var end = html.indexOf('<div class="c">', begin);
                document.getElementById('topics').innerHTML = html.substring(begin, end);
                document.getElementById('topic_see_all').style.display = '';

            }
        }
    };
    xhr.send();
};

var getHots = function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', V2EX.HOME_PAGE, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById('hot_message').style.display = 'none';

            var html = xhr.responseText;
            var begin = html.indexOf('<div class="box" id="TopicsHot">');
            var end = html.indexOf('<div class="sep20">', begin);
            document.getElementById('hots').innerHTML =
                html.substring(begin, end)
                    .replace('class="inner ', 'class="cell ')
                    .replace('class="cell"', 'class="header"');
        }
    };
    xhr.send();
};
