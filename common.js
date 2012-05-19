var getElementByClass = function(container, className) {
    return container.getElementsByClassName(className)[0];
};

var show = function(element) {
    element.style.display = '';
};

var hide = function(element) {
    element.style.display = 'none';
};

var GET = function(url, callback) {
    var xhr = new XMLHttpRequest();
    if (callback) {
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            callback(xhr);
        };
        xhr.send();
    } else {
        xhr.open('GET', url, false);
        xhr.send();
        return (xhr.status == 200);
    }
};

var POST = function(url, content, callback) {
    var xhr = new XMLHttpRequest();
    if (callback) {
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  
        xhr.onreadystatechange = function() {
            callback(xhr);
        };
        xhr.send(content);
    } else {
        xhr.open('POST', url, false);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  
        xhr.send(content);
        return (xhr.status == 200);
    }
};
