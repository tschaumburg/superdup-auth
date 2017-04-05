import { UserInfo } from "../users";
import { ILogger } from "../logger";
import { IBaseFlow, IThreeLegggedFlow } from "./baseflow";

export interface Hybrid<TOptions> extends IThreeLegggedFlow
{
    initHybrid(options: TOptions, log: ILogger): void;
}
