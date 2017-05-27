import { ILog } from "superdup-auth-log";
import { IToken } from "../itoken";
import { ITokenStore } from "./tokenstore";
import { ITokenProvider } from "../itokenprovider";
import { isExpired, getExpiration } from './tokenutils';

export class Token implements IToken
{
    expiresAt: number = null;

    public constructor(
        public readonly tokenName: string,
        public readonly resource: string,
        public readonly scopes: string[],
        provider: ITokenProvider,
        private readonly tokenStore: ITokenStore,
        private readonly log: ILog
    )
    {
        var self = this;
        this.provider = provider;
    }

    private _provider: ITokenProvider = null;
    public get provider(): ITokenProvider
    {
        return this._provider;
    }

    public set provider(value: ITokenProvider)
    {
        if (value == this._provider)
            return;

        //if (!!this._provider)
        //{
        //    var self = this;
        //    this.provider.loggingOut.unsubscribe(
        //        () =>
        //        {
        //            self.clearValue();
        //        }
        //    );
        //}

        this._provider = value;

        //if (!!this._provider)
        //{
        //    var self = this;
        //    this.provider.loggingOut.subscribe(
        //        () =>
        //        {
        //            self.clearValue();
        //        }
        //    );
        //}
    }

    _tokenValue: string = null;
    public get tokenValue(): string
    {
        return this._tokenValue;
    }

    public get providerId(): string
    {
        if (!this.provider)
            return null;
        return this.provider.providerId;
    }

    public getValue(
        success: (token: string) => void,
        error: (reason: any) => void
    ): void
    {
        // Check for expiration:
        if (isExpired(this.expiresAt))
        {
            this._tokenValue = null;
            this.expiresAt = null;
        }

        if (!!this._tokenValue)
            return success(this._tokenValue);

        this.provider.provideTokenValue(
            this.resource,
            this.scopes,
            (value) =>
            {
                this.setValue(value);
                success(value);
            },
            error
        );
    }

    public setValue(accessTokenValue: string): void
    {
        if (!accessTokenValue)
        {
            this.log.debug("Unexpected: resolving null value for access token " + this.tokenName);
            return;
        }

        this._tokenValue = accessTokenValue;
        this.expiresAt = getExpiration(accessTokenValue);

        if (isExpired(this.expiresAt))
        {
            this.log.debug("Expired value for access token " + this.tokenName);
            this._tokenValue = null;
            this.expiresAt = null;
            return;
        }

        this.tokenStore.saveToken(this.tokenName, this._tokenValue);
    }

    public clearValue(): void
    {
        this.log.debug("Clearing access token " + this.tokenName);

        this._tokenValue = null;
        this.expiresAt = null;

        this.tokenStore.clearToken(this.tokenName);
    }
}