export { ILogger } from "./logger"; // requires es6!

export { IPlugin, PluginBase, IIdentityProvider } from "./plugins"; // requires es6!
export { IAuthManager, getAuthManager } from "./authmanager"; // requires es6!
export { UserInfo } from "./users"; // requires es6!
//export * from "./users"; // requires es6!
//export * from "./plugins"; // requires es6!
export { decodeHash} from "./tokens"; // requires es6!

import { UrlParts, parse} from "./urlutils";
export function urlparse(url: string): UrlParts { return parse(url); }
