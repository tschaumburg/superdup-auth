export interface RequestInfo
{
    audience: string;
    response_types: string[];
    scopes: string[];
}

export interface AccessTokenInfo
{
    api_resource: string;
    api_scopes: string[];
}

export class FlowHelper
{
    private static oauth2Url = "http://tools.ietf.org/html/rfc6749";
    private static openidUrl = "http://openid.net/specs/openid-connect-core-1_0.html";

    public static ImplicitInfo(include_idtoken: string[], include_accesstoken: AccessTokenInfo): RequestInfo
    {
        if (!include_idtoken && !include_accesstoken)
        {
            throw new Error("You cannot request an implicit flow with neither access nor ID tokens. See " + FlowHelper.oauth2Url);
        }

        var result: RequestInfo = {
            audience: undefined,
            scopes: [],
            response_types: []
        };

        if (!!include_idtoken)
        {
            if (include_idtoken.indexOf("openid") < 0)
                result.scopes.push("openid");
            result.scopes = result.scopes.concat(include_idtoken);

            result.response_types.push("id_token");
        }

        if (!!include_accesstoken)
        {
            result.audience = include_accesstoken.api_resource;
            result.scopes = result.scopes.concat(include_accesstoken.api_scopes);
            result.response_types.push("token");
        }

        return result;
    }

    public static AuthCodeInfo(include_idtoken: string[], include_refreshtoken: boolean, include_accesstoken: AccessTokenInfo): RequestInfo
    {
        if (!include_idtoken && !include_accesstoken)
        {
            throw new Error("You cannot request an authorization code flow with neither access nor ID tokens. See " + FlowHelper.openidUrl);
        }

        var result: RequestInfo = {
            audience: undefined,
            scopes: [],
            response_types: ['code']
        };

        if (include_refreshtoken)
        {
            result.scopes.push("offline_access");
        }

        if (!!include_idtoken)
        {
            if (include_idtoken.indexOf("openid") < 0)
                result.scopes.push("openid");
            result.scopes = result.scopes.concat(include_idtoken);

            //result.response_types.push("id_token");
        }

        if (!!include_accesstoken)
        {
            result.audience = include_accesstoken.api_resource;
            result.scopes = result.scopes.concat(include_accesstoken.api_scopes);

            //result.response_types.push("token");
        }

        return result;
    }

    public static HybridInfo(include_idtoken: string[], include_refreshtoken: boolean, include_accesstoken: AccessTokenInfo): RequestInfo
    {
        if (!include_idtoken && !include_accesstoken)
        {
            throw new Error("You cannot request a hybrid flow with neither access nor ID tokens. See " + FlowHelper.openidUrl);
        }

        var result: RequestInfo = {
            audience: undefined,
            scopes: [],
            response_types: ['code']
        };

        if (include_refreshtoken)
        {
            result.scopes.push("offline_access");
        }

        if (!!include_idtoken)
        {
            if (include_idtoken.indexOf("openid") < 0)
                result.scopes.push("openid");
            result.scopes = result.scopes.concat(include_idtoken);

            result.response_types.push("id_token");
        }

        if (!!include_accesstoken)
        {
            result.audience = include_accesstoken.api_resource;
            result.scopes = result.scopes.concat(include_accesstoken.api_scopes);
            result.response_types.push("token");
        }

        return result;
    }
}
