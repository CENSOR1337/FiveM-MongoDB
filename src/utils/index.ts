export function safeCallback(callback: any, ...args: any[]) {
    callback(...args);
}

export function safeQuery(query: any) {
    if (!query) {
        throw new Error("No query provided");
    }
    if (typeof query !== "object") {
        throw new Error("Query must be an object");
    }
    return query;
}