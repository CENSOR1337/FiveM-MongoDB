import { getCollection } from ".";
import { InsertOneResult, InsertManyResult, UpdateResult, Document, DeleteResult } from "mongodb";
import * as utils from "../utils";

async function catchAndThrow(callback: any, error: any) {
    utils.safeCallback(callback, true);
    throw new Error(error);
}

export async function find(params: any, callback: any) {
    params = params || {};
    if (!params.collection) {
        catchAndThrow(callback, "No collection provided");
    }

    const collection = await getCollection(params.collection);

    let filter = utils.safeObjectArgument(params.filter);
    let options = utils.safeObjectArgument(params.options);

    collection.find(filter, options).toArray().then((documents: any) => {
        utils.safeCallback(callback, false, utils.exportDocuments(documents));
    }).catch((error: any) => {
        catchAndThrow(callback, error);
    });
}

export async function findOne(params: any, callback: any) {
    params = params || {};
    if (!params.collection) throw new Error("No collection provided");

    const collection = await getCollection(params.collection);

    let filter = utils.safeObjectArgument(params.filter);
    let options = utils.safeObjectArgument(params.options);

    collection.findOne(filter, options).then((document: any) => {
        utils.safeCallback(callback, false, utils.exportDocument(document));
    }).catch((error: any) => {
        catchAndThrow(callback, error);
    });
}

export async function insertOne(params: any, callback: any) {
    params = params || {};
    if (!params.collection) throw new Error("No collection provided");

    const collection = await getCollection(params.collection);

    let document = utils.safeObjectArgument(params.document);

    collection.insertOne(document).then((result: InsertOneResult) => {
        let resultObject = {
            acknowledged: result.acknowledged,
            insertedId: result.insertedId.toString(),
        }
        utils.safeCallback(callback, false, resultObject);
    }).catch((error: any) => {
        catchAndThrow(callback, error);
    });
}

export async function insertMany(params: any, callback: any) {
    params = params || {};
    if (!params.collection) throw new Error("No collection provided");

    const collection = await getCollection(params.collection);
    let documents = utils.safeObjectArgument(params.documents);

    collection.insertMany(documents).then((result: InsertManyResult) => {
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
        utils.safeCallback(callback, false, resultObject);
    }).catch((error: any) => {
        catchAndThrow(callback, error);
    });
}

async function dbUpdate(one: boolean, params: any, callback: any) {
    params = params || {};
    if (!params.collection) throw new Error("No collection provided");

    const collection = await getCollection(params.collection);

    let filter = utils.safeObjectArgument(params.filter);
    let update = utils.safeObjectArgument(params.update);
    let options = utils.safeObjectArgument(params.options);

    const promise = one ? collection.updateOne(filter, update, options) : collection.updateMany(filter, update, options)
    promise.then((result: UpdateResult | Document) => {
        let resultObject = {
            acknowledged: result.acknowledged,
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
            upsertedCount: result.upsertedCount,
            upsertedId: result.upsertedId ? result.upsertedId.toString() : null,
        }
        utils.safeCallback(callback, false, resultObject);
    }).catch((error: any) => {
        catchAndThrow(callback, error);
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

    let filter = utils.safeObjectArgument(params.filter);
    let options = utils.safeObjectArgument(params.options);

    const promise = one ? collection.deleteOne(filter, options) : collection.deleteMany(filter, options);
    promise.then((result: DeleteResult) => {
        let resultObject = {
            acknowledged: result.acknowledged,
            deletedCount: result.deletedCount,
        }
        utils.safeCallback(callback, false, resultObject);
    }).catch((error: any) => {
        catchAndThrow(callback, error);
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

    let filter = utils.safeObjectArgument(params.filter);
    let options = utils.safeObjectArgument(params.options);

    collection.countDocuments(filter, options).then((count: number) => {
        utils.safeCallback(callback, false, count);
    }).catch((error: any) => {
        catchAndThrow(callback, error);
    });
}