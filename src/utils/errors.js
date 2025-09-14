export function toErrorMessage(err, fallback = "Something went wrong") {
    if (err && typeof err === "object" && "message" in err) return String(err.message);
    if (typeof err === "string") return err;
    try {
        return JSON.stringify(err);
    } catch {
        return fallback;
    }
}
