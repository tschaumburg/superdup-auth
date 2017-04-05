import jwtdecode = require("jwt-decode");
import { isExpired, getExpiration} from './tokenutils';
import { AccessTokenInfo } from "./tokeninfo";
import { IMultiMap, MultiMap } from "./datatypes/multimap";
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

    setTokenValue2(accessTokenName: string, accessTokenValue: string): void;
    clearTokenValues2(loginName: string): void;

    findByTokenName(tokenName: string): AccessTokenInfo;


    getAccessTokens(): { tokenName: string, tokenValue: string }[];

    getAccessTokenFor(
        url: string,
        success: (token: string) => void,
        error: (reason: any) => void
    ): void;
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
    private readonly _tokens: IMultiMap = new MultiMap();
    public findByTokenName(tokenName: string): AccessTokenInfo
    {
        return this._tokens.findByTokenName(tokenName);
    }

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
        var info = this._tokens.findByUrl(url);

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
        var tokenInfo = this._tokens.findByTokenName(accessTokenName);
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
        var tokenInfos = this._tokens.findByLoginName(loginName);

        for (var n = 0; n < tokenInfos.length; n++)
        {
            var tokenInfo = tokenInfos[n];
            tokenInfo.tokenValue = null;
            tokenInfo.expiresAt = 0;
        }

        this.saveState();
    }
}

