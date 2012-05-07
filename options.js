save_show_notification = function() {
    var show_notification_value = document.getElementById("show_notification").checked;
    localStorage["show_notification"] = show_notification_value ? 1 : 0;
}

setup_show_notification = function() {
    var show_notification_value = localStorage["show_notification"];
    if (!show_notification_value) {
        show_notification_value = 0;
    }
    var show_notification = document.getElementById("show_notification");
    show_notification.checked = show_notification_value == 0 ? false : true;
    show_notification.onclick = save_show_notification;
}

save_time_interval = function() {
    var time_interval_value = document.getElementById("time_interval").value;
    localStorage["time_interval"] = time_interval_value;
}

setup_time_interval = function() {
    var time_interval_value = localStorage["time_interval"];
    if (!time_interval_value) {
        time_interval_value = "300000";  // 5min
    }
    var time_interval = document.getElementById("time_interval");
    for (var i = 0; i < time_interval.options.length; i++) {
        if (time_interval.options[i].value == time_interval_value) {
            time_interval.options[i].selected = true;
            break;
        }  
    }
    time_interval.onchange = save_time_interval;
}

setup = function() {
    setup_show_notification();
    setup_time_interval();
}
