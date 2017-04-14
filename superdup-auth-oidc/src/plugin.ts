import { PluginBase, IIdentityProvider} from "superdup-auth-core";
import { OidcOptions } from "./options";
import { OidcIdentityProvider } from "./identityprovider";

export class OidcPlugin extends PluginBase<OidcOptions>
{
    protected createIdentityProvider(
        identityProviderName: string,
        providerOptions: OidcOptions
    ): IIdentityProvider
    {
        return new OidcIdentityProvider(providerOptions);
    }
}

