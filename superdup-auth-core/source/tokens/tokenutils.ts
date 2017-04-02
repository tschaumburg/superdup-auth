import urlutils = require("../urlutils");
import jwtdecode = require("jwt-decode");

export interface RedirectParts
{
    hash?: {
        state?: string;
        nonce?: string;
    }
}

export function parseRedirectUrl(redirectUrl: string): RedirectParts
{
    if (!redirectUrl)
        return null;

    var result: RedirectParts = {};

    var urlParts = urlutils.parse(redirectUrl);
    if (!!urlParts.fragment)
    {
        result.hash = {};

        var hashParams = urlParts.fragment.split('&');
        for (var n = 0; n < hashParams.length; n++)
        {
            var hashParam = hashParams[n];
            if (!hashParam)
                continue;

            var kvp = hashParam.split('=');
            if (kvp.length != 2)
                continue;

            if ("state" === kvp[0].trim())
                result.hash.state = kvp[1]; // JwtUtils.decodeHashValue(kvp[1]);
        }
    }

    return result;
}

    export function getExpiration(jwtToken: string): number
    {
        if (!jwtToken)
            return 0;

        var decoded = jwtdecode(jwtToken);
        return decoded.exp;
        //return jwt.decode(jwtToken).exp;
        //return 0;
    }

    export function isExpired(expiration: number): boolean
    {
        return (expiration < Date.now() / 1000);
    }


    export function decodeHash<T>(redirectUrl: string): T
    {
        var parsedRedirect = parseRedirectUrl(redirectUrl);

        if (!parsedRedirect)
            return null; // error("Not a redirect url", undefined);

        if (!parsedRedirect.hash)
            return null; // error("Not a redirect url (#-fragment missing)", undefined);

        if (!parsedRedirect.hash.state)
            return null; // error("Not a redirect url ('state' missing from #-fragment)", undefined);

        var decodedState = JSON.parse(decodeURIComponent(parsedRedirect.hash.state));

        if (!decodedState)
            return null; // error("Malformed state in redirect url - expected JSON-encoded string, got " + JSON.stringify(state), state.uss);

        return decodedState as T;
    }

    export function decodeNonce(redirectUrl: string): string
    {
        var parsedRedirect = parseRedirectUrl(redirectUrl);

        if (!parsedRedirect)
            return null; // error("Not a redirect url", undefined);

        if (!parsedRedirect.hash)
            return null; // error("Not a redirect url (#-fragment missing)", undefined);

        if (!parsedRedirect.hash.nonce)
            return null; // error("Not a redirect url ('nonce' missing from #-fragment)", undefined);

        return parsedRedirect.hash.nonce;
    }
