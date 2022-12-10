import { ObjectId } from 'mongodb';
import { logger } from '../logger';

export function safeCallback(callback: any, ...args: any[]) {
    if (!callback) return;
    callback(...args);
}

export function safeObjectArgument(object: any) {
    if (!object) return {};
    if (Array.isArray(object)) {
        if (object.length === 0) return {};
        if (!(typeof object[0] === "string" && Array.isArray(object[1]))) return object;

        let jsonString = object[0];
        let parameters = object[1];
        const placeholders = jsonString.split('?').length - 1;
        if (placeholders !== parameters.length) {
            throw new Error("Number of placeholders does not match number of parameters");
        }
        for (let i = 0; i < placeholders; i++) {
            const parameter = parameters[i];
            jsonString = jsonString.replace('?', parameter);
        }
        try {
            object = JSON.parse(jsonString);
        } catch (error) {
            throw new Error("Invalid JSON string");
        }
    }
    if (typeof object !== "object") return {};
    if (object._id) object._id = new ObjectId(object._id);
    return object;
}

export function exportDocument(document: any) {
    if (!document) return;
    if (document._id && typeof document._id !== "string") {
        document._id = document._id.toString();
    }
    return document;
};

export function exportDocuments(documents: any) {
    if (!documents) return;
    if (!Array.isArray(documents)) return;
    return documents.map((document => exportDocument(document)));
}

export async function catchAndThrow(callback: any, error: any) {
    safeCallback(callback, true);
    throw new Error(error);
}
