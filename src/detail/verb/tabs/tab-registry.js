import { renderActiveConjugation, renderPassiveConjugation, renderParticipleInflections } from "@detail/verb";
import {TAB_KEY} from "./tab-keys.js";

export const TABS = {
    [TAB_KEY.ACTIVE]: {
        render: renderActiveConjugation,
        dataSource: 'conjugations' // specify which part of inflectionTable to use
    },
    [TAB_KEY.PASSIVE]: {
        render: renderPassiveConjugation,
        dataSource: 'conjugations'
    },
    [TAB_KEY.PARTICIPLE]: {
        render: renderParticipleInflections,
        dataSource: 'participles' // participle tab needs participle data
    },
};
