import { ObjectId } from 'mongodb';

export function safeCallback(callback: any, ...args: any[]) {
    if (!callback) return;
    callback(...args);
}

export function safeObjectArgument(object: any) {
    if (!object) return {};
    if (Array.isArray(object)) {
        if (object.length === 0) return {};
        return object;
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