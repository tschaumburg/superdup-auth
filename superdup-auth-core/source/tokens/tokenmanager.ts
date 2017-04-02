import jwtdecode = require("jwt-decode");
import { isExpired, getExpiration} from './tokenutils';
import { UrlDictionary } from './urldictionary';
import { AccessTokenInfo } from "./tokeninfo";
import { ITokenStore, LocalStorageTokenStore } from "./tokenstore";
import { ILogger } from "../logger";

export interface ITokenManager
{
    setLog(log: ILogger): void;

    registerTokenInfo2(
        tokenName: string,
        loginName: string,
        resource: string,
        scopes: string[],
        protectUrls: string[]
    ): void;

    lookupTokenInfo2(
        tokenName: string
    ): AccessTokenInfo;

    setTokenValue2(
        accessTokenName: string,
        accessTokenValue: string
    ): void;

    clearTokenValues2(
        loginName: string
    ): void;

    //getAccessTokens(): { [id: string]: {}; };
    getAccessTokens(): { tokenName: string, tokenValue: string }[];

    getAccessTokenFor(
        url: string,
        success: (token: string) => void,
        error: (reason: any) => void
    ): void;

    //getProtectedDomains(): string[];
}

export function createTokenManager(acquireAccessToken: acquireTokenFn, log: ILogger, tokenStore: ITokenStore = null): ITokenManager
{
    if (!tokenStore)
        tokenStore = new LocalStorageTokenStore();

    return new AccessTokenManager(tokenStore, acquireAccessToken, log);
}

export type acquireTokenFn =
(
    loginName: string,
    resource: string,
    scopes: string[],
    success: (token: string) => void,
    error: (reason: any) => void
) => void;

class AccessTokenMap
{
    private readonly _tokensByName: { [id: string]: AccessTokenInfo; } = {};
    private readonly _tokensByUrl: UrlDictionary<AccessTokenInfo> = new UrlDictionary<AccessTokenInfo>(); // { [id: string]: AccessTokenInfo; } = {};
    private _allTokenInfos: AccessTokenInfo[] = null;

    Add(value: AccessTokenInfo): void {
        var key = value.tokenName;
        this._allTokenInfos = null;

        // First, we'll check to see if there's an existing
        // registration:
        var existingValue = this._tokensByName[key];
        if (this.sameToken(existingValue, value)) {
            // ...if so, we'll merge the new value into the old:
            if (!!value.expiresAt) {
                if ((!existingValue.expiresAt) || (existingValue.expiresAt < value.expiresAt)) {
                    // copy in the new values - the old is empty
                    existingValue.tokenValue = value.tokenValue;
                    existingValue.expiresAt = value.expiresAt;
                }
            }
        }
        else {
            // OK, no existing value:
            this._tokensByName[key] = value;
            for (var n in value.protectUrls) {
                var url = value.protectUrls[n];
                this._tokensByUrl.add(url, value);
            }
        }
    }

    public All(): AccessTokenInfo[]
    {
        if (!this._allTokenInfos) {
            this._allTokenInfos = [];
            for (var name in this._tokensByName) {
                var tokenInfo = this._tokensByName[name];
                this._allTokenInfos.push(tokenInfo);
            }
        }

        return this._allTokenInfos;
    }


    public lookupTokenInfo2(tokenName: string): AccessTokenInfo
    {
            var key = tokenName;
            return this._tokensByName[key];
    }

    public ByUrl(
            url: string
        ): AccessTokenInfo {
        return this._tokensByUrl.find(url);
    }

    public ByLoginName(
        loginName: string
    ): AccessTokenInfo[] {
        var res: AccessTokenInfo[] = [];
        for (var name in this._tokensByName) {
            var token = this._tokensByName[name];
            if (token.loginName === loginName)
                res.push(token);
        }

        return res;
    }

    private sameToken(token1: AccessTokenInfo, token2: AccessTokenInfo): boolean {
        if (token1 == token2)
            return true;

        if (token1 == null)
            return false;

        if (token2 == null)
            return false;

        if (!(token1.tokenName === token2.tokenName))
            return false;

        if (!(token1.resource === token2.resource))
            return false;

        if (!this.sameScopes(token1.scopes, token2.scopes))
            return false;

        return true;
    }

    private sameScopes(scopes1: string[], scopes2: string[]): boolean {
        if (scopes1 == scopes2)
            return true;

        if (scopes1 == null)
            return false;

        if (scopes2 == null)
            return false;

        if (scopes1.length != scopes2.length)
            return false;

        for (var n = 0; n < scopes1.length; n++) {
            if (!(scopes1[n] === scopes2[n]))
                return false;
        }

        return true;
    }}

class AccessTokenManager implements ITokenManager
{
    public constructor(private readonly tokenStore: ITokenStore, private readonly acquireAccessToken: acquireTokenFn, log: ILogger)
    {
        this.log = log || console;
        this.loadState();
    }

