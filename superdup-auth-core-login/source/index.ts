//export { FlowHelper, RequestInfo, AccessTokenInfo } from "./providers";
export { ILoginManager } from "./iloginmanager"; 
//export { IBuilderManager, IImplicitBuilder } from "./builders"; 
export { ILogin } from "./ilogin";
export { IHybridLogin } from "./ihybridlogin";
export { IImplicitLogin } from "./iimplicitlogin";
export { IAuthCodeLogin } from "./iauthcodelogin";

//export { createBuilderManager } from "./builders/impl";
export { createLoginManager } from "./impl/loginmanager"; 
//import { createProviderManager } from "./providers/impl";

//import { ILog } from "superdup-auth-log"; 
//import { ILoginManager } from "./iloginmanager"; 
//export function createLoginManager2(log: ILog): ILoginManager
//{
//    return createLoginManager(createProviderManager(), log);
//}

////export { UrlParts, parse} from "./impl";
//import { UrlParts, parse} from "./impl";
//export function urlparse(url: string): UrlParts { return parse(url); }
////export { decodeHash } from "./tokens/index"; 
