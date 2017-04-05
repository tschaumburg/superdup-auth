import { UrlDictionary } from './urldictionary';
import { AccessTokenInfo } from "../tokeninfo";

export interface IMultiMap
{
    Add(value: AccessTokenInfo): void;
    All(): AccessTokenInfo[];
    findByTokenName(tokenName: string): AccessTokenInfo;
    findByUrl(url: string): AccessTokenInfo;
    findByLoginName(loginName: string): AccessTokenInfo[];
}

export class MultiMap implements IMultiMap {
    private readonly _tokensByName: { [id: string]: AccessTokenInfo; } = {};
    private readonly _tokensByUrl: UrlDictionary<AccessTokenInfo> = new UrlDictionary<AccessTokenInfo>(); // { [id: string]: AccessTokenInfo; } = {};
    private _allTokenInfos: AccessTokenInfo[] = null;
    
    Add(value: AccessTokenInfo): void
    {
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

    public All(): AccessTokenInfo[] {
        if (!this._allTokenInfos) {
            this._allTokenInfos = [];
            for (var name in this._tokensByName) {
                var tokenInfo = this._tokensByName[name];
                this._allTokenInfos.push(tokenInfo);
            }
        }

        return this._allTokenInfos;
    }


    public findByTokenName(tokenName: string): AccessTokenInfo {
        var key = tokenName;
        return this._tokensByName[key];
    }

    public findByUrl(
        url: string
    ): AccessTokenInfo {
        return this._tokensByUrl.find(url);
    }

    public findByLoginName(
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
    }
}
