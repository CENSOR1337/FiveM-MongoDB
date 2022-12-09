import { MongoClient, MongoClientOptions, Db } from "mongodb";
import { safeCallback, safeQuery } from "../utils";
import { logger } from "../logger";

export class MongoInstance {
    name: string;
    url: string;
    dbName: string;
    options: MongoClientOptions;
    private client: MongoClient;
    private db: Db;

    constructor(name: string, url: string, dbName: string, options: MongoClientOptions) {
        if (!name || name === "null") {
            throw new Error("No name provided");
        }
        if (!url || url === "null") {
            throw new Error("No url provided");
        }
        if (!dbName || dbName === "null") {
            throw new Error("No database name provided");
        }
        this.name = name;
        this.url = url;
        this.dbName = dbName;
        this.options = options;
        this.client = new MongoClient(this.url, options);
        this.client.connect();
        this.db = this.client.db(this.dbName);
        if (this.db) {
            this.log(`Connected to database "${this.dbName}"`);
        }
    }

    log = (message: string, type: string = "INFO") => {
        logger(`[${this.name}] ${message}`, type);
    }

    getDbConnection() {
        if (!this.db) {
            this.log(`exports.getDbConnection: Error "No database connection".`, "ERROR");
            return;
        }
        return this.db;
    }

    getCollection(collectionName: string) {
        const db = this.getDbConnection();
        if (!db) return
        return db.collection(collectionName);
    }

    async find(params: any, callback: any) {
        const collection = this.getCollection(params.collection);
        if (!collection) {
            throw new Error("No collection provided");
        }
        const query = safeQuery(params.query);
        let result = collection.find(query, params.options);
        const documents = await result.toArray();
        safeCallback(callback, documents);
    }

    closeConnection() {
        this.client.close();
        this.log(`Connection to database "${this.dbName}" closed.`);
    }
}