import { ILog, ConsoleLog } from "superdup-auth-log";

import { UserInfo } from "superdup-auth-core-providers";
import { DataStore, LocalStorageStore } from "./datastore"; 

export class UserStore extends DataStore<UserInfo>
{
    constructor(log: ILog)
    {
        super(new LocalStorageStore(), "sdpIdTokens", log);
    }
}
