import jwtdecode = require("jwt-decode");
import { isExpired, getExpiration} from './tokenutils';
import { AccessTokenInfo } from "./tokeninfo";
//import { IMultiMap, MultiMap } from "./datatypes/multimap";
import { ITokenStore, LocalStorageTokenStore } from "./tokenstore";
import { ILogger } from "../../logger";

export interface ITokenManager
{
    registerInfo(
        tokenName: string,
        loginName: string,
        resource: string,
        scopes: string[],
        protectUrls: string[],
        log: ILogger
    ): void;
    findInfo(tokenName: string, log: ILogger): AccessTokenInfo;

    setValue(accessTokenName: string, accessTokenValue: string, log: ILogger): void;
    clearValues(loginName: string, log: ILogger): void;
    getValue(
        tokenName: string,
        success: (token: string) => void,
        error: (reason: any) => void,
        log: ILogger
    ): void;


    getTokenNames(loginName: string, log: ILogger): string[];
    getTokenValue(tokenName: string): string;
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
        this.loadState(log);
    }

    // 
    // =============
    //private _tokens: IMultiMap = new MultiMap();
    private _tokens: { [id: string]: AccessTokenInfo; } = {};

    public findInfo(tokenName: string): AccessTokenInfo
    {
        return this._tokens[tokenName];
    }

    private loadState(log: ILogger)
    {
        log.info("Reloading persisted authentication state...");

        var tokens = this.tokenStore.loadAll();
        if (!tokens)
        {
            log.info("...no tokens found");
            return;
        }

        log.info("...reloaded " + tokens.length + " access tokens from token storage");

        for (var n = 0; n < tokens.length; n++)
        {
            var tokenInfo = tokens[n];

            // no value =>  don't save:
            if (!tokenInfo.tokenValue)
            {
                log.debug("   ...skipping access token " + tokenInfo.tokenName + " (no value)");
                continue;
            }

            // expired value =>  don't save:
            if (isExpired(tokenInfo.expiresAt))
            {
                log.debug("   ...skipping access token " + tokenInfo.tokenName + " (expired)");
                continue;
            }

            log.debug("   ...reloaded access token " + tokenInfo.tokenName + " from token storage");
            this._tokens[tokenInfo.tokenName]=tokenInfo;
        }
    }

    private saveState(log: ILogger)
    {
        log.info("Persisting authentication state...");

        var tokens: AccessTokenInfo[] = [];
        for (var tokenName in this._tokens)
        {
            var tokenInfo = this._tokens[tokenName];

            // no value =>  don't save:
            if (!tokenInfo.tokenValue)
            {
                log.debug("   ...skipping access token " + tokenInfo.tokenName + " (no value)");
                continue;
            }

            // expired value =>  don't save:
            if (isExpired(tokenInfo.expiresAt))
            {
                log.debug("   ...skipping access token " + tokenInfo.tokenName + " (expired)");
                continue;
            }

            log.debug("   ...saving access token " + tokenInfo.tokenName + " to token storage");
            tokens.push(tokenInfo);
        }

        this.tokenStore.saveAll(tokens);
        log.info("...saved " + tokens.length + " access tokens");
    }

    public registerInfo(
        tokenName: string,
        loginName: string,
        resource: string,
        scopes: string[],
        protectUrls: string[],
        log: ILogger
    ): void
    {
        if (!protectUrls || protectUrls.length == 0)
        {
            log.info("Trying to register access token without any URLs");
            return
        }

        log.debug(
            "Registering access token \"" +
            tokenName +
            "\" (" +
            "resource=" + resource + ", " +
            "scopes=" + JSON.stringify(scopes) + ", " +
            "urls=" + JSON.stringify(protectUrls) +
            ")"
        );

        var existingValue = this._tokens[tokenName];
        var newValue: AccessTokenInfo =
            {
                loginName: loginName,
                tokenName: tokenName,
                protectUrls: protectUrls,
                resource: resource,
                scopes: scopes,
                tokenValue: null,
                expiresAt: null,
            };

        if (!!existingValue)
        {
            if (this.sameDefinition(existingValue, newValue))
                return;

            log.error("Trying to redefine access token \"" + tokenName + "\"");
        }

        this._tokens[tokenName] = newValue;
    }

    private sameDefinition(first: AccessTokenInfo, second: AccessTokenInfo): boolean
    {
        if (first == second)
            return true;

        if (!first)
            return false;

        if (!second)
            return false;

        if (first.tokenName !== second.tokenName)
            return false;

        if (first.resource !== second.resource)
            return false;

        if (!this.sameList(first.scopes, second.scopes))
            return false;

        if (!this.sameList(first.protectUrls, second.protectUrls))
            return false;

        return true;
    }

    private sameList(first: string[], second: string[]): boolean
    {
        if (first == second)
            return true;

        if (!first)
            return false;

        if (!second)
            return false;

        if (first.length !== second.length)
            return false;

        first = first.sort();
        second = second.sort();

        for (var n in first)
        {
            if (first[n] !== second[n])
                return false;
        }

        return true;
    }

    public getTokenNames(loginName: string, log: ILogger): string[]
    {
        var res: string[] = [];
        for (var tokenName in this._tokens) 
        {
            var info = this._tokens[tokenName];

            if (info.loginName === loginName)
                res.push(tokenName);
        }
        return res;
    }

    public getTokenValue(tokenName: string): string
    {
        var info = this._tokens[tokenName];
        if (!info)
            return null;

        return info.tokenValue;
    }

    public getValue(
        tokenName: string,
        success: (token: string) => void,
        error: (reason: any) => void,
        log: ILogger
    ): void {
        if (!error)
            throw new Error("error callback must be specified");

        if (!success)
            return error("success callback must be specified");

        if (!tokenName)
            return success(null);

        //var info = this._tokensByUrl.find(url);
        var info = this._tokens[tokenName];

        if (!info)
            return success(null);

        // Check for expiration:
        if (isExpired(info.expiresAt)) {
            info.tokenValue = null;
            info.expiresAt = null;
        }

        if (!!info.tokenValue)
            return success(info.tokenValue);

        this.acquireToken(
            info,
            (token: string) => {
                success(token);
            },
            (reason: any) => {
                error(reason);
            },
            log
        );

        success(null);
    }

    private acquireToken(
        tokenInfo: AccessTokenInfo,
        success: (token: string) => void,
        error: (reason: any) => void,
        log: ILogger
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
                this.saveState(log);
                success(token);
            },
            error
        );
    }

    public setValue(
        accessTokenName: string,
        accessTokenValue: string,
        log: ILogger
    ): void
    {
        var tokenInfo = this._tokens[accessTokenName];
        if (!tokenInfo)
        {
            log.debug("Unexpected: resolving value for unregistered access token " + accessTokenName);
            return;
        }

        if (!accessTokenValue)
        {
            log.debug("Unexpected: resolving null value for access token " + accessTokenName);
            return;
        }

        tokenInfo.tokenValue = accessTokenValue;
        tokenInfo.expiresAt = getExpiration(accessTokenValue);

        this.saveState(log);
    }

    public clearValues(
        loginName: string,
        log: ILogger
    ): void
    {
        for (var tokenname in this._tokens)
        {
            var tokenInfo = this._tokens[tokenname];
            if (tokenInfo.loginName === loginName)
            {
                tokenInfo.tokenValue = null;
                tokenInfo.expiresAt = 0;
            }
        }

        this.saveState(log);
    }
}