    //
    // =============
    private log: ILogger = console;
    public setLog(_log: ILogger): void
    {
        if (!_log)
            _log = console;

        this.log = _log;
    }

    // 
    // =============
    private readonly _tokens: AccessTokenMap = new AccessTokenMap();
    public lookupTokenInfo2(tokenName: string): AccessTokenInfo
    {
        return this._tokens.lookupTokenInfo2(tokenName);
    }

    //private readonly _tokensByName: { [id: string]: AccessTokenInfo; } = {};
    //private readonly _tokensByUrl: UrlDictionary<AccessTokenInfo> = new UrlDictionary<AccessTokenInfo>(); // { [id: string]: AccessTokenInfo; } = {};
    //private _allTokenInfos: AccessTokenInfo[] = null;

    //private AddTokenInfo(value: AccessTokenInfo): void
    //{
    //    var key = value.tokenName;
    //    this._allTokenInfos = null;

    //    // First, we'll check to see if there's an existing
    //    // registration:
    //    var existingValue = this._tokensByName[key];
    //    if (this.sameToken(existingValue, value))
    //    {
    //        // ...if so, we'll merge the new value into the old:
    //        if (!!value.expiresAt)
    //        {
    //            if ((!existingValue.expiresAt) || (existingValue.expiresAt < value.expiresAt))
    //            {
    //                // copy in the new values - the old is empty
    //                existingValue.tokenValue = value.tokenValue;
    //                existingValue.expiresAt = value.expiresAt;
    //            }
    //        }
    //    }
    //    else
    //    {
    //        // OK, no existing value:
    //        this._tokensByName[key] = value;
    //        for (var n in value.protectUrls)
    //        {
    //            var url = value.protectUrls[n];
    //            this._tokensByUrl.add(url, value);
    //        }
    //    }
    //}

    //private AllTokenInfos(): AccessTokenInfo[]
    //{
    //    if (!this._allTokenInfos)
    //    {
    //        this._allTokenInfos = [];
    //        for (var name in this._tokensByName)
    //        {
    //            var tokenInfo = this._tokensByName[name];
    //            this._allTokenInfos.push(tokenInfo);
    //        }
    //    }

    //    return this._allTokenInfos;
    //}

    //public lookupTokenInfo2(
    //    tokenName: string
    //): AccessTokenInfo 
    //{
    //    var key = tokenName;
    //    return this._tokensByName[key];
    //}

    //public lookupTokenInfos2(
    //    loginName: string
    //): AccessTokenInfo[] 
    //{
    //    var res: AccessTokenInfo[] = [];
    //    for (var name in this._tokensByName) {
    //        var token = this._tokensByName[name];
    //        if (token.loginName === loginName)
    //            res.push(token);
    //    }

    //    return res;
    //}

    //
    // =============
    private loadState()
    {
        this.log.info("Reloading persisted authentication state...");

        var tokens = this.tokenStore.loadAll();
        if (!tokens)
        {
            this.log.info("...no tokens found");
            return;
        }

        this.log.info("...reloaded " + tokens.length + " access tokens from token storage");

        for (var n = 0; n < tokens.length; n++)
        {
            var tokenInfo = tokens[n];

            // no value =>  don't save:
            if (!tokenInfo.tokenValue)
            {
                this.log.debug("   ...skipping access token " + tokenInfo.tokenName + " (no value)");
                continue;
            }

            // expired value =>  don't save:
            if (isExpired(tokenInfo.expiresAt))
            {
                this.log.debug("   ...skipping access token " + tokenInfo.tokenName + " (expired)");
                continue;
            }

            this.log.debug("   ...reloaded access token " + tokenInfo.tokenName + " from token storage");
            this._tokens.Add(tokenInfo);
        }
    }

    private saveState()
    {
        this.log.info("Persisting authentication state...");

        var tokens: AccessTokenInfo[] = [];
        //for (var name in this._tokensByName)
        //{
        //    var tokenInfo = this._tokensByName[name];
        for (var tokenInfo of this._tokens.All())
        {
            // no value =>  don't save:
            if (!tokenInfo.tokenValue)
            {
                this.log.debug("   ...skipping access token " + tokenInfo.tokenName + " (no value)");
                continue;
            }

            // expired value =>  don't save:
            if (isExpired(tokenInfo.expiresAt))
            {
                this.log.debug("   ...skipping access token " + tokenInfo.tokenName + " (expired)");
                continue;
            }

            this.log.debug("   ...saving access token " + tokenInfo.tokenName + " to token storage");
            tokens.push(tokenInfo);
        }

        this.tokenStore.saveAll(tokens);
        this.log.info("...saved " + tokens.length + " access tokens");
    }

