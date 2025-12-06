import { renderActiveConjugation, renderTabPassive } from "@detail/verb";
import {TAB_KEY} from "./tab-keys.js";

export const TABS = {
    [TAB_KEY.ACTIVE]: {
        render: renderActiveConjugation,
    },
    [TAB_KEY.PASSIVE]: {
        render: renderTabPassive,
    },
    [TAB_KEY.PARTICIPLE]: {
        render: () => {
            console.log("Participle tab not yet implemented");
        },
    },
};
