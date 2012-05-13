var setSelectorValue = function(id, value) {
    var selector = document.getElementById(id);
    for (var i = 0; i < selector.options.length; i++) {
        var option = selector.options[i];
        if (option.value == value) {
            option.selected = true;
            break;
        }
    }
}

var setupShowNotification = function() {
    var element = document.getElementById("show_notification");
    element.checked = getShowNotification(); 
    element.onclick = function() {
        saveShowNotification(this.checked);
    };
}

var setupUpdateFrequency = function() {
    setSelectorValue("update_frequency", getUpdateFrequency().toString());
    document.getElementById("update_frequency").onchange = function() {
        saveUpdateFrequency(parseInt(this.value));
        chrome.extension.getBackgroundPage().updateLoop();
    };
}

var setup = function() {
    setupShowNotification();
    setupUpdateFrequency();
}

setup();
