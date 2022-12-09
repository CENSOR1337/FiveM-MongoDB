import { MongoClient, Db } from "mongodb";
import { url, dbName } from "../config"
import { logger } from "../logger";

const mongoClient = new MongoClient(url);
let db: Db;
let connected: boolean = false;

mongoClient.connect().then(() => {
    db = mongoClient.db(dbName);
    connected = true;
    logger(`Connected to database "${dbName}"`);
}).catch((error: any) => {
    logger(`Error connecting to database "${dbName}": ${error}`, "ERROR");
});


async function waitForConnection() {
    if (!isConnected()) {
        await new Promise<void>((resolve) => {
            (function wait() {
                if (isConnected()) {
                    return resolve();
                } 
                setTimeout(wait);
            })();
        });
    }
}

export function isConnected() {
    return connected;
}

export async function getCollection(collectionName: string) {
    if (!isConnected()) await waitForConnection();
    return db.collection(collectionName);
}