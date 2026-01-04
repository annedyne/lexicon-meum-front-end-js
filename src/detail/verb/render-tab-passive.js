import {renderConjugationByVoice} from "@detail/verb/render-conjugation-shared.js";
import {TAB_KEY} from "@detail/verb/tabs/index.js";

export function renderPassiveConjugation(conjugations, gender) {
    return renderConjugationByVoice(conjugations, gender, TAB_KEY.PASSIVE, "passive-conjugation-table");
}
