export function logger(message: string, type: string = "INFO") {
    console.log(`[MongoDB][${type}]:${message}`);
}