import { ILog } from "superdup-auth-log";
//import { ILogin, IHybridLogin } from "./loginmanager";
import { IImplicitProvider, IHybridProvider } from "superdup-auth-core-providers";
import { UserInfo } from "superdup-auth-core-providers";

import { IApiManager, IApi } from "superdup-auth-core-apis";
import { IAuthenticationConfig } from "../iauthenticationconfig";
import { IProviderManager } from "superdup-auth-core-providers";
import { ILoginManager } from "superdup-auth-core-login";
import { IToken, ITokenManager, ITokenProvider } from "superdup-auth-core-tokens";

import { IApiBuilder } from "../iapibuilder";
import { ApiBuilder } from "./apibuilder";

import { ITokenBuilder } from "../itokenbuilder";
import { TokenBuilder } from "./tokenbuilder";

import { ITImplicitLoginBuilder, IImplicitLoginBuilder } from "../iimplicitloginbuilder";
import { TImplicitLoginBuilder, ImplicitLoginBuilder } from "./implicitloginbuilder";

import { ITHybridLoginBuilder, IHybridLoginBuilder } from "../ihybridloginbuilder";
import { THybridLoginBuilder, HybridLoginBuilder } from "./hybridloginbuilder";
import { IAuthenticationManager } from "../../iauthenticationmanager";
//import { TokenBuilder, ApiBuilder } from "../ihybridloginbuilder";

import { AsciiTable } from "../../utils";

export class AuthenticationConfig implements IAuthenticationConfig
{
    //private readonly _loginManager: ILoginManager;
    //private readonly _tokenManager: ITokenManager;
    //private readonly _apiManager: ApiManager = new ApiManager();
    constructor(
        private readonly _log: ILog,
        private readonly _loginManager: ILoginManager,
        private readonly _tokenManager: ITokenManager,
        private readonly _apiManager: IApiManager,
        private readonly _authenticationManager: IAuthenticationManager
    )
    {
        //var provider = createProviderManager();
        //this._loginManager = createLoginManager(provider, this._log);
        //this._tokenManager = createTokenManager(this._log);
    }

    //********************************************************************
    //* Logins:
    //* ===================
    //* 
    //* 
    //********************************************************************
    public implicitLogin<TOptions>(
        flow: new (args: TOptions, log: ILog) => IImplicitProvider
    ): ITImplicitLoginBuilder<TOptions>
    {
        return new TImplicitLoginBuilder<TOptions>(this._loginManager, this._tokenManager, this._authenticationManager, flow);
    }

    public hybridLogin<TOptions>(
        flow: new (args: TOptions, log: ILog) => IHybridProvider
    ): ITHybridLoginBuilder<TOptions>
    {
        return new THybridLoginBuilder<TOptions>(this._loginManager, this._tokenManager, this._authenticationManager, flow);
    }

    //********************************************************************
    //* Tokens:
    //* =======
    //* 
    //* 
    //********************************************************************
    public token(resource: string, scopes: string[]): ITokenBuilder
    {
        return new TokenBuilder(this._tokenManager, resource, scopes, this._log);
    }

    //********************************************************************
    //* APIs:
    //* =======
    //* 
    //* 
    //********************************************************************
    public api(...urls: string[]): ApiBuilder
    {
        return new ApiBuilder(urls, this._tokenManager, this._apiManager, this._log);
    }

    public verify(): void
    {
        var errors: string[] = [];

        var verifiedTokenNames: string[] = [];
        var verifiedProviderIds: string[] = [];
        for (var api of this._apiManager.registrations)
        {
            if (!api.tokenName)
            {
                errors.push("Missing token name in API registration: URL prefix " + api.urlPrefix + " registered with token name " + api.tokenName);
                continue;
            }

            if (verifiedTokenNames.indexOf(api.tokenName) >= 0)
                continue;
            verifiedTokenNames.push(api.tokenName);

            var token = this._tokenManager.tokenByName(api.tokenName);
            if (!token)
            {
                errors.push("Undefined token: token name " + api.tokenName + " (required by URL " + api.urlPrefix + ") is not defined");
                continue;
            }

            if (!token.providerId)
            {
                errors.push("Missing provider in token registration: token " + token.tokenName + " registered with provider " + token.providerId);
                continue;
            }

            if (verifiedProviderIds.indexOf(token.providerId) >= 0)
                continue;
            verifiedProviderIds.push(token.providerId);

            if (this._loginManager.loginNames.indexOf(token.providerId) < 0)
            {
                errors.push("Undefined login: login name " + token.providerId + " (providing token " + token.tokenName + ") is not defined");
                continue;
            }
        }

        var warnings: string[] = [];
        for (var loginName of this._loginManager.loginNames)
        {
            var tokens = this._tokenManager.tokensByProvider(loginName);
            if (!tokens || tokens.length == 0)
            {
                warnings.push("Unreferenced login: Login " + loginName + " is defined, but not registered to provide any access tokens");
            }
        }

        for (var tokenName of this._tokenManager.tokenNames)
        {
            var isUsed = this._apiManager.registrations.some(api => api.tokenName === tokenName);
            if (!isUsed)
                warnings.push("Unreferenced token: Token " + tokenName + " is defined, but not registered for use with any API");
        }

        var errMsg: string = null;
        if (errors.length > 0)
        {
            errMsg = "The authentication configuration contained the following errors:";
            for (var err of errors)
            {
                errMsg = errMsg + "\n    " + err;
                this._log.error(err);
            }
        }

        var warningMsg: string = null;
        if (warnings.length > 0)
        {
            warningMsg = "The authentication configuration contained the following peculiarities that might indicate a problem:";
            for (var warning of warnings)
            {
                warningMsg = warningMsg + "\n    " + warning;
                this._log.warn(warning);
            }
        }

        if (errMsg != null)
            throw new Error(errMsg);
    }

