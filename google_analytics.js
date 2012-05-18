var GA_ACCOUNT = 'UA-31490410-1';

var _gaq = _gaq || [];

var addGoogleAnalyticsScript = function() {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);

    _gaq.push(['_setAccount', GA_ACCOUNT]);
};

var trackPageview = function() {
    _gaq.push(['_trackPageview']);
};

var trackSimpleEvent = function(category, action) {
    _gaq.push(['_trackEvent', category, action]);
};

var trackLabeledEvent = function(category, action, label) {
    _gaq.push(['_trackEvent', category, action, label]);
};

var trackValuedEvent = function(category, action, label, value) {
    _gaq.push(['_trackEvent', category, action, label, value]);
};
