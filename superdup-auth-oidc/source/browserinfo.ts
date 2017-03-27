export class BrowserInfo
{
    public readonly browserName: string;
    public readonly fullVersion: string;
    public readonly majorVersion: number;
    public readonly useragent: string;

    private constructor()
    {
        this.useragent = navigator.userAgent;
        this.browserName = navigator.appName;
        this.fullVersion = '' + parseFloat(navigator.appVersion);
        this.majorVersion = parseInt(navigator.appVersion, 10);

        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var nameOffset, verOffset, ix;

        if (!((window as any).ActiveXObject) && "ActiveXObject" in window) {
            this.browserName = "IE";
        }
        // In Opera, the true version is after "Opera" or after "Version"
        else if ((verOffset = nAgt.indexOf("Opera")) != -1) {
            this.browserName = "Opera";
            this.fullVersion = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf("Version")) != -1)
                this.fullVersion = nAgt.substring(verOffset + 8);
        }
        // In MSIE, the true version is after "MSIE" in userAgent
        else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
            this.browserName = "IE"; //"Microsoft Internet Explorer";
            this.fullVersion = nAgt.substring(verOffset + 5);
        }
        // In Edge, the true version is after "Edge" in userAgent
        else if ((verOffset = nAgt.indexOf("Edge")) != -1) {
            this.browserName = "Edge"; //"Microsoft Internet Explorer";
            this.fullVersion = nAgt.substring(verOffset + 5);
        }
        // In Chrome, the true version is after "Chrome" 
        else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
            this.browserName = "Chrome";
            this.fullVersion = nAgt.substring(verOffset + 7);
        }
        // In Safari, the true version is after "Safari" or after "Version" 
        else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
            this.browserName = "Safari";
            this.fullVersion = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf("Version")) != -1)
                this.fullVersion = nAgt.substring(verOffset + 8);
        }
        // In Firefox, the true version is after "Firefox" 
        else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
            this.browserName = "Firefox";
            this.fullVersion = nAgt.substring(verOffset + 8);
        }
        // In most other browsers, "name/version" is at the end of userAgent 
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
    private static _current: BrowserInfo = null;
    public static current()
    {
        if (BrowserInfo._current == null)
        {
            BrowserInfo._current = new BrowserInfo();
        }

        return BrowserInfo._current;
    }
}
