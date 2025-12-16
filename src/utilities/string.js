// Helper to capitalize strings
export function capitalize(toBeCapitalized = "") {
    if (!toBeCapitalized) {
        return "";
    }
    const lowerCase = toBeCapitalized.toLowerCase();
    const words = lowerCase.split(' ');

    const capitalizedWords = words.map(word => {
        // Handle multiple spaces gracefully
        if (!word) {
            return "";
        }
        return word[0].toUpperCase() + word.slice(1);
    });

    return capitalizedWords.join(" ");

}