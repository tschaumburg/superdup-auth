//var urlutils = require("../urlutils");

export interface IUrlMapper<TValue>
{
    add(urlPrefix: string, value: TValue): void;
    map(url: string): TValue;
    entries(): { urlPrefix: string, value: TValue }[]
}

export class UrlMapper<TValue>
{
    private _valuesByDescendingUrl:
    {
        urlPrefix: string,
        value: TValue
    }[] = [];

    private findEntry(url: string): { urlPrefix: string, value: TValue }
    {
        if (!url)
            return null;

        for (var n = 0; n < this._valuesByDescendingUrl.length; n++)
        {
            var entry = this._valuesByDescendingUrl[n];
            var key = entry.urlPrefix;

            if (key.length < url.length)
                return null;

            if (key === url)
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

        var entry = this.findEntry(urlPrefix);
        if (!entry)
        {
            entry = { urlPrefix: urlPrefix, value: value };
            this._valuesByDescendingUrl.push(entry);
            this.sort();
        }

        entry.value = value;
    }

    public map(url: string): TValue
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

    public entries(): { urlPrefix: string, value: TValue }[]
    {
        var res: { urlPrefix: string, value: TValue }[] = [];

        for (var n = 0; n < this._valuesByDescendingUrl.length; n++)
        {
            var entry = this._valuesByDescendingUrl[n];
            res.push({ urlPrefix: entry.urlPrefix, value: entry.value });
        }

        return res;
    }
}

