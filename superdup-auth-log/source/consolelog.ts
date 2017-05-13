import { ILogTarget } from "./ilogtarget";
import { ILog } from "./ilog";
import { Log } from "./log";

export class ConsoleLog 
{
    private static _target: ILogTarget = null;
    private static _log: ILog = null;
    public static get Current(): ILog
    {
        if (ConsoleLog._target == null)
            ConsoleLog._target = new ConsoleTarget();

        if (ConsoleLog._log == null)
            ConsoleLog._log = new Log(ConsoleLog._target, "");

        return ConsoleLog._log;
    }
}

class ConsoleTarget implements ILogTarget
{
    //constructor(private readonly _console: ILog, private readonly _prefix: string = "") { }

    public fatal(logname: string, message: string): void
    {
        console.error(logname + ": " + message);
    }

    public error(logname: string, message: string): void
    {
        console.error(logname + ": " + message);
    }

    public warn(logname: string, message: string): void
    {
        console.warn(logname + ": " + message);
    }

    public info(logname: string, message: string): void
    {
        console.info(logname + ": " + message);
    }

    public debug(logname: string, message: string): void
    {
        console.debug(logname + ": " + message);
    }
}