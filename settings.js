var setOption = function(key, value) {
    localStorage["option_" + key] = value;
}

var getOption = function(key, def) {
    return localStorage["option_" + key] || def;
}

var setBooleanOption = function(key, value) {
    setOption(key, value ? "true" : "false");
}

var getBooleanOption = function(key, def) {
    var value = getOption(key, undefined);
    if (value == undefined) {
        return def;
    } else {
        return value == "true"; 
    }
}

var setIntOption = function(key, value) {
    setOption(key, value.toString());
}

var getIntOption = function(key, def) {
    var value = getOption(key, undefined);
    if (value == undefined) {
        return def;
    } else {
        return parseInt(value); 
    }
}

var OPTION_KEYS = {
    SHOW_NOTIFICATION: "show_notification",
    UPDATE_FREQUENCY: "update_frequency"
}

var saveShowNotification = function(value) {
    setBooleanOption(OPTION_KEYS.SHOW_NOTIFICATION, value);
}

var getShowNotification = function() {
    return getBooleanOption(OPTION_KEYS.SHOW_NOTIFICATION, false);
}

var saveUpdateFrequency = function(value) {
    setIntOption(OPTION_KEYS.UPDATE_FREQUENCY, value);
}

var getUpdateFrequency = function() {
    return getIntOption(OPTION_KEYS.UPDATE_FREQUENCY, 300000);  // 5 min
}
