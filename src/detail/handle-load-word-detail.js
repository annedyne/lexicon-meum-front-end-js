import { fetchWordDetailData } from "@api";
import { toErrorMessage } from "@utilities";
import { renderWordDetail } from "./render-word-detail.js";
import {setSearchInputContext} from "./detail-context.js";
import Router from "@services/router.js";

export async function handleLoadWordDetail(searchForm, lexemeId) {
    try {

        // Set the search context before rendering.
        setSearchInputContext(searchForm);

        const data = await fetchWordDetailData(searchForm, lexemeId);
        renderWordDetail(data);
        const {lemma} = data;
        Router.go(`/detail/${lemma}`);
    } catch (error) {
        const raw = toErrorMessage(error, "There was a problem loading details.");

        const actionWord = raw.includes("fetch") ? "loading" : "displaying";
        throw new Error(`There was a problem ${actionWord} details for ${searchForm}.`);
    }
}
