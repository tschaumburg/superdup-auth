import logging = require("../logger");
import { IImplicitProvider } from "./iimplicit";
import { IHybridProvider } from "./ihybrid";
import { IBaseProvider } from "./ibase";

export interface IProviderManager
{
    registerImplicitProvider(loginName: string, creator: () => IImplicitProvider, log: logging.ILogger): void;
    registerHybridProvider(loginName: string, creator: () => IHybridProvider, log: logging.ILogger): void;
    findProvider(name: string): IBaseProvider;
}
