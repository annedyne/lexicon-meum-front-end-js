export function toErrorMessage(error, fallback = "Something went wrong") {
    if (error && typeof error === "object" && "message" in error) {
        return String(error.message);
    }
    if (typeof error === "string") {
        return error;
    }
    try {
        return JSON.stringify(error);
    } catch {
        return fallback;
    }
}
