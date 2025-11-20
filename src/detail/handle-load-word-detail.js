import { fetchWordDetailData } from "@api";
import { toErrorMessage } from "@utils";
import { renderWordDetail } from "./render-word-detail.js";
import { setSearchInput } from "./search-context.js";

export async function handleLoadWordDetail(searchForm, lexemeId) {
    try {

        // Set the search context before rendering.
        setSearchInput(searchForm);

        const data = await fetchWordDetailData(searchForm, lexemeId);
        renderWordDetail(data);
    } catch (error) {
        const raw = toErrorMessage(error, "There was a problem loading details.");

        const actionWord = raw.includes("fetch") ? "loading" : "displaying";
        throw new Error(`There was a problem ${actionWord} details for ${searchForm}.`);
    }
}
