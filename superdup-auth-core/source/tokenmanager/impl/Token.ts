import { ILog } from "superdup-auth-log";
import { IToken } from "../itoken";
import { ITokenStore } from "./tokenstore";
import { ITokenProvider } from "../itokenprovider";
import { isExpired, getExpiration } from '../../utils';

export class Token implements IToken
{
    tokenValue: string = null;
    expiresAt: number = null;

    public constructor(
        public readonly tokenName: string,
        public readonly resource: string,
        public readonly scopes: string[],
        public readonly provider: ITokenProvider,
        private readonly tokenStore: ITokenStore,
        private readonly log: ILog
    )
    {
        var self = this;
        this.provider.loggingOut.sub(
            (src, v) =>
            {
                self.clearValue();
            }
        );
    }

    public getValue(
        success: (token: string) => void,
        error: (reason: any) => void
    ): void
    {
        // Check for expiration:
        if (isExpired(this.expiresAt))
        {
            this.tokenValue = null;
            this.expiresAt = null;
        }

        if (!!this.tokenValue)
            return success(this.tokenValue);

        this.provider.provideTokenValue(
            this.resource,
            this.scopes,
            (value) =>
            {
                this.setValue(value);
                success(value);
            },
            error,
            this.log
        );
    }

    public setValue(accessTokenValue: string): void
    {
        if (!accessTokenValue)
        {
            this.log.debug("Unexpected: resolving null value for access token " + this.tokenName);
            return;
        }

        this.tokenValue = accessTokenValue;
        this.expiresAt = getExpiration(accessTokenValue);

        if (isExpired(this.expiresAt))
        {
            this.log.debug("Expired value for access token " + this.tokenName);
            this.tokenValue = null;
            this.expiresAt = null;
            return;
        }

        this.tokenStore.saveToken(this.tokenName, this.tokenValue);
    }

    private clearValue(): void
    {
        this.log.debug("Clearing access token " + this.tokenName);

        this.tokenValue = null;
        this.expiresAt = null;

        this.tokenStore.clearToken(this.tokenName);
    }
}