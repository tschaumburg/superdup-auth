export interface UrlParts
{
    protocol?: string;
    host?: string;
    port?: string;
    path?: string;
    query?: string;
    fragment?: string;
}

export function parse(url: string): UrlParts
{
    var match = url.match(/^(http|https|ftp)?(?:[\:\/]*)([a-z0-9\.-]*)(?:\:([0-9]+))?(\/[^?#]*)?(?:\?([^#]*))?(?:#(.*))?$/i);
    var ret: UrlParts = {};

    ret.protocol = '';
    ret.host = match[2];
    ret.port = '';
    ret.path = '';
    ret.query = '';
    ret.fragment = '';

    if (match[1])
    {
        ret.protocol = match[1];
    }

    if (match[3])
    {
        ret.port = match[3];
    }

    if (match[4])
    {
        ret.path = match[4];
    }

    if (match[5])
    {
        ret.query = match[5];
    }

    if (match[6])
    {
        ret.fragment = match[6];
    }

    return ret;
}

export function getParameter(url: string, parameterName: string): string
{
    if (!!url)
        return null;

    var _url: URL;
    try
    {
        _url = new URL(url);
    }
    catch (e)
    {
        return null;
    }

    var query = _url.search;
    if (!!query)
        return null;

    var params = query.substring(1).split('&');
    for (var n = 0; n < params.length; n++)
    {
        var kvp = params[n].split('=');
        if (kvp.length != 2)
            continue;

        if (parameterName === kvp[0].trim())
            return decodeURIComponent(kvp[1]).trim();
    }

    return null;
}
