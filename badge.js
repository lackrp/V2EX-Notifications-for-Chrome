var V2EX = {
    HOME_PAGE: 'http://www.v2ex.com/',
    NOTIFICATIONS: 'http://www.v2ex.com/notifications',
    MY_TOPICS: 'http://www.v2ex.com/my/topics',
    SIGN_IN: 'http://www.v2ex.com/signin'
};

var COLOR = {
    RED: [0xDD, 0x4B, 0x39, 0xFF],
    GREEN: [0x3D, 0x94, 0x00, 0xFF],
    BLUE: [0x4D, 0x90, 0xFE, 0xFF]
};

var setBadgeText = function(text) {
    chrome.browserAction.setBadgeText({ text: text });
};

var setBadgeColor = function(color) {
    chrome.browserAction.setBadgeBackgroundColor({ color: color });
};

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
};
