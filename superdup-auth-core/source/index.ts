export { ILog, ConsoleLog } from "superdup-auth-log";
export { IBaseProvider, IImplicitProvider, ImplicitSuccess, ImplicitFailure, ImplicitRedirecting, IHybridProvider } from "./providermanager";
export { FlowHelper, RequestInfo, AccessTokenInfo } from "./providermanager";
//export { ILoginManager } from "./loginmanager"; 
export { UserInfo } from "./userinfo";
export { IBuilderManager, IImplicitBuilder } from "./loginmanager/builders"; 
export { ILogin } from "./loginmanager";
export { IToken } from "./tokenmanager";
export { IAuthenticationManager } from "./iauthenticationmanager";
export { createAuthenticationManager } from "./authenticationmanager";

export { createBuilderManager } from "./loginmanager/builders/impl";
//import { createLoginManager } from "./impl"; 
//import { createProviderManager } from "./loginmanager/providers/impl";

//import { ILog } from "superdup-auth-log"; 
//import { ILoginManager } from "./loginmanager"; 
//export function createLoginManager2(log: ILog): ILoginManager
//{
//    return createLoginManager(createProviderManager(), log);
//}

export { UrlParts, urlparse} from "./utils";
//import { UrlParts, parse} from "./impl";
//export function urlparse(url: string): UrlParts { return parse(url); }
////export { decodeHash } from "./tokens/index"; 