    public toString(): string
    {
        var apis = this._apiManager.registrations;
        var tokens = this._tokenManager.tokenNames.map((tokenname) => this._tokenManager.tokenByName(tokenname));
        var logins = this._loginManager.loginNames;//.map((loginname) => this._loginManager.getLogin(loginname));

        var apis_tokens_logins =
            Query
                .OuterJoin(apis, tokens, (api, token) => api.tokenName === token.tokenName)
                .OuterJoin(logins, (api, token, login) => token.providerId === login)
                .Select((api, token, login) => { return { api: api, token: token, login: login }; });

        var stateTable = new AsciiTable(20, 12, 12, 18, 25, 12, 12, 12, 40);
        stateTable
            .Separator(2, 4, 3)
            .AddCell("API definition", 2)
            .AddCell("Token definition", 4)
            .AddCell("Login definition", 3)
            .Newline()
            .Separator(1, 1, 1, 1, 1, 1, 1, 1, 1)
            .AddCell("URL")
            .AddCell("Token name")
            .AddCell("Token name")
            .AddCell("Resource")
            .AddCell("Scopes")
            .AddCell("Login name")
            .AddCell("Login name")
            .AddCell("Provider")
            .AddCell("Provider parameters")
            .Separator(1, 1, 1, 1, 1, 1, 1, 1, 1);
        "+--------------------------------+---------------------------------------------+---------------------------------------------+\n" +
            "|         API definition         |              Token definition               |              Login definition               |\n" +
            "+--------------------------------+---------------------------------------------+---------------------------------------------+\n" +
            "|        URL        | Token name | Token name | Resource | Scopes | Login name | Login name | Provider | Provider parameters |\n" +
            "+-------------------+------------+------------+----------+--------+------------+------------+----------+---------------------+\n";
        for (var line of apis_tokens_logins)
        {
            if (!!line.api)
            {
                stateTable
                    .AddCell(line.api.urlPrefix)
                    .AddCell(line.api.tokenName);
            }
            else
            {
                stateTable
                    .AddCell("-")
                    .AddCell("-");
            }

            if (!!line.token)
            {
                stateTable
                    .AddCell(line.token.tokenName)
                    .AddCell(line.token.resource)
                    .AddCell(line.token.scopes.join(", "))
                    .AddCell(line.token.providerId);
            }
            else
            {
                stateTable
                    .AddCell("-")
                    .AddCell("-")
                    .AddCell("-")
                    .AddCell("-");
            }

            if (!!line.login)
            {
                stateTable
                    .AddCell(line.login)
                    .AddCell("?")
                    .AddCell("?");
            }
            else
            {
                stateTable
                    .AddCell("-")
                    .AddCell("-")
                    .AddCell("-");
            }

            stateTable.Newline();
        }

        stateTable.Separator(1, 1, 1, 1, 1, 1, 1, 1, 1);

        var res = stateTable.toString();
        this._log.info(res);

        return res;
    }
}

class Query
{
    public static OuterJoin<T1, T2>(
        part1: T1[],
        part2: T2[],
        onPredicate: (p1: T1, p2: T2) => boolean
        ): QueryResult<T1, T2>
    {
        var res: { p1: T1, p2: T2 }[] = [];

        for (var p1 of part1)
        {
            var p1Matched = false;

            for (var p2 of part2)
            { 
                var pred = false;
                try
                {
                    pred = onPredicate(p1, p2);
                }
                catch (err)
                {
                }

                if (pred)
                {
                    res.push({ p1: p1, p2: p2 });
                    p1Matched = true;
                }
            }

            if (!p1Matched)
                res.push({ p1: p1, p2: null });
        }

        for (var p2 of part2)
        {
            if (!res.some(r => r.p2 == p2))
                res.push({ p1: null, p2: p2 });
        }

        return new QueryResult(res);
    }
}

class QueryResult<T1, T2>
{
    constructor(private readonly res: { p1: T1, p2: T2 }[])
    { }

    public Select<TResult>(createResult: (p1: T1, p2: T2) => TResult): TResult[]
    {
        return this.res.map(p => createResult(p.p1, p.p2));
    }

    public OuterJoin<T3>(
        rightSet: T3[],
        onPredicate: (p1: T1, p2: T2, p3: T3) => boolean
    ): QueryResult3<T1, T2, T3>
    {
        var res: { p1: T1, p2: T2, p3: T3 }[] = [];

        for (var p12 of this.res)
        {
            var p1 = !!p12 ? p12.p1 : null;
            var p2 = !!p12 ? p12.p2 : null;
            var p1Matched = false;

            for (var right of rightSet)
            {
                var pred = false;
                try
                {
                    pred = onPredicate(p1, p2, right);
                }
                catch (err)
                {
                }

                if (pred)
                {
                    res.push({ p1: p1, p2: p2, p3: right });
                    p1Matched = true;
                }
            }

            if (!p1Matched)
                res.push({ p1: p1, p2: p2, p3: null });
        }

        for (var right of rightSet)
        {
            if (!res.some(r => r.p3 == right))
                res.push({ p1: null, p2: null, p3: right });
        }

        return new QueryResult3(res);
    }
}


class QueryResult3<T1, T2, T3>
{
    constructor(private readonly res: { p1: T1, p2: T2, p3:T3 }[])
    { }

    public Select<TResult>(createResult: (p1: T1, p2: T2, p3: T3) => TResult): TResult[]
    {
        return this.res.map(p => createResult(p.p1, p.p2, p.p3));
    }
}


