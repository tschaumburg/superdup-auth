var urlutils = require("../urlutils");

export class UrlDictionary<TValue>
{
    private byHost: { [id: string]: ByUrlPrefix<TValue>; } = {};

    public add(urlPrefix: string, value: TValue): void
    {
        if (!urlPrefix)
            return;

        var parsedUrl = urlutils.parse(urlPrefix);
        if (!parsedUrl)
            return;

        var host = parsedUrl.host;
        if (!host)
            host = "";

        var hostSpecificDictionary = this.byHost[host];
        if (!hostSpecificDictionary)
        {
            hostSpecificDictionary = new ByUrlPrefix<TValue>();
            this.byHost[host] = hostSpecificDictionary;
        }

        hostSpecificDictionary.add(urlPrefix, value);
    }

    public find(urlPrefix: string): TValue
    {
        if (!urlPrefix)
            return null;

        var parsedUrl = urlutils.parse(urlPrefix);
        if (!parsedUrl)
            return null;

        var host = parsedUrl.host;
        if (!host)
            host = "";

        var hostSpecificDictionary = this.byHost[host];
        if (!hostSpecificDictionary)
            return null;

        return hostSpecificDictionary.findByLongestPrefix(urlPrefix);
    }

    public getHosts(): string[]
    {
        var res: string[] = [];
        for (var host in this.byHost)
        {
            if (res.indexOf(host) < 0)
                res.push(host);
        }

        return res;
    }
}

class ByUrlPrefix<TValue>
{
    private _valuesByDescendingUrl:
    {
        urlPrefix: string,
        value: TValue
    }[] = [];

    private findSpecific(urlPrefix: string): { urlPrefix: string, value: TValue }
    {
        if (!urlPrefix)
            return null;

        for (var n = 0; n < this._valuesByDescendingUrl.length; n++)
        {
            var entry = this._valuesByDescendingUrl[n];
            var key = entry.urlPrefix;

            if (key.length < urlPrefix.length)
                return null;

            if (key === urlPrefix)
                return entry;
        }

        return null;
    }

    private sort(): void
    {
        this._valuesByDescendingUrl =
            this._valuesByDescendingUrl.sort((a, b) => a.urlPrefix.length - b.urlPrefix.length);
    }

    public add(urlPrefix: string, value: TValue): void
    {
        if (!urlPrefix)
            return;

        var entry = this.findSpecific(urlPrefix);
        if (!entry)
        {
            entry = { urlPrefix: urlPrefix, value: value };
            this._valuesByDescendingUrl.push(entry);
            this.sort();
        }

        entry.value = value;
    }

    public findByLongestPrefix(url: string): TValue
    {
        if (!url)
            return null;

        for (var n = 0; n < this._valuesByDescendingUrl.length; n++)
        {
            var entry = this._valuesByDescendingUrl[n];
            var prefix = entry.urlPrefix;

            if (url.indexOf(prefix) == 0)
            {
                return entry.value;
            }
        }

        return null;
    }
}

