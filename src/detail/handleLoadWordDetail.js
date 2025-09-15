import { fetchWordDetailData } from "../api/apiClient.js";
import { renderWordDetail } from "./renderWordDetail.js";
import {toErrorMessage} from "@src/utils/errors.js";

export async function handleLoadWordDetail(lemma, lexemeId) {
  try {
    const data = await fetchWordDetailData(lemma, lexemeId);
    renderWordDetail(data);
  } catch (err) {
    const raw = toErrorMessage(err,  "There was a problem loading details.")

    const actionWord = raw.includes("fetch") ? "loading" : "displaying";
    throw new Error(`There was a problem ${actionWord} details for ${lemma}.`);
  }
}
