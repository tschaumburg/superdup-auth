import { ILog } from "superdup-auth-log"; 

export interface ILogService
{
    readonly log: ILog;
}

export class LogService implements ILogService
{
    constructor(private readonly logGetter: () => ILog) { }

    public get log(): ILog
    {
        return this.logGetter();
    }
}
