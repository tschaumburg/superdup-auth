import { UserInfo } from "../users";
import { ILogger } from "../logger";
import { IBaseFlow } from "./baseflow";

export interface Implicit<TOptions> extends IBaseFlow
{
    initImplicit(options: TOptions, log: ILogger): void;
}