    public registerTokenInfo2(
        tokenName: string,
        loginName: string,
        resource: string,
        scopes: string[],
        protectUrls: string[]
    ): void
    {
        if (!protectUrls || protectUrls.length == 0)
        {
            this.log.info("Trying to register access token without any URLs");
            return
        }

        this.log.debug(
            "Registering access token \"" +
            tokenName +
            "\" (" +
            "resource=" + resource + ", " +
            "scopes=" + JSON.stringify(scopes) + ", " +
            "urls=" + JSON.stringify(protectUrls) +
            ")"
        );

        var value: AccessTokenInfo =
            {
                loginName: loginName,
                tokenName: tokenName,
                protectUrls: protectUrls,
                resource: resource,
                scopes: scopes,
                tokenValue: null,
                expiresAt: null,
            };

        this._tokens.Add(value);
    }

    //private sameToken(token1: AccessTokenInfo, token2: AccessTokenInfo): boolean
    //{
    //    if (token1 == token2)
    //        return true;

    //    if (token1 == null)
    //        return false;

    //    if (token2 == null)
    //        return false;

    //    if (!(token1.tokenName === token2.tokenName))
    //        return false;

    //    if (!(token1.resource === token2.resource))
    //        return false;

    //    if (!this.sameScopes(token1.scopes, token2.scopes))
    //        return false;

    //    return true;
    //}

    //private sameScopes(scopes1: string[], scopes2: string[]): boolean
    //{
    //    if (scopes1 == scopes2)
    //        return true;

    //    if (scopes1 == null)
    //        return false;

    //    if (scopes2 == null)
    //        return false;

    //    if (scopes1.length != scopes2.length)
    //        return false;

    //    for (var n = 0; n < scopes1.length; n++)
    //    {
    //        if (!(scopes1[n] === scopes2[n]))
    //            return false;
    //    }

    //    return true;
    //}

    //public getProtectedDomains(): string[]
    //{
    //    return this._tokensByUrl.getHosts();
    //}

    //public getAccessTokens(): { [id: string]: {}; }
    //{
    //    var res: { [id: string]: {}; } = {};

    //    for (var name in this._tokensByName)
    //    {
    //        var tokenInfo = this._tokensByName[name];

    //        if (!tokenInfo)
    //            continue;

    //        var encodedToken = tokenInfo.tokenValue;
    //        if (!encodedToken)
    //            continue;

    //        var decodedToken = jwtdecode(encodedToken);

    //        res[name] = decodedToken;
    //    }

    //    return res;
    //}
    public getAccessTokens(): { tokenName: string, tokenValue: string }[] 
    {
        return this._tokens.All().map(info => { return { tokenName: info.tokenName, tokenValue: info.tokenValue }; });
    }

    public getAccessTokenFor(
        url: string,
        success: (token: string) => void,
        error: (reason: any) => void
    ): void
    {
        if (!error)
            throw new Error("error callback must be specified");

        if (!success)
            return error("success callback must be specified");

        if (!url)
            return success(null);

        //var info = this._tokensByUrl.find(url);
        var info = this._tokens.ByUrl(url);

        if (!info)
            return success(null);

        // Check for expiration:
        if (isExpired(info.expiresAt))
        {
            info.tokenValue = null;
            info.expiresAt = null;
        }

        if (!!info.tokenValue)
            return success(info.tokenValue);

        this.acquireToken(
            info,
            (token: string) =>
            {
                success(token);
            },
            (reason: any) =>
            {
                error(reason);
            }
        );

        success(null);
    }

    private acquireToken(
        tokenInfo: AccessTokenInfo,
        success: (token: string) => void,
        error: (reason: any) => void
    ): void
    {
        this.acquireAccessToken(
            tokenInfo.loginName,
            tokenInfo.resource,
            tokenInfo.scopes,
            (token: string) =>
            {
                tokenInfo.tokenValue = token;
                tokenInfo.expiresAt = getExpiration(token);
                this.saveState();
                success(token);
            },
            error
        );
    }

    public setTokenValue2(
        accessTokenName: string,
        accessTokenValue: string
    ): void
    {
        var tokenInfo = this.lookupTokenInfo2(accessTokenName);
        if (!tokenInfo)
        {
            this.log.debug("Unexpected: resolving value for unregistered access token " + accessTokenName);
            return;
        }

        if (!accessTokenValue)
        {
            this.log.debug("Unexpected: resolving null value for access token " + accessTokenName);
            return;
        }

        tokenInfo.tokenValue = accessTokenValue;
        tokenInfo.expiresAt = getExpiration(accessTokenValue);

        this.saveState();
    }

    public clearTokenValues2(
        loginName: string
    ): void
    {
        var tokenInfos = this._tokens.ByLoginName(loginName);

        for (var n = 0; n < tokenInfos.length; n++)
        {
            var tokenInfo = tokenInfos[n];
            tokenInfo.tokenValue = null;
            tokenInfo.expiresAt = 0;
        }

        this.saveState();
    }
}

