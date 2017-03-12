import { isExpired, getExpiration} from './tokenutils';
import { UrlDictionary } from './urldictionary';
import { AccessTokenInfo } from "./tokeninfo";
import { ITokenStore, LocalStorageTokenStore } from "./tokenstore";
import { ILogger } from "../logger";

export interface ITokenManager
{
    setLog(log: ILogger): void;

    registerTokenInfo(
        pluginName: string,
        identityProviderName: string,
        tokenName: string,
        resource: string,
        scopes: string[],
        protectUrls: string[]
    ): void;

    lookupTokenInfo(
        pluginName: string,
        identityProviderName: string,
        tokenName: string
    ): AccessTokenInfo;

    setTokenValue(
        pluginName: string,
        identityProviderName: string,
        accessTokenName: string,
        accessTokenValue: string
    ): void;

    getAccessTokenFor(
        url: string,
        success: (token: string) => void,
        error: (reason: any) => void
    ): void;

    getProtectedDomains(): string[];
}

export function createTokenManager(acquireAccessToken: acquireTokenFn, log: ILogger, tokenStore: ITokenStore = null): ITokenManager
{
    if (!tokenStore)
        tokenStore = new LocalStorageTokenStore();

    return new AccessTokenManager(tokenStore, acquireAccessToken, log);
}

export type acquireTokenFn =
(
    pluginName: string,
    identityProviderName: string,
    resource: string,
    scopes: string[],
    success: (token: string) => void,
    error: (reason: any) => void
) => void;

class AccessTokenManager implements ITokenManager
{
    // 
    // =============
    private log: ILogger = console;
    public setLog(_log: ILogger): void
    {
        if (!_log)
            _log = console;

        this.log = _log;
    }

    private readonly _tokensByName: { [id: string]: AccessTokenInfo; } = {};
    private readonly _tokensByUrl: UrlDictionary<AccessTokenInfo> = new UrlDictionary<AccessTokenInfo>(); // { [id: string]: AccessTokenInfo; } = {};

    public constructor(private readonly tokenStore: ITokenStore, private readonly acquireAccessToken: acquireTokenFn, log: ILogger)
    {
        this.log = log || console;
        this.loadState();
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

        this.log.info("Reloaded " + tokens.length + " access tokens from token storage");

        for (var n = 0; n < tokens.length; n++)
        {
            this.log.debug("...reloaded access token " + tokens[n].tokenName + " from token storage");
            this.saveTokenInfo(tokens[n]);
        }
    }

    private saveState()
    {
        this.log.info("Persisting authentication state...");

        var tokens: AccessTokenInfo[] = [];
        for (var name in this._tokensByName)
            tokens.push(this._tokensByName[name]);

        this.tokenStore.saveAll(tokens);
        this.log.info("...saved " + tokens.length + " access tokens");
    }

    public registerTokenInfo(
        pluginName: string,
        identityProviderName: string,
        tokenName: string,
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
            "plugin=" + pluginName + ", " +
            "idp=" + identityProviderName + ", " +
            "resource=" + resource + ", " +
            "scopes=" + JSON.stringify(scopes) + ", " +
            "urls=" + JSON.stringify(protectUrls) +
            ")"
        );

        var value: AccessTokenInfo =
            {
                pluginName: pluginName,
                identityProviderName: identityProviderName,
                tokenName: tokenName,
                protectUrls: protectUrls,
                resource: resource,
                scopes: scopes,
                tokenValue: null,
                expiresAt: null,
            };

        this.saveTokenInfo(value);
    }

    private sameToken(token1: AccessTokenInfo, token2: AccessTokenInfo): boolean
    {
        if (token1 == token2)
            return true;

        if (token1 == null)
            return false;

        if (token2 == null)
            return false;

        if (!(token1.pluginName === token2.pluginName))
            return false;

        if (!(token1.identityProviderName === token2.identityProviderName))
            return false;

        if (!(token1.tokenName === token2.tokenName))
            return false;

        if (!(token1.resource === token2.resource))
            return false;

        if (!this.sameScopes(token1.scopes, token2.scopes))
            return false;

        return true;
    }

    private sameScopes(scopes1: string[], scopes2: string[]): boolean
    {
        if (scopes1 == scopes2)
            return true;

        if (scopes1 == null)
            return false;

        if (scopes2 == null)
            return false;

        if (scopes1.length != scopes2.length)
            return false;

        for (var n = 0; n < scopes1.length; n++)
        {
            if (!(scopes1[n] === scopes2[n]))
                return false;
        }

        return true;
    }

    private saveTokenInfo(value: AccessTokenInfo): void
    {
        var key = value.pluginName + ":" + value.identityProviderName + ":" + value.tokenName;

        // First, we'll check to see if there's an existing
        // registration:
        var existingValue = this._tokensByName[key];
        if (this.sameToken(existingValue, value))
        {
            // ...if so, we'll merge the new value into the old:
            if (!!value.expiresAt)
            {
                if ((!existingValue.expiresAt) || (existingValue.expiresAt < value.expiresAt))
                {
                    // copy in the new values - the old is empty
                    existingValue.tokenValue = value.tokenValue;
                    existingValue.expiresAt = value.expiresAt;
                }
            }
        }
        else
        {
            // OK, no existing value:
            this._tokensByName[key] = value;
            for (var n in value.protectUrls)
            {
                var url = value.protectUrls[n];
                this._tokensByUrl.add(url, value);
            }
        }
    }

    public getProtectedDomains(): string[]
    {
        return this._tokensByUrl.getHosts();
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

        var info = this._tokensByUrl.find(url);

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
            tokenInfo.pluginName,
            tokenInfo.identityProviderName,
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

    public lookupTokenInfo(
        pluginName: string,
        identityProviderName: string,
        tokenName: string
    ): AccessTokenInfo
    {
        var key = pluginName + ":" + identityProviderName + ":" + tokenName;
        return this._tokensByName[key];
    }

    public setTokenValue(
        pluginName: string,
        identityProviderName: string,
        accessTokenName: string,
        accessTokenValue: string
    ): void
    {
        var tokenInfo = this.lookupTokenInfo(pluginName, identityProviderName, accessTokenName);
        if (!tokenInfo)
        {
            this.log.debug("Unexpected: registering null value");
            this.log.debug("Unexpected: resolving value for unregistered access token " + accessTokenName);
            return;
        }

        if (!accessTokenValue)
        {
            this.log.debug("Unexpected: resolving null value ofr access token " + accessTokenName);
            return;
        }

        tokenInfo.tokenValue = accessTokenValue;
        tokenInfo.expiresAt = getExpiration(accessTokenValue);

        this.saveState();
    }
}

