import { PluginBase, IIdentityProvider} from "superdup-auth-core";
import { Auth0jsOptions } from "./options";
import { Auth0jsIdentityProvider } from "./identityprovider";

export class Auth0jsPlugin extends PluginBase<Auth0jsOptions>
{
    protected createIdentityProvider(
        identityProviderName: string,
        providerOptions: Auth0jsOptions
    ): IIdentityProvider
    {
        return new Auth0jsIdentityProvider(providerOptions);
    }
}

