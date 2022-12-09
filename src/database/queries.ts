import { getCollection } from ".";
import { InsertOneResult, InsertManyResult, UpdateResult, Document, DeleteResult } from "mongodb";
import * as utils from "../utils";

export async function find(params: any, callback: any) {
    params = params || {};
    if (!params.collection) throw new Error("No collection provided");

    const collection = await getCollection(params.collection);

    params.query = utils.safeObjectArgument(params.query);
    params.options = utils.safeObjectArgument(params.options);

    collection.find(params.query, params.options).toArray().then((documents: any) => {
        utils.safeCallback(callback, utils.exportDocuments(documents));
    }).catch((error: any) => {
        throw new Error(error);
    });
}

export async function findOne(params: any, callback: any) {
    params = params || {};
    if (!params.collection) throw new Error("No collection provided");

    const collection = await getCollection(params.collection);

    params.query = utils.safeObjectArgument(params.query);
    params.options = utils.safeObjectArgument(params.options);

    collection.findOne(params.query, params.options).then((document: any) => {
        utils.safeCallback(callback, utils.exportDocument(document));
    }).catch((error: any) => {
        throw new Error(error);
    });
}

export async function insertOne(params: any, callback: any) {
    params = params || {};
    if (!params.collection) throw new Error("No collection provided");

    const collection = await getCollection(params.collection);

    params.document = utils.safeObjectArgument(params.document);

    collection.insertOne(params.document).then((result: InsertOneResult) => {
        let resultObject = {
            acknowledged: result.acknowledged,
            insertedId: result.insertedId.toString(),
        }
        utils.safeCallback(callback, resultObject);
    }).catch((error: any) => {
        throw new Error(error);
    });
}

export async function insertMany(params: any, callback: any) {
    params = params || {};
    if (!params.collection) throw new Error("No collection provided");

    const collection = await getCollection(params.collection);
    params.documents = utils.safeObjectArgument(params.documents);

    collection.insertMany(params.documents).then((result: InsertManyResult) => {
        let resultObject = {
            acknowledged: result.acknowledged,
            insertedCount: result.insertedCount,
            insertedIds: {},
        };
        let insertedIds: any = {};
        for (let key in result.insertedIds) {
            insertedIds[key] = result.insertedIds[key].toString();
        }
        resultObject.insertedIds = insertedIds;
        utils.safeCallback(callback, resultObject);
    }).catch((error: any) => {
        throw new Error(error);
    });
}

async function dbUpdate(one: boolean, params: any, callback: any) {
    params = params || {};
    if (!params.collection) throw new Error("No collection provided");

    const collection = await getCollection(params.collection);

    params.query = utils.safeObjectArgument(params.query);
    params.update = utils.safeObjectArgument(params.update);
    params.options = utils.safeObjectArgument(params.options);

    const promise = one ? collection.updateOne(params.query, params.update, params.options) : collection.updateMany(params.query, params.update, params.options)
    promise.then((result: UpdateResult | Document) => {
        let resultObject = {
            acknowledged: result.acknowledged,
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
            upsertedCount: result.upsertedCount,
            upsertedId: result.upsertedId ? result.upsertedId.toString() : null,
        }
        utils.safeCallback(callback, resultObject);
    }).catch((error: any) => {
        throw new Error(error);
    });
}

export async function updateOne(params: any, callback: any) {
    return dbUpdate(true, params, callback);
}

export async function updateMany(params: any, callback: any) {
    return dbUpdate(false, params, callback);
}

async function dbDelete(one: boolean, params: any, callback: any) {
    params = params || {};
    if (!params.collection) throw new Error("No collection provided");

    const collection = await getCollection(params.collection);

    params.filter = utils.safeObjectArgument(params.filter);
    params.options = utils.safeObjectArgument(params.options);

    const promise = one ? collection.deleteOne(params.filter, params.options) : collection.deleteMany(params.filter, params.options);
    promise.then((result: DeleteResult) => {
        let resultObject = {
            acknowledged: result.acknowledged,
            deletedCount: result.deletedCount,
        }
        utils.safeCallback(callback, resultObject);
    }).catch((error: any) => {
        throw new Error(error);
    });
}

export async function deleteOne(params: any, callback: any) {
    return dbDelete(true, params, callback);
}

export async function deleteMany(params: any, callback: any) {
    return dbDelete(false, params, callback);
}

export async function count(params: any, callback: any) {
    params = params || {};
    if (!params.collection) throw new Error("No collection provided");

    const collection = await getCollection(params.collection);

    params.query = utils.safeObjectArgument(params.query);
    params.options = utils.safeObjectArgument(params.options);

    collection.countDocuments(params.query, params.options).then((count: number) => {
        utils.safeCallback(callback, count);
    }).catch((error: any) => {
        throw new Error(error);
    });
}