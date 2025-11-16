import { fetchWordDetailData } from "@api";
import { toErrorMessage } from "@utils";
import { renderWordDetail } from "./renderWordDetail.js";
import { setSearchInput } from "./searchContext.js";

export async function handleLoadWordDetail(searchForm, lexemeId) {
    try {

        // Set the search context before rendering.
        setSearchInput(searchForm);

        const data = await fetchWordDetailData(searchForm, lexemeId);
        renderWordDetail(data);
    } catch (err) {
        const raw = toErrorMessage(err, "There was a problem loading details.");

        const actionWord = raw.includes("fetch") ? "loading" : "displaying";
        throw new Error(`There was a problem ${actionWord} details for ${searchForm}.`);
    }
}
