export interface IToken
{
    readonly tokenName: string;
    readonly resource: string;
    readonly scopes: string[];
    getValue(
        success: (token: string) => void,
        error: (reason: any) => void
    ): void;
}