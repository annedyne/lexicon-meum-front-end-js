export async function handleWordLookup(query, fetchSuggestions, isSuffixSearch) {

    const trimmedQuery = query.trim();
  try {
    const suggestions = await fetchSuggestions(trimmedQuery, isSuffixSearch);

    if (Array.isArray(suggestions) && suggestions.length > 0) {
      return { status: "success", data: suggestions };
    } else {
      return { status: "error", message: "No suggestions found" };
    }
  } catch {
    return {
      status: "error",
      message: `We're having trouble fetching suggestions right now. Please try again later.`,
    };
  }
}
