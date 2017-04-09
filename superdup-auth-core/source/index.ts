export { ILogger, ConsoleLogger } from "./logger"; 
export { IBaseProvider, IImplicitProvider, IHybridProvider } from "./providers/index";
export { ILoginManager } from "./iloginmanager"; 
export { UserInfo } from "./userinfo";
export { IBuilderManager, ILogin, IImplicitBuilder } from "./builders"; 

export { createBuilderManager } from "./builders/impl";
import { createLoginManager } from "./impl"; 
import { createProviderManager } from "./providers/impl";

import { ILogger } from "./logger"; 
import { ILoginManager } from "./iloginmanager"; 
export function createLoginManager2(log: ILogger): ILoginManager
{
    return createLoginManager(createProviderManager(), log);
}

//export { UrlParts, parse} from "./impl";
import { UrlParts, parse} from "./impl";
export function urlparse(url: string): UrlParts { return parse(url); }
//export { decodeHash } from "./tokens/index"; 
