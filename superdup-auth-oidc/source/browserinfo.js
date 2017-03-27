"use strict";
var BrowserInfo = (function () {
    function BrowserInfo() {
        this.useragent = navigator.userAgent;
        this.browserName = navigator.appName;
        this.fullVersion = '' + parseFloat(navigator.appVersion);
        this.majorVersion = parseInt(navigator.appVersion, 10);
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var nameOffset, verOffset, ix;
        if (!(window.ActiveXObject) && "ActiveXObject" in window) {
            this.browserName = "IE";
        }
        else if ((verOffset = nAgt.indexOf("Opera")) != -1) {
            this.browserName = "Opera";
            this.fullVersion = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf("Version")) != -1)
                this.fullVersion = nAgt.substring(verOffset + 8);
        }
        else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
            this.browserName = "IE"; //"Microsoft Internet Explorer";
            this.fullVersion = nAgt.substring(verOffset + 5);
        }
        else if ((verOffset = nAgt.indexOf("Edge")) != -1) {
            this.browserName = "Edge"; //"Microsoft Internet Explorer";
            this.fullVersion = nAgt.substring(verOffset + 5);
        }
        else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
            this.browserName = "Chrome";
            this.fullVersion = nAgt.substring(verOffset + 7);
        }
        else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
            this.browserName = "Safari";
            this.fullVersion = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf("Version")) != -1)
                this.fullVersion = nAgt.substring(verOffset + 8);
        }
        else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
            this.browserName = "Firefox";
            this.fullVersion = nAgt.substring(verOffset + 8);
        }
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
            (verOffset = nAgt.lastIndexOf('/'))) {
            this.browserName = nAgt.substring(nameOffset, verOffset);
            this.fullVersion = nAgt.substring(verOffset + 1);
            if (this.browserName.toLowerCase() == this.browserName.toUpperCase()) {
                this.browserName = navigator.appName;
            }
        }
        // trim the fullVersion string at semicolon/space if pthisent
        if ((ix = this.fullVersion.indexOf(";")) != -1)
            this.fullVersion = this.fullVersion.substring(0, ix);
        if ((ix = this.fullVersion.indexOf(" ")) != -1)
            this.fullVersion = this.fullVersion.substring(0, ix);
        this.majorVersion = parseInt('' + this.fullVersion, 10);
        if (isNaN(this.majorVersion)) {
            this.fullVersion = '' + parseFloat(navigator.appVersion);
            this.majorVersion = parseInt(navigator.appVersion, 10);
        }
    }
    BrowserInfo.current = function () {
        if (BrowserInfo._current == null) {
            BrowserInfo._current = new BrowserInfo();
        }
        return BrowserInfo._current;
    };
    return BrowserInfo;
}());
BrowserInfo._current = null;
exports.BrowserInfo = BrowserInfo;
//# sourceMappingURL=browserinfo.js.map