import jwtdecode = require("jwt-decode");
import { isExpired, getExpiration} from '../../utils';
import { IToken } from "../itoken";
import { ITokenManager } from "../itokenmanager";
import { ITokenProvider } from "../itokenprovider";
//import { IMultiMap, MultiMap } from "./datatypes/multimap";
import { ITokenStore, LocalStorageTokenStore } from "./tokenstore";
import { Token } from "./token";
import { ILog } from "superdup-auth-log";

export function createTokenManager(/*acquireAccessToken: acquireTokenFn,*/ log: ILog, tokenStore: ITokenStore = null): ITokenManager
{
    if (!tokenStore)
        tokenStore = new LocalStorageTokenStore();

    return new AccessTokenManager(tokenStore/*, acquireAccessToken*/, log);
}

//export type acquireTokenFn =
//(
//    loginName: string,
//    resource: string,
//    scopes: string[],
//    success: (token: string) => void,
//    error: (reason: any) => void
//) => void;

class AccessTokenManager implements ITokenManager
{
    public constructor(private readonly tokenStore: ITokenStore/*, private readonly acquireAccessToken: acquireTokenFn*/, private readonly _log: ILog)
    {
        this.loadState(_log);
    }

    // 
    // =============
    private _tokens: { [id: string]: Token; } = {};

    public get tokenNames(): string[]
    {
        var res: string[] = [];

        for (var tokenName in this._tokens)
            res.push(tokenName);

        return res;
    }

    public tokenByName(tokenName: string): IToken
    {
        return this._tokens[tokenName];
    }

    public tokensByProvider(providerName: string): IToken[]
    {
        var res: IToken[] = [];

        for (var tokenname in this._tokens)
        {
            var tokenInfo = this._tokens[tokenname];
            if (!tokenInfo.provider || !tokenInfo.provider.providerId)
            {
                if (!providerName)
                    res.push(tokenInfo);
                continue;
            }

            if (tokenInfo.provider.providerId === providerName)
            {
                res.push(tokenInfo);
            }
        }

        return res;
    }


    private loadState(log: ILog)
    {
        log.info("Reloading persisted authentication state...");

        var loadedValues = this.tokenStore.loadAll();
        if (!loadedValues)
        {
            log.info("...no tokens found");
            return;
        }

        log.info("...reloaded " + loadedValues.length + " access tokens from token storage");

        for (var n = 0; n < loadedValues.length; n++)
        {
            var loadedValue = loadedValues[n];

            // no value =>  don't save:
            if (!loadedValue.value)
            {
                log.debug("   ...skipping access token " + loadedValue.name + " (no value)");
                continue;
            }

            var token = this._tokens[loadedValue.name];
            if (!token)
                continue;

            //// expired value =>  don't save:
            //if (isExpired(tokenInfo.expiresAt))
            //{
            //    log.debug("   ...skipping access token " + tokenInfo.name + " (expired)");
            //    continue;
            //}

            token.setValue(loadedValue.value);
            log.debug("   ...reloaded access token " + loadedValue.name + " from token storage");
        }
    }

    //private saveState(log: ILog)
    //{
    //    log.info("Persisting authentication state...");

    //    var tokens: Token[] = [];
    //    for (var tokenName in this._tokens)
    //    {
    //        var tokenInfo = this._tokens[tokenName];

    //        // no value =>  don't save:
    //        if (!tokenInfo.tokenValue)
    //        {
    //            log.debug("   ...skipping access token " + tokenInfo.tokenName + " (no value)");
    //            continue;
    //        }

    //        // expired value =>  don't save:
    //        if (isExpired(tokenInfo.expiresAt))
    //        {
    //            log.debug("   ...skipping access token " + tokenInfo.tokenName + " (expired)");
    //            continue;
    //        }

    //        log.debug("   ...saving access token " + tokenInfo.tokenName + " to token storage");
    //        tokens.push(tokenInfo);
    //    }

    //    this.tokenStore.saveAll(tokens);
    //    log.info("...saved " + tokens.length + " access tokens");
    //}

    public registerProvider(
        tokenName: string,
        providedBy: ITokenProvider  
    ): void
    {
        this._log.info("Registering provider " + providedBy.providerId + " for token " + tokenName);

        var token = this._tokens[tokenName];
        if (!token)
        {
            var msg = "No token " + tokenName + " registered";
            this._log.error(msg);
            throw new Error(msg);
        }

        if (!!token.provider)
        {
            var msg = "Token " + tokenName + " already has a provider registered";
            this._log.error(msg);
            throw new Error(msg);
        }

        token.provider = providedBy;
    }

