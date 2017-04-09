import { IStorage } from "./istorage";
import { ILogger } from "../../logger";

export class DataStore<TData>
{
    public constructor(private readonly _storage: IStorage, private readonly _storagekey: string, private readonly log: ILogger)
    {
        this.loadState();
    }

    private _cache: { [id: string]: TData; } = {};

    public set(key: string, value: TData): void
    {
        this._cache[key] = value;
        this.saveState();
    }

    public get(key: string): TData 
    {
        return this._cache[key];
    }

    public clear(key: string): void
    {
        this._cache[key] = null;
        this.saveState();
    }

    private loadState()
    {
        this.log.info("Reloading persisted state...");
        var serializedState = this._storage.retrieve(this._storagekey);
        this._cache = JSON.parse(serializedState) as { [id: string]: TData; };

        if (!this._cache)
        {
            this.log.info("...no data found");
            this._cache = {};
        }
    }

    private saveState()
    {
        this.log.info("Persisting state...");

        var serializedState = JSON.stringify(this._cache);
        this._storage.store(this._storagekey, serializedState);
    }
}