    public registerToken(
        tokenName: string,
        resource: string,
        scopes: string[]
        //providedBy: ITokenProvider
    ): IToken
    {
        this._log.debug(
            "Registering access token \"" +
            tokenName +
            "\" (" +
            "resource=" + resource + ", " +
            "scopes=" + JSON.stringify(scopes) +
            ")"
        );

        var existingValue = this._tokens[tokenName];

        var self = this;
        var newValue =
            new Token(
                tokenName,
                resource,
                scopes,
                null, //providedBy,
                this.tokenStore,
                this._log
            );

        if (!!existingValue)
        {
            if (this.sameDefinition(existingValue, newValue))
                return existingValue;

            this._log.error("Trying to redefine access token \"" + tokenName + "\"");
        }

        this._tokens[tokenName] = newValue;
        return newValue;
    }

    private sameDefinition(first: Token, second: Token): boolean
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

    //public getTokenNames(loginName: string, log: ILog): string[]
    //{
    //    var res: string[] = [];
    //    for (var tokenName in this._tokens) 
    //    {
    //        var info = this._tokens[tokenName];

    //        if (info.provider.providerId === loginName)
    //            res.push(tokenName);
    //    }
    //    return res;
    //}

    //public getTokenValue(tokenName: string): string
    //{
    //    var info = this._tokens[tokenName];
    //    if (!info)
    //        return null;

    //    return info.tokenValue;
    //}

    //public getValue(
    //    tokenName: string,
    //    success: (token: string) => void,
    //    error: (reason: any) => void,
    //    log: ILog
    //): void {
    //    if (!error)
    //        throw new Error("error callback must be specified");

    //    if (!success)
    //        return error("success callback must be specified");

    //    if (!tokenName)
    //        return success(null);

    //    //var info = this._tokensByUrl.find(url);
    //    var info = this._tokens[tokenName];

    //    if (!info)
    //        return success(null);

        //// Check for expiration:
        //if (isExpired(info.expiresAt)) {
        //    info.tokenValue = null;
        //    info.expiresAt = null;
        //}

        //if (!!info.tokenValue)
        //    return success(info.tokenValue);

    //    this.acquireToken(
    //        info,
    //        (token: string) => {
    //            success(token);
    //        },
    //        (reason: any) => {
    //            error(reason);
    //        },
    //        log
    //    );

    //    success(null);
    //}

    //private acquireToken(
    //    tokenInfo: AccessTokenInfo,
    //    success: (token: string) => void,
    //    error: (reason: any) => void,
    //    log: ILog
    //): void
    //{
    //    tokenInfo.provider.provideTokenValue(
    //        tokenInfo.resource,
    //        tokenInfo.scopes,
    //        (token: string) =>
    //        {
    //            tokenInfo.tokenValue = token;
    //            tokenInfo.expiresAt = getExpiration(token);
    //            this.saveState(log);
    //            success(token);
    //        },
    //        error,
    //        log
    //    );
    //}

    //public setValue(
    //    accessTokenName: string,
    //    accessTokenValue: string,
    //    log: ILog
    //): void
    //{
    //    var tokenInfo = this._tokens[accessTokenName];
    //    if (!tokenInfo)
    //    {
    //        log.debug("Unexpected: resolving value for unregistered access token " + accessTokenName);
    //        return;
    //    }

    //    if (!accessTokenValue)
    //    {
    //        log.debug("Unexpected: resolving null value for access token " + accessTokenName);
    //        return;
    //    }

    //    tokenInfo.tokenValue = accessTokenValue;
    //    tokenInfo.expiresAt = getExpiration(accessTokenValue);

    //    this.saveState(log);
    //}

    //public clearValues(
    //    loginName: string,
    //    log: ILog
    //): void
    //{
    //    for (var tokenname in this._tokens)
    //    {
    //        var tokenInfo = this._tokens[tokenname];
    //        if (tokenInfo.provider.providerId === loginName)
    //        {
    //            tokenInfo.tokenValue = null;
    //            tokenInfo.expiresAt = 0;
    //        }
    //    }

    //    this.saveState(log);
    //}
}

